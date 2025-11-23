const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    type: {
        type: String,
        enum: ['inquiry', 'maintenance', 'lease', 'booking', 'purchase', 'other'],
        default: 'inquiry',
    },
    message: {
        type: String,
    },
    visitDate: {
        type: Date,
    },
    amount: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
