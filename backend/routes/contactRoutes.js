const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST route to handle form submissions
router.post('/', async (req, res) => {
  const contactData = req.body;

  try {
    const newContact = new Contact(contactData);
    await newContact.save();
    res.json({ message: 'Contact information successfully received' });
  } catch (error) {
    console.error('Error saving contact data:', error);
    res.status(500).json({ message: 'Failed to save contact information' });
  }
});

module.exports = router;
