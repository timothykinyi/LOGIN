const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Endpoint to update preferences based on eID
router.post('/', async (req, res) => {
    const { 
        eID, 
        firstName, 
        lastName, 
        dateOfBirth, 
        gender, 
        maritalStatus, 
        nationality, 
        streetAddress1, 
        streetAddress2, 
        city, 
        state, 
        postalCode, 
        country } = req.body;

  try {
    // Check if user with given eID exists
    const user = await User.findOne({ eID });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the preference object to add to user's preferences array
    const personalInfo = {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        maritalStatus,
        nationality,
        streetAddress1,
        streetAddress2,
        city,
        state,
        postalCode,
        country
    };

    // Add new preference to user's preference array and save
    user.personalinfo.push(personalInfo);
    await user.save();

    res.status(200).json({ message: 'pesonal info updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

router.get('/all', async (req, res) => {
  const { eID } = req.query;

  try {
    // Find user by eID and return preferences if user exists
    const user = await User.findOne({ eID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: user.personalinfo });
  } catch (error) {
    console.error('Error retrieving preferences:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});


module.exports = router;
