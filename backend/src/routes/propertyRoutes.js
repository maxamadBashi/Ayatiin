const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const uploadToCloudinary = require('../middleware/cloudinaryUpload');

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ message: 'Too many files. Maximum is 10 files.' });
        }
        return res.status(400).json({ message: err.message });
    }
    if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

// Wrapper to handle multer errors
const uploadMiddleware = (req, res, next) => {
    uploadToCloudinary(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
};

router.route('/')
    .get(getProperties)
    .post(
        protect,
        authorize('admin', 'manager', 'superadmin'),
        uploadMiddleware,
        createProperty
    );

router.route('/:id')
    .get(getPropertyById)
    .put(
        protect,
        authorize('admin', 'manager', 'superadmin'),
        uploadMiddleware,
        updateProperty
    )
    .delete(protect, authorize('admin', 'manager', 'superadmin'), deleteProperty);

module.exports = router;
