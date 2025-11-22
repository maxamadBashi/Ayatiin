const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, {
    timestamps: true,
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
