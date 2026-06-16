const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/dashboard', require('./dashboard.routes'));
router.use('/products', require('./product.routes'));
router.use('/categories', require('./category.routes'));
router.use('/customers', require('./customer.routes'));
router.use('/orders', require('./order.routes'));
router.use('/sales', require('./sales.routes'));
router.use('/reports', require('./report.routes'));
router.use('/settings', require('./settings.routes'));
router.use('/team', require('./team.routes'));
router.use('/users', require('./user.routes'));

module.exports = router;
