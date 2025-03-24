const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'VISITOR_ENTRY', 
            'COMMITTEE_MEETING', 
            'MAINTENANCE_REMINDER', 
            'SECURITY_ALERT', 
            'GENERAL_ANNOUNCEMENT'
        ],
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: { expires: '30d' } // Auto-delete after 30 days
    },
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['SENT', 'FAILED', 'PARTIAL'],
        default: 'SENT'
    }
});

const NotificationLog = mongoose.model('NotificationLog', notificationLogSchema);
module.exports = NotificationLog;