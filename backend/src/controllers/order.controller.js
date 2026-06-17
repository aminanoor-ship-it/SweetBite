const OrderModel = require('../models/order.model');

async function list(req, res) {
  res.json({ success: true, data: await OrderModel.list(req.query) });
}
async function getOne(req, res) {
  const order = await OrderModel.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  res.json({ success: true, data: order });
}
async function create(req, res) {
  const order = await OrderModel.create(req.body, req.user.id);
  res.status(201).json({ success: true, data: order });
}
async function updateStatus(req, res) {
  if (!(await OrderModel.findById(req.params.id))) return res.status(404).json({ success: false, message: 'Order not found.' });
  res.json({ success: true, data: await OrderModel.updateStatus(req.params.id, req.body.status) });
}
async function remove(req, res) {
  await OrderModel.remove(req.params.id, req.user.id);
  res.json({ success: true, data: { message: 'Order deleted and stock restored.' } });
}
module.exports = { list, getOne, create, updateStatus, remove };
