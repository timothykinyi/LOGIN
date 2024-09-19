// backend/controllers/auth.js
const User = require('../models/userModel');
const { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');
const crypto = require('crypto');

// Handle registration options
exports.getRegistrationOptions = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }

  const userId = crypto.randomBytes(32).toString('hex');
  const options = generateRegistrationOptions({
    rpName: "Your App Name",
    userName: username,
    userID: userId,
    attestationType: 'indirect',
  });

  res.json(options);
};

// Handle registration
exports.registerUser = async (req, res) => {
  const { username, publicKey } = req.body;

  // Verify and save registration
  const verification = verifyRegistrationResponse({
    credential: JSON.parse(publicKey),
    expectedChallenge: '<expected-challenge>',
    expectedOrigin: 'https://your-app-domain.com',
    expectedRPID: 'your-app-domain.com',
  });

  if (verification.verified) {
    const user = new User({ username, publicKey });
    await user.save();
    res.json({ success: true, message: 'User registered successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Verification failed' });
  }
};

// Handle login options
exports.getLoginOptions = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const options = generateAuthenticationOptions({
    rpID: 'your-app-domain.com',
    userID: user._id.toString(),
  });

  res.json(options);
};

// Handle login
exports.loginUser = async (req, res) => {
  const { username, publicKey } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const verification = verifyAuthenticationResponse({
    credential: JSON.parse(publicKey),
    expectedChallenge: '<expected-challenge>',
    expectedOrigin: 'https://your-app-domain.com',
    expectedRPID: 'your-app-domain.com',
  });

  if (verification.verified) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(400).json({ success: false, message: 'Verification failed' });
  }
};
