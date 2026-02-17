const express = require('express');
const router = express.Router();
const { updateProfile, searchUserByEmail, blockUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateProfile);
router.get('/search', protect, searchUserByEmail);
router.post('/block', protect, blockUser);

module.exports = router;
