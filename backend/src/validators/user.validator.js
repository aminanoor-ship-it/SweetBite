const { body } = require('express-validator');

const updateUserRules = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters.'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Enter a valid email address.')
    .normalizeEmail(),
  body('role')
    .isIn(['Admin', 'Staff'])
    .withMessage('Role must be either Admin or Staff.'),
  body('status')
    .isIn(['active', 'inactive', 'blocked'])
    .withMessage('Status must be active, inactive, or blocked.')
];

module.exports = { updateUserRules };
