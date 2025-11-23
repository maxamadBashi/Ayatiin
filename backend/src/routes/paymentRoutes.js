const express = require('express');
const router = express.Router();
const {
    getPayments,
    createPayment,
    updatePayment,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, getPayments).post(protect, createPayment);
router.route('/:id').put(protect, authorize('admin', 'manager'), updatePayment);

module.exports = router;
