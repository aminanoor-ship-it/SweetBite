const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');
const { summary } = require('../controllers/sales.controller');
router.get('/summary', protect, asyncHandler(summary));
module.exports = router;
