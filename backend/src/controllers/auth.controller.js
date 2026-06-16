const bcrypt = require('bcrypt');
const crypto = require('crypto');
const UserModel = require('../models/user.model');
const { createToken } = require('../utils/token');
const { publicFileUrl } = require('../utils/files');

const resetTokens = new Map();

function presentUser(req, user) {
  return {
    id: user.id,
    full_name: user.full_name,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    profile_image: publicFileUrl(req, user.profile_image)
  };
}

async function register(req, res) {
  const { full_name, username, email, password } = req.body;
  if (await UserModel.findByEmail(email)) return res.status(409).json({ success: false, message: 'This email is already registered.' });
  if (await UserModel.findByUsername(username)) return res.status(409).json({ success: false, message: 'This username is already taken.' });
  const passwordHash = await bcrypt.hash(password, 12);
  const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : null;
  const user = await UserModel.create({ fullName: full_name, username, email, passwordHash, roleName: 'Staff', status: 'active', profileImage });
  res.status(201).json({ success: true, data: { message: 'Account created successfully.', user: presentUser(req, user) } });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await UserModel.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
  }
  if (user.status !== 'active') return res.status(403).json({ success: false, message: 'This account is not active.' });
  const remember = req.body.remember === true || req.body.remember === 'true';
  const expiresIn = remember ? '30d' : '1d';
  const token = createToken(user, expiresIn);
  res.json({ success: true, data: { token, user: presentUser(req, user) } });
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(404).json({ success: false, message: 'No account found with that email address.' });
  const token = crypto.randomBytes(32).toString('hex');
  resetTokens.set(token, { userId: user.id, expires: Date.now() + 3600000 });
  const resetUrl = `${req.headers.origin || req.protocol + '://' + req.get('host')}/reset-password.html?token=${token}`;
  res.json({ success: true, data: { message: 'A password reset link has been sent to your email.', resetUrl } });
}

async function resetPassword(req, res) {
  const { token, new_password } = req.body;
  const entry = resetTokens.get(token);
  if (!entry || entry.expires < Date.now()) {
    if (token) resetTokens.delete(token);
    return res.status(400).json({ success: false, message: 'This reset link has expired. Please request a new one.' });
  }
  const user = await UserModel.findById(entry.userId);
  if (!user) { resetTokens.delete(token); return res.status(400).json({ success: false, message: 'User not found.' }); }
  const passwordHash = await bcrypt.hash(new_password, 12);
  await UserModel.updatePassword(entry.userId, passwordHash);
  resetTokens.delete(token);
  res.json({ success: true, data: { message: 'Your password has been reset successfully. You can now sign in.' } });
}

async function profile(req, res) {
  res.json({ success: true, data: presentUser(req, req.user) });
}

async function updateProfile(req, res) {
  const duplicate = await UserModel.findByEmail(req.body.email);
  if (duplicate && duplicate.id !== req.user.id) return res.status(409).json({ success: false, message: 'This email is already used by another user.' });
  const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : null;
  const user = await UserModel.updateProfile(req.user.id, { fullName: req.body.full_name, email: req.body.email, profileImage });
  res.json({ success: true, data: { full_name: user.full_name, email: user.email, image: publicFileUrl(req, user.profile_image) } });
}

async function changePassword(req, res) {
  const user = await UserModel.findById(req.user.id);
  if (!(await bcrypt.compare(req.body.current_password, user.password_hash))) {
    return res.status(400).json({ success: false, message: 'The current password is incorrect.' });
  }
  const passwordHash = await bcrypt.hash(req.body.new_password, 12);
  await UserModel.updatePassword(req.user.id, passwordHash);
  res.json({ success: true, data: { message: 'Password changed successfully.' } });
}

function logout(req, res) {
  res.json({ success: true, data: { message: 'Logged out successfully.' } });
}

module.exports = { register, login, forgotPassword, resetPassword, profile, updateProfile, changePassword, logout, presentUser };
