const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    unitNumber: {
        type: String,
        required: true,
    },
    type: {
        type: String, // e.g., 1BHK, 2BHK, Studio
        required: true,
    },
    rentAmount: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
    },
    bathrooms: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available',
    },
}, {
    timestamps: true,
});

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;
