const express = require('express');
const router = express.Router();
const {
    getMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    deleteMaintenanceRequest,
    getMyMaintenanceRequests,
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, getMaintenanceRequests).post(protect, createMaintenanceRequest);
router.get('/my', protect, getMyMaintenanceRequests);
router.route('/:id')
    .put(protect, authorize('admin', 'manager'), updateMaintenanceRequest)
    .delete(protect, authorize('admin', 'manager'), deleteMaintenanceRequest);

module.exports = router;
