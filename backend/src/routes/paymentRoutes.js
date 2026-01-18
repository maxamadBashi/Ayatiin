const express = require('express');
const router = express.Router();
const {
    getPayments,
    createPayment,
    updatePayment,
    generateInvoices
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getPayments)
    .post(createPayment);

router.post('/generate-invoices', authorize('admin'), generateInvoices);

router.route('/:id')
    .put(authorize('admin', 'manager'), updatePayment);

module.exports = router;
