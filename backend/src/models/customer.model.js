const { pool } = require('../config/db');

async function list({ search = '' } = {}) {
  const values = [];
  let sql = `SELECT customer_id AS id, full_name, phone, email, location, address, status, created_at
             FROM customers WHERE status = 'active'`;
  if (search) {
    sql += ' AND (full_name LIKE ? OR phone LIKE ? OR email LIKE ? OR location LIKE ?)';
    values.push(...Array(4).fill(`%${search}%`));
  }
  sql += ' ORDER BY created_at DESC';
  const [rows] = await pool.execute(sql, values);
  return rows;
}

async function findById(id, connection = pool) {
  const [rows] = await connection.execute(
    `SELECT customer_id AS id, full_name, phone, email, location, address, status, created_at
     FROM customers WHERE customer_id = ? LIMIT 1`, [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const [result] = await pool.execute(
    `INSERT INTO customers (full_name, phone, email, location, address)
     VALUES (?, ?, ?, ?, ?)`,
    [data.full_name, data.phone, data.email || null, data.location, data.address || null]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  await pool.execute(
    `UPDATE customers SET full_name = ?, phone = ?, email = ?, location = ?, address = ?, updated_at = CURRENT_TIMESTAMP
     WHERE customer_id = ?`,
    [data.full_name, data.phone, data.email || null, data.location, data.address || null, id]
  );
  return findById(id);
}

async function remove(id) {
  await pool.execute("UPDATE customers SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE customer_id = ?", [id]);
}

module.exports = { list, findById, create, update, remove };
