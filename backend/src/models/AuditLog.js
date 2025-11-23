const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    entity: {
        type: String,
        required: true,
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    details: {
        type: Object,
    },
    ipAddress: {
        type: String,
    },
}, {
    timestamps: true,
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
