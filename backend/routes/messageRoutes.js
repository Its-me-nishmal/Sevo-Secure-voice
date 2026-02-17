const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendVoiceMessage, getVoiceFile, getMessages, markAsPlayed } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/upload', protect, upload.single('voice'), sendVoiceMessage);
router.get('/:id/file', protect, getVoiceFile);
router.get('/conversation/:conversationId', protect, getMessages);
router.put('/:id/played', protect, markAsPlayed);

module.exports = router;
