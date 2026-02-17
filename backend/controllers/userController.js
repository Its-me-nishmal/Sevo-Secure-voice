const User = require('../models/User');

/**
 * Update user profile (Display Name, Discoverability, Blocked Users)
 */
const updateProfile = async (req, res) => {
    const { displayName, discoverableByEmail, playbackReceiptsEnabled } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.displayName = displayName !== undefined ? displayName : user.displayName;
            user.discoverableByEmail = discoverableByEmail !== undefined ? discoverableByEmail : user.discoverableByEmail;
            user.playbackReceiptsEnabled = playbackReceiptsEnabled !== undefined ? playbackReceiptsEnabled : user.playbackReceiptsEnabled;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Search user by email (Exact match, opt-in only)
 */
const searchUserByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        const user = await User.findOne({
            email: email.toLowerCase(),
            discoverableByEmail: true
        }).select('email displayName _id');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Block / Unblock User
 */
const blockUser = async (req, res) => {
    const { userIdToBlock } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user.blockedUsers.includes(userIdToBlock)) {
            user.blockedUsers.push(userIdToBlock);
            await user.save();
        }
        res.json({ message: 'User blocked' }); // Silent success/fail as per PRD
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updateProfile,
    searchUserByEmail,
    blockUser
};
