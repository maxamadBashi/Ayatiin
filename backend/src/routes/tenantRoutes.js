const express = require('express');
const router = express.Router();
const {
    getTenants,
    createTenant,
    updateTenant,
    deleteTenant,
    getMyTenantProfile,
} = require('../controllers/tenantController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, getMyTenantProfile);
router.route('/').get(protect, getTenants).post(protect, authorize('admin', 'manager'), createTenant);
router
    .route('/:id')
    .put(protect, authorize('admin', 'manager'), updateTenant)
    .delete(protect, authorize('admin'), deleteTenant);

module.exports = router;
