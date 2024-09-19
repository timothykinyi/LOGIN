// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import the User model

// Register route
// routes/authRoutes.js

router.post('/register', async (req, res) => {
    const { username, publicKey } = req.body;
  
    try {
      // Check if the username already exists
      const existingUser = await Fingeruser.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
  
      const user = new Fingeruser({ username, publicKey });
      await user.save();
      res.json({ success: true, message: 'User registered successfully' });
  
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
    }
  });
  

// Login route
router.post('/login', async (req, res) => {
  const { username, publicKey } = req.body;
  try {
    const user = await Fingeruser.findOne({ username });

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
