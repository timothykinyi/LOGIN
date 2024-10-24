const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST route to add preferences
router.post('/', async (req, res) => {
  const {
    eID,
    hobbies,
    dietaryPreference,
    religiousAffiliation,
    selectedHobbies,
    selectedActivities,
    selectedMusicGenres,
    favoriteCuisine,
    sleepPreference,
    petPreference,
    environmentalPractices,
  } = req.body;

  try {
    // Find the user by eID
    const user = await User.findOne({ eID });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's preferences
    user.preferences = {
      hobbies,
      dietaryPreference,
      religiousAffiliation,
      selectedHobbies,
      selectedActivities,
      selectedMusicGenres,
      favoriteCuisine,
      sleepPreference,
      petPreference,
      environmentalPractices,
    };

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Preferences updated successfully!' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Error updating preferences', error });
  }
});


// GET route to fetch all preferences
router.get('/all', async (req, res) => {
  try {
    const preferences = await Preference.find();
    res.status(200).json({ message: 'Preferences fetched successfully', data: preferences });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve preferences.', error });
  }
});


module.exports = router;
