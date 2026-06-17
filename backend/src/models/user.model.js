const { pool } = require('../config/db');

const baseSelect = `
  SELECT u.user_id AS id, u.full_name, u.username, u.email, u.password_hash,
         u.profile_image, u.status, u.created_at, r.role_name AS role
  FROM users u JOIN roles r ON r.role_id = u.role_id`;

async function findByEmail(email) {
  const [rows] = await pool.execute(`${baseSelect} WHERE LOWER(u.email) = LOWER(?) LIMIT 1`, [email]);
  return rows[0] || null;
}

async function findByUsername(username) {
  const [rows] = await pool.execute(`${baseSelect} WHERE LOWER(u.username) = LOWER(?) LIMIT 1`, [username]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.execute(`${baseSelect} WHERE u.user_id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function create({ fullName, username, email, passwordHash, roleName = 'Staff', status = 'active', profileImage = null }) {
  const [roles] = await pool.execute('SELECT role_id FROM roles WHERE role_name = ? LIMIT 1', [roleName]);
  if (!roles[0]) throw Object.assign(new Error('The selected user role does not exist.'), { status: 400 });
  const [result] = await pool.execute(
    `INSERT INTO users (role_id, full_name, username, email, password_hash, profile_image, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [roles[0].role_id, fullName, username, email, passwordHash, profileImage, status]
  );
  return findById(result.insertId);
}

async function updateProfile(id, { fullName, email, profileImage }) {
  const fields = ['full_name = ?', 'email = ?'];
  const values = [fullName, email];
  if (profileImage) {
    fields.push('profile_image = ?');
    values.push(profileImage);
  }
  values.push(id);
  await pool.execute(`UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`, values);
  return findById(id);
}

async function updatePassword(id, passwordHash) {
  await pool.execute('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', [passwordHash, id]);
}

async function list() {
  const [rows] = await pool.execute(`${baseSelect} ORDER BY u.created_at DESC`);
  return rows;
}

async function updateByAdmin(id, { fullName, username, email, role, status }) {
  const [roles] = await pool.execute('SELECT role_id FROM roles WHERE role_name = ? LIMIT 1', [role]);
  if (!roles[0]) throw Object.assign(new Error('The selected user role does not exist.'), { status: 400 });

  const [existingUsername] = await pool.execute(
    'SELECT user_id FROM users WHERE LOWER(username) = LOWER(?) AND user_id != ? LIMIT 1',
    [username, id]
  );
  if (existingUsername[0]) throw Object.assign(new Error('This username is already taken.'), { status: 409 });

  const [existingEmail] = await pool.execute(
    'SELECT user_id FROM users WHERE LOWER(email) = LOWER(?) AND user_id != ? LIMIT 1',
    [email, id]
  );
  if (existingEmail[0]) throw Object.assign(new Error('This email is already registered.'), { status: 409 });

  await pool.execute(
    `UPDATE users SET role_id = ?, full_name = ?, username = ?, email = ?, status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [roles[0].role_id, fullName, username, email, status, id]
  );
  return findById(id);
}

async function deactivate(id) {
  await pool.execute("UPDATE users SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", [id]);
}

async function isAdmin(id) {
  const [rows] = await pool.execute(
    `SELECT u.user_id FROM users u JOIN roles r ON r.role_id = u.role_id
     WHERE u.user_id = ? AND r.role_name = 'Admin' AND u.status = 'active' LIMIT 1`, [id]
  );
  return rows[0] ? true : false;
}

async function countActiveAdmins() {
  const [[row]] = await pool.execute(
    `SELECT COUNT(*) AS count FROM users u JOIN roles r ON r.role_id = u.role_id
     WHERE r.role_name = 'Admin' AND u.status = 'active'`
  );
  return row.count;
}

module.exports = { findByEmail, findByUsername, findById, create, updateProfile, updatePassword, list, updateByAdmin, deactivate, isAdmin, countActiveAdmins };
