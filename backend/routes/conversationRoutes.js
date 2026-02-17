const express = require('express');
const router = express.Router();
const { getOrCreateConversation, listConversations } = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, getOrCreateConversation);
router.get('/', protect, listConversations);

module.exports = router;
