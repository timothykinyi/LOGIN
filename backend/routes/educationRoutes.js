const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to handle education form submission
router.post('/add', async (req, res) => {
  try {
    const { eID, educationEntries } = req.body; // eID and array of education entries
    
    // Find user by eID
    const user = await User.findOne({ eID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Loop through entries and push each one to the user's education array
    for (let entry of educationEntries) {
      user.education.push(entry);
    }

    // Save the updated user document
    const updatedUser = await user.save();
    
    res.status(201).json({ message: 'Education entries saved successfully', data: updatedUser.education });
  } catch (error) {
    console.error('Error saving education data:', error);
    res.status(500).json({ message: 'An error occurred while saving education entries', error });
  }
});

// New Route to retrieve all stored education data for a user
router.get('/:eID/all', async (req, res) => {
  try {
    const user = await User.findOne({ eID: req.params.eID }); // Retrieve user by eID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'Education data fetched successfully', data: user.education });
  } catch (error) {
    console.error('Error fetching education data:', error);
    res.status(500).json({ message: 'An error occurred while fetching education data', error });
  }
});

module.exports = router;
