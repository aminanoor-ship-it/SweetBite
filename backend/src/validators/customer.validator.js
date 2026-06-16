const { body } = require('express-validator');

const customerRules = [
  body('full_name').trim().isLength({ min: 2, max: 100 }).withMessage('Customer name is required.'),
  body('phone').trim().matches(/^[0-9+()\-\s]{7,20}$/).withMessage('Enter a valid phone number.'),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('location').trim().isLength({ min: 2, max: 150 }).withMessage('Customer location is required.'),
  body('address').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('Address is too long.')
];
module.exports = { customerRules };
