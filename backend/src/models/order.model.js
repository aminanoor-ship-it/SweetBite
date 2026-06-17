const { pool } = require('../config/db');
const { presentOrder } = require('../utils/orderPresenter');

async function fetchItems(orderIds, connection = pool) {
  if (!orderIds.length) return new Map();
  const placeholders = orderIds.map(() => '?').join(',');
  const [rows] = await connection.execute(
    `SELECT oi.order_id, p.product_id, p.product_name AS name, oi.quantity, oi.unit_price,
            oi.line_total AS total_price
     FROM order_items oi JOIN products p ON p.product_id = oi.product_id
     WHERE oi.order_id IN (${placeholders}) ORDER BY oi.order_item_id`, orderIds
  );
  const map = new Map();
  rows.forEach(row => {
    const item = { product_id: row.product_id, name: row.name, quantity: Number(row.quantity), unit_price: Number(row.unit_price), total_price: Number(row.total_price) };
    if (!map.has(row.order_id)) map.set(row.order_id, []);
    map.get(row.order_id).push(item);
  });
  return map;
}

async function latest(limit = 5) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 5, 100));
  const [orders] = await pool.execute(
    `SELECT o.order_id, o.order_number, o.order_date, o.total_amount, o.order_status,
            o.payment_status, c.full_name AS customer_name, pm.method_name AS payment_method
     FROM orders o
     JOIN customers c ON c.customer_id = o.customer_id
     LEFT JOIN payment_methods pm ON pm.payment_method_id = o.payment_method_id
     ORDER BY o.created_at DESC LIMIT ${safeLimit}`
  );
  const orderIds = orders.map(o => o.order_id);
  const items = await fetchItems(orderIds);
  return orders.map(order => ({
    id: order.order_id,
    order_number: order.order_number,
    customer_name: order.customer_name,
    date: order.order_date,
    total: Number(order.total_amount),
    status: order.order_status,
    payment_status: order.payment_status,
    payment_method: order.payment_method,
    items: items.get(order.order_id) || []
  }));
}

async function list({ search = '', status = '', date = '' } = {}) {
  const where = [];
  const values = [];
  if (status && status !== 'all') { where.push('o.order_status = ?'); values.push(status); }
  if (date) { where.push('o.order_date = ?'); values.push(date); }
  if (search) {
    where.push(`(o.order_number LIKE ? OR c.full_name LIKE ? OR c.address LIKE ? OR c.location LIKE ?
      OR EXISTS (SELECT 1 FROM order_items sx JOIN products sp ON sp.product_id = sx.product_id WHERE sx.order_id = o.order_id AND sp.product_name LIKE ?))`);
    values.push(...Array(5).fill(`%${search}%`));
  }
  const [orders] = await pool.execute(
    `SELECT o.*, c.full_name AS customer_name, c.address, c.location, pm.method_name AS payment_method
     FROM orders o
     JOIN customers c ON c.customer_id = o.customer_id
     LEFT JOIN payment_methods pm ON pm.payment_method_id = o.payment_method_id
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY o.created_at DESC`, values
  );
  const items = await fetchItems(orders.map(order => order.order_id));
  return orders.map(order => presentOrder({ ...order, id: order.order_id }, items.get(order.order_id) || []));
}

async function findById(id, connection = pool) {
  const [orders] = await connection.execute(
    `SELECT o.*, c.full_name AS customer_name, c.address, c.location, pm.method_name AS payment_method
     FROM orders o JOIN customers c ON c.customer_id = o.customer_id
     LEFT JOIN payment_methods pm ON pm.payment_method_id = o.payment_method_id
     WHERE o.order_id = ? LIMIT 1`, [id]
  );
  if (!orders[0]) return null;
  const items = await fetchItems([id], connection);
  return presentOrder({ ...orders[0], id: orders[0].order_id }, items.get(Number(id)) || items.get(id) || []);
}

async function paymentMethodId(name, connection) {
  const [rows] = await connection.execute('SELECT payment_method_id FROM payment_methods WHERE method_name = ? LIMIT 1', [name]);
  if (rows[0]) return rows[0].payment_method_id;
  const [result] = await connection.execute('INSERT INTO payment_methods (method_name) VALUES (?)', [name]);
  return result.insertId;
}

async function create(data, userId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [customers] = await connection.execute("SELECT * FROM customers WHERE customer_id = ? AND status = 'active' LIMIT 1", [data.customer_id]);
    if (!customers[0]) throw Object.assign(new Error('The selected customer does not exist.'), { status: 400 });

    const itemRows = [];
    let subtotal = 0;
    for (const item of data.items) {
      const [products] = await connection.execute(
        `SELECT product_id, product_name, price, stock_quantity, status
         FROM products WHERE product_id = ? FOR UPDATE`, [item.product_id]
      );
      const product = products[0];
      if (!product || product.status === 'inactive') throw Object.assign(new Error('A selected product does not exist.'), { status: 400 });
      const quantity = Number(item.quantity);
      if (quantity > product.stock_quantity) {
        throw Object.assign(new Error(`Only ${product.stock_quantity} ${product.product_name} items are available.`), { status: 400 });
      }
      const lineTotal = Number(product.price) * quantity;
      subtotal += lineTotal;
      itemRows.push({ product, quantity, lineTotal });
    }

    const discount = Number(data.discount || 0);
    if (discount < 0 || discount > subtotal) throw Object.assign(new Error('The discount is invalid.'), { status: 400 });
    const total = subtotal - discount;
    const paymentId = await paymentMethodId(data.payment_method, connection);
    const tempNumber = `TEMP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const [result] = await connection.execute(
      `INSERT INTO orders
       (order_number, customer_id, created_by, order_date, subtotal, discount, total_amount,
        payment_method_id, payment_status, order_status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tempNumber, data.customer_id, userId, data.date, subtotal, discount, total, paymentId,
       data.payment_status || 'unpaid', data.status || 'processing', data.notes || null]
    );
    const orderId = result.insertId;
    const orderNumber = `SB-${String(orderId).padStart(5, '0')}`;
    await connection.execute('UPDATE orders SET order_number = ? WHERE order_id = ?', [orderNumber, orderId]);

    for (const row of itemRows) {
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, row.product.product_id, row.quantity, row.product.price, row.lineTotal]
      );
      await connection.execute(
        `UPDATE products SET stock_quantity = stock_quantity - ?,
          status = CASE WHEN stock_quantity - ? <= 0 THEN 'out_of_stock' ELSE 'available' END,
          updated_at = CURRENT_TIMESTAMP WHERE product_id = ?`,
        [row.quantity, row.quantity, row.product.product_id]
      );
      await connection.execute(
        `INSERT INTO stock_movements (product_id, movement_type, quantity, reason, reference_id, created_by)
         VALUES (?, 'out', ?, 'Order created', ?, ?)`,
        [row.product.product_id, row.quantity, orderId, userId]
      );
    }
    await connection.commit();
    return findById(orderId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateStatus(id, status) {
  await pool.execute('UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?', [status, id]);
  return findById(id);
}

async function remove(id, userId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [orders] = await connection.execute('SELECT order_status FROM orders WHERE order_id = ? FOR UPDATE', [id]);
    if (!orders[0]) throw Object.assign(new Error('Order not found.'), { status: 404 });
    if (['completed', 'delivered'].includes(orders[0].order_status)) {
      throw Object.assign(new Error('Completed or delivered orders cannot be deleted.'), { status: 400 });
    }
    const [items] = await connection.execute('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [id]);
    for (const item of items) {
      await connection.execute(
        `UPDATE products SET stock_quantity = stock_quantity + ?,
          status = CASE WHEN status = 'out_of_stock' AND stock_quantity + ? > 0 THEN 'available' ELSE status END,
          updated_at = CURRENT_TIMESTAMP WHERE product_id = ?`,
        [item.quantity, item.quantity, item.product_id]);
      await connection.execute(
        `INSERT INTO stock_movements (product_id, movement_type, quantity, reason, reference_id, created_by)
         VALUES (?, 'in', ?, 'Order deleted; stock restored', ?, ?)`,
        [item.product_id, item.quantity, id, userId]
      );
    }
    await connection.execute('DELETE FROM orders WHERE order_id = ?', [id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { latest, list, findById, create, updateStatus, remove };
