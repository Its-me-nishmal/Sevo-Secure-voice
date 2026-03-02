const Conversation = require('../models/Conversation');

/**
 * Get or create a 1v1 conversation
 */
const getOrCreateConversation = async (req, res) => {
    const { otherUserId } = req.body;
    const currentUserId = req.user._id;

    // Ensure consistent ordering for uniqueness
    const [userA, userB] = [currentUserId, otherUserId].sort();

    try {
        let conversation = await Conversation.findOne({ userA, userB });

        if (!conversation) {
            conversation = await Conversation.create({ userA, userB });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Message = require('../models/Message');

/**
 * List all conversations for current user
 */
const listConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            $or: [{ userA: req.user._id }, { userB: req.user._id }]
        }).populate('userA userB', 'displayName email').lean();

        // Enhance with unplayed counts and last message
        const enhancedConversations = await Promise.all(conversations.map(async (conv) => {
            const unplayedMessages = await Message.find({
                conversationId: conv._id,
                senderId: { $ne: req.user._id }, // Only count messages sent by others
                played: false
            }).sort({ createdAt: -1 });

            return {
                ...conv,
                unplayedCount: unplayedMessages.length,
                lastUnplayedId: unplayedMessages.length > 0 ? unplayedMessages[0]._id : null
            };
        }));

        res.json(enhancedConversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get a single conversation
 */
const getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            $or: [{ userA: req.user._id }, { userB: req.user._id }]
        }).populate('userA userB', 'displayName email').lean();

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOrCreateConversation,
    listConversations,
    getConversation
};
