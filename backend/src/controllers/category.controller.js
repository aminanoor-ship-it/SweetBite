const { pool } = require('../config/db');

async function list(req, res) {
  const [rows] = await pool.execute("SELECT category_id AS id, category_name AS name, description, status FROM categories WHERE status = 'active' ORDER BY category_name");
  res.json({ success: true, data: rows });
}
async function create(req, res) {
  const [result] = await pool.execute('INSERT INTO categories (category_name, description) VALUES (?, ?)', [req.body.name, req.body.description || null]);
  res.status(201).json({ success: true, data: { id: result.insertId, name: req.body.name, description: req.body.description || '' } });
}
module.exports = { list, create };
