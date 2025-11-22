const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    cost: {
        type: Number,
        default: 0,
    },
    assignedTo: {
        type: String, // Could be a User ID or just a name
    },
}, {
    timestamps: true,
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
