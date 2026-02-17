const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Generates a JWT token for a user
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * Handle Google Login / Registration
 */
const googleAuth = async (req, res) => {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, sub: googleId, name, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user (Partial registration - display name set later)
            user = await User.create({
                email,
                displayName: name || null,
                discoverableByEmail: false, // Default opt-out
            });
        }

        res.json({
            _id: user._id,
            email: user.email,
            displayName: user.displayName,
            token: generateToken(user._id),
            isNewUser: !user.displayName // Flag for frontend to redirect to "Set Display Name"
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid Google Token' });
    }
};

module.exports = { googleAuth };
