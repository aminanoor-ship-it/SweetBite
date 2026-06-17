const { pool } = require('../config/db');

async function list() {
  const [rows] = await pool.execute(
    `SELECT member_id AS id, full_name AS name, email, image_path AS image, role_title, display_order
     FROM team_members WHERE status = 'active' ORDER BY display_order, member_id`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT member_id AS id, full_name AS name, email, image_path AS image, role_title, display_order
     FROM team_members WHERE member_id = ? LIMIT 1`, [id]
  );
  return rows[0] || null;
}

async function findByEmail(email, excludeId = 0) {
  const [rows] = await pool.execute(
    'SELECT member_id AS id FROM team_members WHERE LOWER(email) = LOWER(?) AND member_id != ? LIMIT 1',
    [email, excludeId]
  );
  return rows[0] || null;
}

async function create({ fullName, email, imagePath, roleTitle, displayOrder }) {
  const [result] = await pool.execute(
    `INSERT INTO team_members (full_name, email, image_path, role_title, display_order, status)
     VALUES (?, ?, ?, ?, ?, 'active')`,
    [fullName, email, imagePath || null, roleTitle || null, displayOrder || 0]
  );
  return findById(result.insertId);
}

async function update(id, { fullName, email, imagePath, roleTitle, displayOrder }) {
  const fields = ['full_name = ?', 'email = ?', 'role_title = ?', 'display_order = ?'];
  const values = [fullName, email, roleTitle || null, displayOrder || 0];
  if (imagePath) {
    fields.push('image_path = ?');
    values.push(imagePath);
  }
  values.push(id);
  await pool.execute(
    `UPDATE team_members SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE member_id = ?`,
    values
  );
  return findById(id);
}

async function remove(id) {
  await pool.execute("UPDATE team_members SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE member_id = ?", [id]);
}

module.exports = { list, findById, findByEmail, create, update, remove };
