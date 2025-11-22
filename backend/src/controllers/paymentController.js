const Payment = require('../models/Payment');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({})
            .populate('tenant', 'name')
            .populate('lease');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
    const { lease, tenant, amount, date, type, status } = req.body;

    try {
        const payment = new Payment({
            lease,
            tenant,
            amount,
            date,
            type,
            status,
        });

        const createdPayment = await payment.save();
        res.status(201).json(createdPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a payment
// @route   PUT /api/payments/:id
// @access  Private
const updatePayment = async (req, res) => {
    const { status } = req.body;

    try {
        const payment = await Payment.findById(req.params.id);

        if (payment) {
            payment.status = status || payment.status;

            const updatedPayment = await payment.save();
            res.json(updatedPayment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPayments,
    createPayment,
    updatePayment,
};
