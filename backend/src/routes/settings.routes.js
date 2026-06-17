const router = require('express').Router();
const controller = require('../controllers/settings.controller');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');
router.get('/', protect, asyncHandler(controller.get));
router.put('/', protect, allowRoles('Admin'), asyncHandler(controller.update));
module.exports = router;
