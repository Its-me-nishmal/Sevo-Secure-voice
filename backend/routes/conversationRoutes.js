const express = require('express');
const router = express.Router();
const { getOrCreateConversation, listConversations, getConversation } = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, getOrCreateConversation);
router.get('/', protect, listConversations);
router.get('/:id', protect, getConversation);

module.exports = router;
