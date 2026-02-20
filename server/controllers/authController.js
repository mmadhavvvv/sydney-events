const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // Need to create this model

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();

        // Upsert user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, picture, role: 'user' });
        }

        // Generate JWT for session if needed, or just return user info
        // For simplicity, returning user info and using id as session key on client for now
        // In production, use JWT
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
