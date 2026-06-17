const ProductModel = require('../models/product.model');
const { publicFileUrl } = require('../utils/files');

function present(req, product) {
  return { ...product, image: publicFileUrl(req, product.image) };
}

async function list(req, res) {
  const products = await ProductModel.list(req.query);
  res.json({ success: true, data: products.map(product => present(req, product)) });
}
async function getOne(req, res) {
  const product = await ProductModel.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
  res.json({ success: true, data: present(req, product) });
}
async function create(req, res) {
  const image = req.file ? `/uploads/products/${req.file.filename}` : null;
  const product = await ProductModel.create({
    ...req.body,
    price: Number(req.body.price), stock: Number(req.body.stock),
    costPrice: req.body.costPrice != null ? Number(req.body.costPrice) : null,
    lowStockLimit: req.body.lowStockLimit != null ? Number(req.body.lowStockLimit) : undefined,
    image, createdBy: req.user.id
  });
  res.status(201).json({ success: true, data: present(req, product) });
}
async function update(req, res) {
  if (!(await ProductModel.findById(req.params.id))) return res.status(404).json({ success: false, message: 'Product not found.' });
  const image = req.file ? `/uploads/products/${req.file.filename}` : null;
  const product = await ProductModel.update(req.params.id, {
    ...req.body,
    price: Number(req.body.price), stock: Number(req.body.stock),
    costPrice: req.body.costPrice != null ? Number(req.body.costPrice) : null,
    lowStockLimit: req.body.lowStockLimit != null ? Number(req.body.lowStockLimit) : undefined,
    image
  });
  res.json({ success: true, data: present(req, product) });
}
async function remove(req, res) {
  if (!(await ProductModel.findById(req.params.id))) return res.status(404).json({ success: false, message: 'Product not found.' });
  await ProductModel.remove(req.params.id);
  res.json({ success: true, data: { message: 'Product deactivated successfully.' } });
}
module.exports = { list, getOne, create, update, remove };
