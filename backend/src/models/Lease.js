const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    monthlyRent: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'terminated', 'expired'],
        default: 'active',
    },
}, {
    timestamps: true,
});

const Lease = mongoose.model('Lease', leaseSchema);

module.exports = Lease;
