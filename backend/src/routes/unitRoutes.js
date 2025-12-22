const express = require('express');
const router = express.Router();
const {
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
} = require('../controllers/unitController');
const { protect, authorize } = require('../middleware/auth');

// Allow same admin roles here as properties (admin, manager, superadmin)
router
    .route('/')
    .get(protect, getUnits)
    .post(protect, authorize('admin', 'manager', 'superadmin'), createUnit);

router
    .route('/:id')
    .put(protect, authorize('admin', 'manager', 'superadmin'), updateUnit)
    .delete(protect, authorize('admin', 'manager', 'superadmin'), deleteUnit);

module.exports = router;
