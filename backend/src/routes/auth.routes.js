const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { profileUpload } = require('../middleware/upload.middleware');
const rules = require('../validators/auth.validator');

router.post('/register', profileUpload.single('image'), rules.registerRules, validate, asyncHandler(controller.register));
router.post('/login', rules.loginRules, validate, asyncHandler(controller.login));
router.post('/forgot-password', rules.forgotPasswordRules, validate, asyncHandler(controller.forgotPassword));
router.post('/reset-password', rules.resetPasswordRules, validate, asyncHandler(controller.resetPassword));
router.post('/logout', protect, controller.logout);
router.get('/profile', protect, asyncHandler(controller.profile));
router.put('/profile', protect, profileUpload.single('image'), rules.profileRules, validate, asyncHandler(controller.updateProfile));
router.put('/change-password', protect, rules.passwordRules, validate, asyncHandler(controller.changePassword));

module.exports = router;
