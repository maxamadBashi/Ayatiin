const express = require('express');
const router = express.Router();
const {
    getMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequest,
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMaintenanceRequests).post(protect, createMaintenanceRequest);
router.route('/:id').put(protect, updateMaintenanceRequest);

module.exports = router;
