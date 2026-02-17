const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensure unique pairs regardless of order
conversationSchema.index({ userA: 1, userB: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
