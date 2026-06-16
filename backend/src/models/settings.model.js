const { pool } = require('../config/db');

async function getAll() {
  const [rows] = await pool.execute('SELECT setting_key, setting_value FROM settings');
  return Object.fromEntries(rows.map(row => [row.setting_key, row.setting_value]));
}

async function update(values) {
  const entries = Object.entries(values);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const [key, value] of entries) {
      await connection.execute(
        `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP`,
        [key, String(value)]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return getAll();
}

module.exports = { getAll, update };
