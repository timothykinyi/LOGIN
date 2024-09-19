const User = require('../models/userModel');
const { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');
const crypto = require('crypto');

// Store challenges for users (simple in-memory store)
const challenges = {};

// Get registration options
exports.getRegistrationOptions = async (req, res) => {
    const { username } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const userId = crypto.randomBytes(32); // Buffer format
    const options = generateRegistrationOptions({
        rpName: "Login",
        userID: userId,
        userName: username,
        challenge: crypto.randomBytes(32).toString('hex')
    });

    challenges[username] = options.challenge;
    res.json(options);
};

// Register user
exports.registerUser = async (req, res) => {
    const { username, publicKey } = req.body;

    const expectedChallenge = challenges[username];
    if (!expectedChallenge) {
        return res.status(400).json({ success: false, message: 'Challenge not found' });
    }

    try {
        const verification = verifyRegistrationResponse({
            credential: JSON.parse(publicKey),
            expectedChallenge,
            expectedOrigin: 'https://login-9ebe.onrender.com',
            expectedRPID: 'login-9ebe.onrender.com',
        });

        if (verification.verified) {
            const user = new User({ username, publicKey });
            await user.save();
            return res.json({ success: true, message: 'User registered successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Verification failed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get login options
exports.getLoginOptions = async (req, res) => {
    const { username } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const options = generateAuthenticationOptions({
        rpID: 'login-9ebe.onrender.com',
        userVerification: 'preferred',
        challenge: crypto.randomBytes(32).toString('hex'),
    });

    challenges[username] = options.challenge;
    res.json(options);
};

// Login user
exports.loginUser = async (req, res) => {
    const { username, publicKey } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const expectedChallenge = challenges[username];
    if (!expectedChallenge) {
        return res.status(400).json({ success: false, message: 'Challenge not found' });
    }

    try {
        const verification = verifyAuthenticationResponse({
            credential: JSON.parse(publicKey),
            expectedChallenge,
            expectedOrigin: 'https://login-9ebe.onrender.com',
            expectedRPID: 'login-9ebe.onrender.com',
        });

        if (verification.verified) {
            return res.json({ success: true, message: 'Login successful' });
        } else {
            return res.status(400).json({ success: false, message: 'Verification failed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
