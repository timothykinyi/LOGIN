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

// GET route to retrieve all contact information
router.get('/', async (req, res) => {
  const eID = req.eID;
  try {
    const contacts = await Contact.findOne({ eID }); // Fetch all contact information from the database
    res.json(contacts); // Send the data to the frontend
  } catch (error) {
    console.error('Error retrieving contact data:', error);
    res.status(500).json({ message: 'Failed to retrieve contact information' });
  }
});

module.exports = router;
