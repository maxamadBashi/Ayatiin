const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    lease: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lease',
        required: true,
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        enum: ['rent', 'deposit', 'other'],
        default: 'rent',
    },
    method: {
        type: String,
        enum: ['cash', 'bank_transfer', 'mobile_money'],
        required: true,
    },
    receiptId: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'overdue'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
