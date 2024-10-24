const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure the model is correct and appropriately named

// POST route to add preferences
router.post('/', async (req, res) => {
  try {
    const preferenceEntries = req.body; // Array of preference entries

    const savedEntries = [];
    for (const entry of preferenceEntries) {
      // Find user by eID
      const user = await User.findOne({ eID: entry.eID });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Push the new preference entry to the user's preferences array
      user.preferences.push({
        hobbies: entry.hobbies,
        dietaryPreference: entry.dietaryPreference,
        religiousAffiliation: entry.religiousAffiliation,
        selectedHobbies: entry.selectedHobbies,
        selectedActivities: entry.selectedActivities,
        selectedMusicGenres: entry.selectedMusicGenres,
        favoriteCuisine: entry.favoriteCuisine,
        petPreference: entry.petPreference,
        sleepPreference: entry.sleepPreference,
        environmentalPractices: entry.environmentalPractices,
        dateAdded: new Date() // Add the current date/time when the entry is added
      });

      const savedEntry = await user.save();
      savedEntries.push(savedEntry);
    }

    res.status(201).json({
      message: 'Preferences saved successfully',
      data: savedEntries
    });
  } catch (error) {
    console.error('Error saving preference data:', error);
    res.status(500).json({
      message: 'An error occurred while saving preferences',
      error: error.message
    });
  }
});

// Route to retrieve all stored preference data or by user eID
router.get('/all', async (req, res) => {
  try {
    const { eID } = req.query; // Get eID from query parameters if provided

    if (eID) {
      // If eID is provided, find the specific user and return their preference data
      const user = await User.findOne({ eID });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        message: 'Preference data fetched successfully',
        data: user.preferences
      });
    }

    // If no eID is provided, return all users with their preference data
    const users = await User.find({}, { preferences: 1, eID: 1 }); // Fetch only preferences and eID fields
    res.status(200).json({
      message: 'All preference data fetched successfully',
      data: users
    });
  } catch (error) {
    console.error('Error fetching preference data:', error);
    res.status(500).json({
      message: 'An error occurred while fetching preference data',
      error: error.message
    });
  }
});

module.exports = router;
