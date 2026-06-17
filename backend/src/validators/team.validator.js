const { body } = require('express-validator');

const emailNormalizer = { gmail_remove_dots: false };

const teamMemberRules = [
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Enter a valid email address.')
    .normalizeEmail(emailNormalizer),
  body('role_title')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Role title is too long.'),
  body('display_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer.')
];

module.exports = { teamMemberRules };
