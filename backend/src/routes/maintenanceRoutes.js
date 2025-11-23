const express = require('express');
const router = express.Router();
const {
    getMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequest,
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, getMaintenanceRequests).post(protect, createMaintenanceRequest);
router.route('/:id').put(protect, authorize('admin', 'manager'), updateMaintenanceRequest);

module.exports = router;
