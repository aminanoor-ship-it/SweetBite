const { pool } = require('../config/db');
const OrderModel = require('../models/order.model');
const { publicFileUrl } = require('../utils/files');

async function summary(req, res) {
  const [[stats]] = await pool.query(`
    SELECT
      COALESCE(SUM(CASE WHEN order_status IN ('completed','delivered') THEN total_amount ELSE 0 END),0) AS revenue,
      COUNT(*) AS orders,
      (SELECT COALESCE(SUM(quantity),0) FROM order_items) AS sold,
      SUM(order_status = 'processing') AS pending
    FROM orders`);
  const [topRows] = await pool.query(`
    SELECT p.product_id AS id, p.product_name AS name, p.price, p.image_path AS image,
           SUM(oi.quantity) AS sold
    FROM order_items oi JOIN products p ON p.product_id = oi.product_id
    GROUP BY p.product_id, p.product_name, p.price, p.image_path
    ORDER BY sold DESC LIMIT 3`);
  const [chartRows] = await pool.query(`
    SELECT DATE_FORMAT(order_date, '%b %d') AS label, SUM(total_amount) AS amount FROM orders
    WHERE order_status IN ('completed','delivered')
    GROUP BY order_date, DATE_FORMAT(order_date, '%b %d') ORDER BY order_date LIMIT 45`);
  const max = Math.max(1, ...chartRows.map(row => Number(row.amount)));
  const chart = chartRows.length > 1 ? chartRows.map(row => Math.round((Number(row.amount) / max) * 100)) : [0, 0];
  const chartLabels = chartRows.length > 1 ? chartRows.map(row => row.label) : ['', ''];
  res.json({ success: true, data: {
    stats: { revenue: Number(stats.revenue), orders: Number(stats.orders), sold: Number(stats.sold), pending: Number(stats.pending) },
    top: topRows.map(row => ({ ...row, sold: Number(row.sold), image: publicFileUrl(req, row.image) })),
    recent: (await OrderModel.latest(7)),
    chart,
    chartLabels
  }});
}
module.exports = { summary };
