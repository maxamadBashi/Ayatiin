const express = require('express');
const router = express.Router();
const {
    getTenants,
    createTenant,
    updateTenant,
    deleteTenant,
} = require('../controllers/tenantController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTenants).post(protect, createTenant);
router
    .route('/:id')
    .put(protect, updateTenant)
    .delete(protect, deleteTenant);

module.exports = router;
