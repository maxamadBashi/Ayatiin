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
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
