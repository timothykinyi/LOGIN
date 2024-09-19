const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('../models/userModel');
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/fingerprint-login', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Route for user registration
app.post('/register', async (req, res) => {
  const { username, publicKey } = req.body;
  const user = new User({ username, publicKey });
  await user.save();
  res.json({ success: true, message: 'User registered successfully' });
});

// Route for user login
app.post('/login', async (req, res) => {
  const { username, publicKey } = req.body;
  const user = await User.findOne({ username });

  if (user && user.publicKey === publicKey) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Login failed' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
