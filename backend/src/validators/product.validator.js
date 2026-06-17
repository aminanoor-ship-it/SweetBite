const { body } = require('express-validator');

const productRules = [
  body('name').trim().isLength({ min: 2, max: 150 }).withMessage('Product name is required.'),
  body('category').trim().isLength({ min: 2, max: 100 }).withMessage('Product category is required.'),
  body('sku').trim().isLength({ min: 2, max: 50 }).withMessage('SKU is required.'),
  body('price').isFloat({ gt: 0 }).withMessage('Product price must be greater than zero.'),
  body('costPrice').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Cost price cannot be negative.'),
  body('stock').isInt({ min: 0 }).withMessage('Stock quantity cannot be negative.'),
  body('lowStockLimit').optional().isInt({ min: 0 }).withMessage('Low stock limit cannot be negative.'),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }).withMessage('Description is too long.')
];
module.exports = { productRules };
