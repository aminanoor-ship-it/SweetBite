const { body } = require('express-validator');

const emailNormalizer = { gmail_remove_dots: false };

const loginRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(emailNormalizer),
  body('password').isString().notEmpty().withMessage('Password is required.')
];
const registerRules = [
  body('full_name').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters.'),
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(emailNormalizer),
  body('password').isLength({ min: 8, max: 100 }).withMessage('Password must contain at least 8 characters.')
];
const forgotPasswordRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(emailNormalizer)
];
const resetPasswordRules = [
  body('token').isString().notEmpty().withMessage('Reset token is required.'),
  body('new_password').isLength({ min: 8, max: 100 }).withMessage('Password must contain at least 8 characters.')
];
const profileRules = [
  body('full_name').trim().isLength({ min: 2, max: 100 }).withMessage('Full name is required.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(emailNormalizer)
];
const passwordRules = [
  body('current_password').isString().notEmpty().withMessage('Current password is required.'),
  body('new_password').isLength({ min: 8, max: 100 }).withMessage('New password must contain at least 8 characters.')
];

module.exports = { loginRules, registerRules, forgotPasswordRules, resetPasswordRules, profileRules, passwordRules };
