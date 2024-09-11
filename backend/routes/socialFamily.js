// routes/socialFamily.js
const express = require('express');
const router = express.Router();
const SocialFamily = require('../models/SocialFamily');

// POST route to save form data
router.post('/', async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log('Incoming request body:', req.body);

    const { maritalStatus, familyMembers, dependents, socialAffiliations } = req.body;

    // Validate the incoming data (basic validation example)
    if (!maritalStatus || !Array.isArray(familyMembers) || !Array.isArray(dependents) || !Array.isArray(socialAffiliations)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // Create a new entry in the database
    const newSocialFamily = new SocialFamily({
      maritalStatus,
      familyMembers,
      dependents,
      socialAffiliations,
    });

    await newSocialFamily.save();
    res.status(201).json({ message: 'Form data saved successfully!' });
  } catch (error) {
    // Log the error for debugging
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Error saving form data', error });
  }
});

module.exports = router;
