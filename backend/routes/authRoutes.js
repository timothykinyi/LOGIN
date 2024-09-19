// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import the User model
const { verifyRegistrationResponse } = require('@simplewebauthn/server');
const { generateRegistrationOptions } = require('@simplewebauthn/server');

router.post('/start-registration', async (req, res) => {
  const { username } = req.body;

  // Generate challenge options for WebAuthn registration
  const options = generateRegistrationOptions({
    rpName: 'Fingerprint Login', // Relying party (your app name)
    userID: Buffer.from(username).toString('base64'), // Base64-encoded user ID
    userName: username, // Username
    attestationType: 'direct',
  });

  // Save challenge in the session or in-memory store
  req.session.challenge = options.challenge; // Store in session or Redis

  res.json(options);
});

const { verifyRegistrationResponse } = require('@simplewebauthn/server');

router.post('/register', async (req, res) => {
  const { username, publicKey } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    // Fetch the stored challenge
    const expectedChallenge = req.session.challenge; // Get the stored challenge

    // Verifying the fingerprint credential here (using simplewebauthn)
    const verificationResult = verifyRegistrationResponse({
      credential: JSON.parse(publicKey),  // The publicKey from the frontend
      expectedChallenge,
      expectedOrigin: 'https://login-9ebe.onrender.com',  // Your server's origin
      expectedRPID: 'login-9ebe.onrender.com',  // Your server's RP ID
    });

    if (!verificationResult.verified) {
      return res.status(400).json({ success: false, message: 'Fingerprint verification failed' });
    }

    const user = new User({ username, publicKey });
    await user.save();

    // Clear the challenge from the session
    req.session.challenge = null;

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
});



// Login route
router.post('/login', async (req, res) => {
  const { username, publicKey } = req.body;
  try {
    const user = await User.findOne({ username });

    if (user && user.publicKey === publicKey) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Login failed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error });
  }
});

module.exports = router;
