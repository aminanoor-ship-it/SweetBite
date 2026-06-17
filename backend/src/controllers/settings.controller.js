const SettingsModel = require('../models/settings.model');
const { publicFileUrl } = require('../utils/files');

async function get(req, res) {
  const settings = await SettingsModel.getAll();
  res.json({ success: true, data: {
    company_name: settings.company_name || 'SweetBite',
    company_email: settings.company_email || '',
    phone: settings.phone || '',
    founded: settings.founded || '',
    currency: settings.currency || 'USD',
    profile: {
      full_name: req.user.full_name,
      email: req.user.email,
      image: publicFileUrl(req, req.user.profile_image)
    }
  }});
}
async function update(req, res) {
  const allowed = ['company_name', 'company_email', 'phone', 'founded', 'currency', 'low_stock_limit'];
  const values = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  res.json({ success: true, data: await SettingsModel.update(values) });
}
module.exports = { get, update };
