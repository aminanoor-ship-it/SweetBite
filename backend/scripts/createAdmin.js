require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../src/config/db');
const UserModel = require('../src/models/user.model');

async function run() {
  const fullName = process.env.ADMIN_NAME || 'SweetBite Admin';
  const username = process.env.ADMIN_USERNAME || 'admin';
  const email = process.env.ADMIN_EMAIL;
  
  if (!email) {
    console.error('ADMIN_EMAIL must be set in .env file.');
    process.exitCode = 1;
    return;
  }
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 8) {
    console.error('ADMIN_PASSWORD must be set in .env and be at least 8 characters.');
    process.exitCode = 1;
    return;
  }

  if (await UserModel.findByEmail(email)) {
    console.log(`Admin account already exists: ${email}`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await UserModel.create({ fullName, username, email, passwordHash, roleName: 'Admin', status: 'active' });
  console.log('Admin account created successfully.');
  console.log(`Email: ${email}`);
  console.log('Change the password after the first login.');
}

run().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => pool.end());
