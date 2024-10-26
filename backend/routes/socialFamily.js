const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Endpoint to update preferences based on eID
router.post('/', async (req, res) => {
  const {
    eID,
    maritalStatus,
    familyMembers,
    dependents,
    socialAffiliations
  } = req.body;

  try {
    // Check if user with given eID exists
    const user = await User.findOne({ eID });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the preference object to add to user's preferences array
    const socialInfo = {
      maritalStatus,
      familyMembers,
      dependents,
      socialAffiliations
    };

    // Add new preference to user's preference array and save
    user.social.push(socialInfo);
    await user.save();

    res.status(200).json({ message: 'social info updated successfully' });
  } catch (error) {
    console.error('Error updating social:', error);
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

    res.status(200).json({ data: user.social });
  } catch (error) {
    console.error('Error retrieving social:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});


module.exports = router;
