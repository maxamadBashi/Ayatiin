const express = require('express');
const router = express.Router();
const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getProperties)
    .post(protect, authorize('admin', 'manager', 'superadmin'), upload.array('images'), createProperty);

router.route('/:id')
    .get(getPropertyById)
    .put(protect, authorize('admin', 'manager', 'superadmin'), upload.array('images'), updateProperty)
    .delete(protect, authorize('admin', 'manager', 'superadmin'), deleteProperty);

module.exports = router;
