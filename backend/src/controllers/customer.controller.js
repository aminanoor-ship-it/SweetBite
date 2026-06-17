const CustomerModel = require('../models/customer.model');

async function list(req, res) {
  res.json({ success: true, data: await CustomerModel.list(req.query) });
}
async function getOne(req, res) {
  const customer = await CustomerModel.findById(req.params.id);
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
  res.json({ success: true, data: customer });
}
async function create(req, res) {
  const customer = await CustomerModel.create(req.body);
  res.status(201).json({ success: true, data: customer });
}
async function update(req, res) {
  if (!(await CustomerModel.findById(req.params.id))) return res.status(404).json({ success: false, message: 'Customer not found.' });
  res.json({ success: true, data: await CustomerModel.update(req.params.id, req.body) });
}
async function remove(req, res) {
  if (!(await CustomerModel.findById(req.params.id))) return res.status(404).json({ success: false, message: 'Customer not found.' });
  await CustomerModel.remove(req.params.id);
  res.json({ success: true, data: { message: 'Customer deactivated successfully.' } });
}
module.exports = { list, getOne, create, update, remove };
