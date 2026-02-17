const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
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
        const fileName = `${uuidv4()}.enc`;
        const uploadsDir = path.resolve(__dirname, '..', 'uploads');
        
        // Ensure directory exists
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join('uploads', fileName);
        const fullPath = path.join(uploadsDir, fileName);

        fs.writeFileSync(fullPath, encryptedBuffer);

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + (parseInt(expiryHours) || 3));

        const message = await Message.create({
            conversationId,
            senderId: req.user._id,
            filePath,
            durationSeconds,
            expiresAt,
            played: false
        });

        // Emit via Socket.io
        const io = req.app.get('io');
        // Notify the specific conversation thread
        io.to(conversationId).emit('new_message', { ...message.toObject(), localId: req.body.localId });

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
        if (!message) return res.status(404).json({ message: 'Message not found' });

        const fullPath = path.resolve(__dirname, '..', message.filePath);
        if (!fs.existsSync(fullPath)) return res.status(404).json({ message: 'File not found' });

        const encryptedData = fs.readFileSync(fullPath);
        const decryptedData = decrypt(encryptedData);

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
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
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
