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

// GET route to retrieve contact information by eID
router.get('/:eID', async (req, res) => {
  const { eID } = req.params; // Extract eID from request parameters

  try {
    const contact = await Contact.findById(eID); // Find contact by the eID (MongoDB _id)
    if (!contact) {
      return res.status(404).json({ message: 'Contact information not found' });
    }
    res.json([contact]); // Return the contact as an array to match frontend structure
  } catch (error) {
    console.error('Error retrieving contact data:', error);
    res.status(500).json({ message: 'Failed to retrieve contact information' });
  }
});

module.exports = router;
