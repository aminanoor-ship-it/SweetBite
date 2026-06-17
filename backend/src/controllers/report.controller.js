const { pool } = require('../config/db');

function dateFilter(req) {
  const { period, from, to } = req.query;
  const conds = [];
  const vals = [];
  if (period === 'today') {
    conds.push("o.order_date = CURDATE()");
  } else if (period === 'week') {
    conds.push("o.order_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)");
  } else if (period === 'month') {
    conds.push("o.order_date >= DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY)");
  } else if (period === 'year') {
    conds.push("YEAR(o.order_date) = YEAR(CURDATE())");
  } else if (from && to) {
    conds.push("o.order_date BETWEEN ? AND ?");
    vals.push(from, to);
  }
  return { where: conds.length ? ' AND ' + conds.join(' AND ') : '', vals };
}

async function profitLossSummary(req, res) {
  const { where, vals } = dateFilter(req);
  const [[row]] = await pool.execute(`
    SELECT
      COALESCE(SUM(oi.line_total * o.total_amount / NULLIF(o.subtotal, 0)), 0) AS revenue,
      COALESCE(SUM(oi.quantity * COALESCE(p.cost_price, 0)), 0) AS cost,
      COALESCE(SUM(CASE WHEN oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0) >= COALESCE(p.cost_price,0)
        THEN (oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0) - COALESCE(p.cost_price,0)) * oi.quantity ELSE 0 END), 0) AS profit,
      COALESCE(SUM(CASE WHEN oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0) < COALESCE(p.cost_price,0)
        THEN (COALESCE(p.cost_price,0) - oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0)) * oi.quantity ELSE 0 END), 0) AS loss
    FROM order_items oi
    JOIN orders o ON o.order_id = oi.order_id
    JOIN products p ON p.product_id = oi.product_id
    WHERE o.order_status IN ('completed','delivered')${where}`, vals);
  const revenue = Number(row.revenue);
  const cost = Number(row.cost);
  const profit = Number(row.profit);
  const loss = Number(row.loss);
  const margin = revenue > 0 ? Math.round((profit / revenue) * 10000) / 100 : 0;
  res.json({ success: true, data: { revenue, cost, profit, loss, margin } });
}

async function profitLossProducts(req, res) {
  const { where, vals } = dateFilter(req);
  const [rows] = await pool.execute(`
    SELECT
      p.product_name AS name,
      MAX(COALESCE(p.cost_price, 0)) AS cost_price,
      MAX(oi.unit_price) AS selling_price,
      SUM(oi.quantity) AS sold_quantity,
      SUM(oi.line_total * o.total_amount / NULLIF(o.subtotal, 0)) AS revenue,
      SUM(oi.quantity * COALESCE(p.cost_price, 0)) AS cost,
      SUM(CASE WHEN oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0) >= COALESCE(p.cost_price,0)
        THEN (oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0) - COALESCE(p.cost_price,0)) * oi.quantity ELSE 0 END) AS profit,
      SUM(CASE WHEN oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0) < COALESCE(p.cost_price,0)
        THEN (COALESCE(p.cost_price,0) - oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0)) * oi.quantity ELSE 0 END) AS loss
    FROM order_items oi
    JOIN orders o ON o.order_id = oi.order_id
    JOIN products p ON p.product_id = oi.product_id
    WHERE o.order_status IN ('completed','delivered')${where}
    GROUP BY p.product_id
    ORDER BY loss DESC, profit DESC`, vals);
  const data = rows.map(r => {
    const revenue = Number(r.revenue);
    const profit = Number(r.profit);
    return { ...r, sold_quantity: Number(r.sold_quantity), revenue, cost: Number(r.cost), profit, loss: Number(r.loss), margin: revenue > 0 ? Math.round((profit / revenue) * 10000) / 100 : 0 };
  });
  res.json({ success: true, data });
}

async function profitLossMonthly(req, res) {
  const year = req.query.year || new Date().getFullYear();
  const [rows] = await pool.execute(`
    SELECT
      MONTH(o.order_date) AS month,
      COALESCE(SUM(oi.line_total * o.total_amount / NULLIF(o.subtotal, 0)), 0) AS revenue,
      COALESCE(SUM(oi.quantity * COALESCE(p.cost_price, 0)), 0) AS cost,
      COALESCE(SUM(CASE WHEN oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0) >= COALESCE(p.cost_price,0)
        THEN (oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0) - COALESCE(p.cost_price,0)) * oi.quantity ELSE 0 END), 0) AS profit,
      COALESCE(SUM(CASE WHEN oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0) < COALESCE(p.cost_price,0)
        THEN (COALESCE(p.cost_price,0) - oi.unit_price * o.total_amount / NULLIF(o.subtotal, 0)) * oi.quantity ELSE 0 END), 0) AS loss
    FROM order_items oi
    JOIN orders o ON o.order_id = oi.order_id
    JOIN products p ON p.product_id = oi.product_id
    WHERE o.order_status IN ('completed','delivered') AND YEAR(o.order_date) = ?
    GROUP BY MONTH(o.order_date) ORDER BY month`, [year]);
  const months = Array.from({ length: 12 }, (_, i) => {
    const found = rows.find(r => Number(r.month) === i + 1);
    return { month: i + 1, label: new Date(year, i).toLocaleString('en', { month: 'short' }), revenue: found ? Number(found.revenue) : 0, cost: found ? Number(found.cost) : 0, profit: found ? Number(found.profit) : 0, loss: found ? Number(found.loss) : 0 };
  });
  res.json({ success: true, data: months });
}

async function sales(req, res) {
  const [rows] = await pool.execute(`
    SELECT o.order_number, o.order_date, c.full_name AS customer, o.total_amount,
           o.payment_status, o.order_status
    FROM orders o JOIN customers c ON c.customer_id = o.customer_id
    ORDER BY o.order_date DESC`);
  res.json({ success: true, data: rows });
}
async function products(req, res) {
  const [rows] = await pool.execute(`
    SELECT p.product_name, p.sku, c.category_name, p.price, p.stock_quantity,
           COALESCE(SUM(oi.quantity),0) AS units_sold
    FROM products p JOIN categories c ON c.category_id = p.category_id
    LEFT JOIN order_items oi ON oi.product_id = p.product_id
    GROUP BY p.product_id ORDER BY units_sold DESC`);
  res.json({ success: true, data: rows });
}
async function customers(req, res) {
  const [rows] = await pool.execute(`
    SELECT c.full_name, c.phone, c.email, c.location, COUNT(o.order_id) AS orders,
           COALESCE(SUM(o.total_amount),0) AS total_spent
    FROM customers c LEFT JOIN orders o ON o.customer_id = c.customer_id
    GROUP BY c.customer_id ORDER BY total_spent DESC`);
  res.json({ success: true, data: rows });
}
async function stock(req, res) {
  const [rows] = await pool.execute(`
    SELECT p.product_name, p.sku, p.stock_quantity, p.low_stock_limit, p.status
    FROM products p ORDER BY p.stock_quantity`);
  res.json({ success: true, data: rows });
}
module.exports = { profitLossSummary, profitLossProducts, profitLossMonthly, sales, products, customers, stock };
