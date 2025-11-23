const express = require('express');
const router = express.Router();
const {
    getRequests,
    getMyRequests,
    createRequest,
    updateRequestStatus,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('admin', 'manager', 'superadmin'), getRequests)
    .post(protect, authorize('customer', 'tenant'), createRequest);

router.get('/my', protect, authorize('customer', 'tenant'), getMyRequests);

router.patch('/:id/status', protect, authorize('admin', 'manager', 'superadmin'), updateRequestStatus);

module.exports = router;
