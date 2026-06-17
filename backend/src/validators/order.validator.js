const { body, param } = require('express-validator');

const statuses = ['processing', 'completed', 'rejected', 'on_hold', 'in_transit', 'delivered'];
const paymentStatuses = ['unpaid', 'partial', 'paid', 'refunded'];

const createOrderRules = [
  body('customer_id').isInt({ min: 1 }).withMessage('Select a customer.'),
  body('date').isISO8601().withMessage('Enter a valid order date.'),
  body('payment_method').trim().isLength({ min: 2, max: 50 }).withMessage('Select a payment method.'),
  body('status').optional().isIn(statuses).withMessage('Invalid order status.'),
  body('payment_status').optional().isIn(paymentStatuses).withMessage('Invalid payment status.'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount cannot be negative.'),
  body('items').isArray({ min: 1 }).withMessage('An order must contain at least one product.'),
  body('items.*.product_id').isInt({ min: 1 }).withMessage('A selected product is invalid.'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least one.'),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }).withMessage('Notes are too long.'),
  body('items').custom((items) => {
    const ids = items.map(i => i.product_id);
    if (ids.length !== new Set(ids).size) throw new Error('Each product can only be added once per order.');
    return true;
  })
];
const statusRules = [
  param('id').isInt({ min: 1 }).withMessage('Invalid order ID.'),
  body('status').isIn(statuses).withMessage('Invalid order status.')
];
module.exports = { createOrderRules, statusRules, statuses, paymentStatuses };
