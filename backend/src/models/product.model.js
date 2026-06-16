const { pool } = require('../config/db');

const select = `
  SELECT p.product_id AS id, p.product_name AS name, c.category_name AS category,
         p.sku, p.description, p.price, p.cost_price, p.stock_quantity AS stock,
         p.low_stock_limit, p.image_path AS image, p.status, p.created_at
  FROM products p JOIN categories c ON c.category_id = p.category_id`;

async function categoryId(name, connection = pool) {
  const [rows] = await connection.execute('SELECT category_id FROM categories WHERE category_name = ? LIMIT 1', [name]);
  if (rows[0]) return rows[0].category_id;
  const [result] = await connection.execute('INSERT INTO categories (category_name) VALUES (?)', [name]);
  return result.insertId;
}

async function list({ search = '', category = 'all', status = '' } = {}) {
  const where = [];
  const values = [];
  if (!status) where.push("p.status <> 'inactive'");
  if (search) {
    where.push('(p.product_name LIKE ? OR p.sku LIKE ? OR c.category_name LIKE ?)');
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (category && category !== 'all') {
    where.push('c.category_name = ?');
    values.push(category);
  }
  if (status) {
    where.push('p.status = ?');
    values.push(status);
  }
  const [rows] = await pool.execute(`${select}${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY p.created_at DESC`, values);
  return rows;
}

async function findById(id, connection = pool) {
  const [rows] = await connection.execute(`${select} WHERE p.product_id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const id = await categoryId(data.category);
  const status = Number(data.stock) > 0 ? 'available' : 'out_of_stock';
  const [result] = await pool.execute(
    `INSERT INTO products
      (category_id, product_name, sku, description, price, cost_price, stock_quantity, low_stock_limit, image_path, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.name, data.sku, data.description || null, data.price, data.costPrice != null ? data.costPrice : null, data.stock, data.lowStockLimit != null ? data.lowStockLimit : 5, data.image || null, status, data.createdBy]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const catId = await categoryId(data.category);
  const fields = [
    'category_id = ?', 'product_name = ?', 'sku = ?', 'description = ?',
    'price = ?', 'cost_price = ?', 'stock_quantity = ?', 'low_stock_limit = ?', 'status = ?'
  ];
  const values = [catId, data.name, data.sku, data.description || null, data.price, data.costPrice != null ? data.costPrice : null, data.stock, data.lowStockLimit != null ? data.lowStockLimit : 5, Number(data.stock) > 0 ? 'available' : 'out_of_stock'];
  if (data.image) {
    fields.push('image_path = ?');
    values.push(data.image);
  }
  values.push(id);
  await pool.execute(`UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?`, values);
  return findById(id);
}

async function remove(id) {
  await pool.execute("UPDATE products SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE product_id = ?", [id]);
}

module.exports = { list, findById, create, update, remove, categoryId };
