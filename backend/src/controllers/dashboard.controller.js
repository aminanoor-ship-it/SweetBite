const { pool } = require('../config/db');
const OrderModel = require('../models/order.model');

async function getDashboard(req, res) {
  const month = req.query.month;
  if (month && !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ success: false, message: 'Month must be in YYYY-MM format.' });
  }

  let ordersWhere = '';
  let completedWhere = '';
  let processingWhere = '';
  const vals = [];
  if (month) {
    ordersWhere = ` WHERE DATE_FORMAT(order_date, '%Y-%m') = '${month}'`;
    completedWhere = ` WHERE order_status IN ('completed','delivered') AND DATE_FORMAT(order_date, '%Y-%m') = '${month}'`;
    processingWhere = ` WHERE order_status = 'processing' AND DATE_FORMAT(order_date, '%Y-%m') = '${month}'`;
  } else {
    completedWhere = ` WHERE order_status IN ('completed','delivered')`;
    processingWhere = ` WHERE order_status = 'processing'`;
  }

  const [[stats]] = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM customers WHERE status = 'active') AS customers,
      (SELECT COUNT(*) FROM orders${ordersWhere}) AS orders,
      (SELECT COALESCE(SUM(total_amount), 0) FROM orders${completedWhere}) AS sales,
      (SELECT COUNT(*) FROM orders${processingWhere}) AS pending`
  );
  const safeLimit = 5;
  const dealsQuery = month
    ? `SELECT o.order_id, o.order_number, o.order_date, o.total_amount, o.order_status,
              o.payment_status, c.full_name AS customer_name, c.address AS location, pm.method_name AS payment_method
       FROM orders o
       JOIN customers c ON c.customer_id = o.customer_id
       LEFT JOIN payment_methods pm ON pm.payment_method_id = o.payment_method_id
       WHERE DATE_FORMAT(o.order_date, "%Y-%m") = ?
       ORDER BY o.created_at DESC LIMIT ${safeLimit}`
    : `SELECT o.order_id, o.order_number, o.order_date, o.total_amount, o.order_status,
              o.payment_status, c.full_name AS customer_name, c.address AS location, pm.method_name AS payment_method
       FROM orders o
       JOIN customers c ON c.customer_id = o.customer_id
       LEFT JOIN payment_methods pm ON pm.payment_method_id = o.payment_method_id
       ORDER BY o.created_at DESC LIMIT ${safeLimit}`;
  const dealVals = month ? [month] : [];
  const [orderRows] = await pool.execute(dealsQuery, dealVals);
  const orderIds = orderRows.map(o => o.order_id);
  const itemsMap = orderIds.length ? await (async () => {
    const placeholders = orderIds.map(() => '?').join(',');
    const [rows] = await pool.execute(
      `SELECT oi.order_id, p.product_id, p.product_name AS name, oi.quantity, oi.unit_price, oi.line_total AS total_price
       FROM order_items oi JOIN products p ON p.product_id = oi.product_id
       WHERE oi.order_id IN (${placeholders}) ORDER BY oi.order_item_id`, orderIds);
    const map = new Map();
    rows.forEach(r => {
      const item = { product_id: r.product_id, name: r.name, quantity: Number(r.quantity), unit_price: Number(r.unit_price), total_price: Number(r.total_price) };
      if (!map.has(r.order_id)) map.set(r.order_id, []);
      map.get(r.order_id).push(item);
    });
    return map;
  })() : new Map();
  const deals = orderRows.map(order => ({
    id: order.order_id,
    order_number: order.order_number,
    customer_name: order.customer_name,
    location: order.location || '',
    date: order.order_date,
    total: Number(order.total_amount),
    status: order.order_status,
    payment_status: order.payment_status,
    payment_method: order.payment_method,
    items: itemsMap.get(order.order_id) || []
  }));
  let revenueQuery, revenueVals = [];
  if (month) {
    revenueQuery = `
      SELECT DATE_FORMAT(order_date, '%b %d') AS label, COALESCE(SUM(total_amount),0) AS amount
      FROM orders WHERE order_status IN ('completed','delivered') AND DATE_FORMAT(order_date, '%Y-%m') = ?
      GROUP BY DATE_FORMAT(order_date, '%b %d'), DATE(order_date) ORDER BY DATE(order_date) LIMIT 31`;
    revenueVals = [month];
  } else {
    revenueQuery = `
      SELECT DATE_FORMAT(order_date, '%b %Y') AS label, COALESCE(SUM(total_amount),0) AS amount
      FROM orders WHERE order_status IN ('completed','delivered')
      GROUP BY YEAR(order_date), MONTH(order_date), DATE_FORMAT(order_date, '%b %Y')
      ORDER BY YEAR(order_date), MONTH(order_date) LIMIT 24`;
  }
  const [revenueRows] = await pool.execute(revenueQuery, revenueVals);
  res.json({ success: true, data: {
    stats: { customers: Number(stats.customers), orders: Number(stats.orders), sales: Number(stats.sales), pending: Number(stats.pending) },
    deals,
    revenue: revenueRows.map(row => Number(row.amount)),
    revenueLabels: revenueRows.map(row => row.label)
  }});
}
module.exports = { getDashboard };
