const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    durationSeconds: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    played: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for expiry worker
messageSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
