const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { teamUpload } = require('../middleware/upload.middleware');
const asyncHandler = require('../utils/asyncHandler');
const controller = require('../controllers/team.controller');
const { teamMemberRules } = require('../validators/team.validator');

router.get('/', protect, asyncHandler(controller.list));
router.post('/', protect, allowRoles('Admin'), teamUpload.single('image'), teamMemberRules, validate, asyncHandler(controller.create));
router.put('/:id', protect, allowRoles('Admin'), teamUpload.single('image'), teamMemberRules, validate, asyncHandler(controller.update));
router.delete('/:id', protect, allowRoles('Admin'), asyncHandler(controller.remove));

module.exports = router;
