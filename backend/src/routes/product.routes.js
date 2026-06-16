const router = require('express').Router();
const controller = require('../controllers/product.controller');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');
const { productUpload } = require('../middleware/upload.middleware');
const { productRules } = require('../validators/product.validator');
const { validate } = require('../middleware/validate.middleware');

router.use(protect);
router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getOne));
router.post('/', allowRoles('Admin', 'Staff'), productUpload.single('image'), productRules, validate, asyncHandler(controller.create));
router.put('/:id', allowRoles('Admin', 'Staff'), productUpload.single('image'), productRules, validate, asyncHandler(controller.update));
router.delete('/:id', allowRoles('Admin'), asyncHandler(controller.remove));
module.exports = router;
