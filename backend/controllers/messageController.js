const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { encrypt, decrypt } = require('../services/encryption');
const { v4: uuidv4 } = require('uuid');

/**
 * Upload and encrypt voice message
 */
const sendVoiceMessage = async (req, res) => {
    const { conversationId, durationSeconds, expiryHours } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'No voice file provided' });
    }

    try {
        // Silent Blocking Check
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        const recipientId = conversation.userA.toString() === req.user._id.toString() ? conversation.userB : conversation.userA;
        const recipient = await User.findById(recipientId);

        if (recipient && recipient.blockedUsers.includes(req.user._id)) {
            // Silent fail: Return success but don't save
            return res.status(201).json({ _id: uuidv4(), status: 'sent_silently' });
        }

        const encryptedBuffer = encrypt(req.file.buffer);

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + (parseInt(expiryHours) || 3));

        const message = await Message.create({
            conversationId,
            senderId: req.user._id,
            audioData: encryptedBuffer,
            durationSeconds,
            expiresAt,
            played: false
        });

        // Emit via Socket.io
        const io = req.app.get('io');
        const messageResponse = message.toObject();
        delete messageResponse.audioData; // Critical: Remove giant binary buffer from socket push payload

        // Notify the specific conversation thread
        io.to(conversationId).emit('new_message', { ...messageResponse, localId: req.body.localId });

        // Notify both participants to refresh their conversation lists
        io.to(req.user._id.toString()).emit('refresh_conversations');
        io.to(recipientId.toString()).emit('refresh_conversations');

        res.status(201).json(message);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get message audio (decrypt on the fly)
 */
const getVoiceFile = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message || !message.audioData) return res.status(404).json({ message: 'Message not found or corrupted' });

        const decryptedData = decrypt(message.audioData);

        res.set('Content-Type', 'audio/webm');
        res.send(decryptedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Mark message as played
 */
const markAsPlayed = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        message.played = true;
        await message.save();

        // Emit via Socket.io
        const io = req.app.get('io');
        // Notify the specific conversation thread
        io.to(message.conversationId.toString()).emit('message_played', { messageId: message._id });

        // Notify both participants to refresh their conversation lists (unread counts change)
        const conversation = await Conversation.findById(message.conversationId);
        if (conversation) {
            io.to(conversation.userA.toString()).emit('refresh_conversations');
            io.to(conversation.userB.toString()).emit('refresh_conversations');
        }

        res.json({ message: 'Marked as played' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * List messages for conversation
 */
const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    try {
        // Exclude audioData binary buffer to reduce load times significantly
        const messages = await Message.find({ conversationId }).select('-audioData').sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendVoiceMessage,
    getVoiceFile,
    getMessages,
    markAsPlayed
};
