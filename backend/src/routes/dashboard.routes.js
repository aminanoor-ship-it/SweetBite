const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');
const { getDashboard } = require('../controllers/dashboard.controller');
router.get('/', protect, asyncHandler(getDashboard));
module.exports = router;
