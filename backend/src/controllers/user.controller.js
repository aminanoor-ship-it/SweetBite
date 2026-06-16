const UserModel = require('../models/user.model');
const { presentUser } = require('./auth.controller');

async function list(req, res) {
  const users = await UserModel.list();
  res.json({ success: true, data: users.map(user => presentUser(req, user)) });
}

async function update(req, res) {
  const { fullName, username, email, role, status } = req.body;
  if (!fullName || !username || !email || !role || !status) {
    return res.status(400).json({ success: false, message: 'All fields are required: fullName, username, email, role, status.' });
  }
  const user = await UserModel.updateByAdmin(req.params.id, { fullName, username, email, role, status });
  res.json({ success: true, data: presentUser(req, user) });
}

async function remove(req, res) {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ success: false, message: 'You cannot deactivate your own account.' });
  }
  const targetId = Number(req.params.id);
  if (await UserModel.isAdmin(targetId)) {
    const adminCount = await UserModel.countActiveAdmins();
    if (adminCount <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate the last active admin account.' });
    }
  }
  await UserModel.deactivate(req.params.id);
  res.json({ success: true, data: { message: 'User deactivated successfully.' } });
}

module.exports = { list, update, remove };
