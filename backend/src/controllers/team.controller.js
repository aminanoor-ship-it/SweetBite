const TeamModel = require('../models/team.model');
const { publicFileUrl } = require('../utils/files');

function formatMember(req, member) {
  return { ...member, image: publicFileUrl(req, member.image) };
}

async function list(req, res) {
  const team = await TeamModel.list();
  res.json({ success: true, data: team.map(m => formatMember(req, m)) });
}

async function create(req, res) {
  const { full_name, email, role_title, display_order } = req.body;
  if (await TeamModel.findByEmail(email)) {
    return res.status(409).json({ success: false, message: 'This email is already used by another team member.' });
  }
  const imagePath = req.file ? `/uploads/team/${req.file.filename}` : null;
  const member = await TeamModel.create({ fullName: full_name, email, imagePath, roleTitle: role_title, displayOrder: display_order });
  res.status(201).json({ success: true, data: formatMember(req, member) });
}

async function update(req, res) {
  const { full_name, email, role_title, display_order } = req.body;
  const existing = await TeamModel.findByEmail(email, req.params.id);
  if (existing) {
    return res.status(409).json({ success: false, message: 'This email is already used by another team member.' });
  }
  const imagePath = req.file ? `/uploads/team/${req.file.filename}` : null;
  const member = await TeamModel.update(req.params.id, { fullName: full_name, email, imagePath, roleTitle: role_title, displayOrder: display_order });
  res.json({ success: true, data: formatMember(req, member) });
}

async function remove(req, res) {
  await TeamModel.remove(req.params.id);
  res.json({ success: true, data: { message: 'Team member removed successfully.' } });
}

module.exports = { list, create, update, remove };
