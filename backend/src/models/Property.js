const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Apartment', 'House', 'Villa', 'Land', 'Commercial'],
        default: 'Apartment',
    },
    price: {
        type: Number,
    },
    bedrooms: {
        type: Number,
    },
    bathrooms: {
        type: Number,
    },
    units: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
    }],
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['available', 'rented', 'sold'],
        default: 'available',
    },
    images: [{
        type: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
