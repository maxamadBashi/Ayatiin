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
        enum: ['Apartment', 'House', 'Villa', 'Land', 'Commercial', 'Land for Sale', 'Commercial Land', 'Residential Land', 'Farm Land', 'Investment Land'],
        default: 'Apartment',
    },
    size: {
        type: String, // e.g., "1200 sqm" or "1 hectare"
    },
    dimensions: {
        type: String, // e.g., "20x30"
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
