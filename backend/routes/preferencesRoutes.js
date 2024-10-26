const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Endpoint to update preferences based on eID
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
    environmentalPractices
  } = req.body;

  try {
    // Check if user with given eID exists
    const user = await User.findOne({ eID });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the preference object to add to user's preferences array
    const newPreference = {
      hobbies,
      dietaryPreference,
      religiousAffiliation,
      selectedHobbies,
      selectedActivities,
      selectedMusicGenres,
      favoriteCuisine,
      sleepPreference,
      petPreference,
      environmentalPractices
    };

    // Add new preference to user's preference array and save
    user.preference.push(newPreference);
    await user.save();

    res.status(200).json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});


router.get('/preferences/:eID', async (req, res) => {
  const { eID } = req.params;

  try {
    // Find the user by eID
    const user = await User.findOne({ eID });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has preferences
    if (!user.preferences) {
      return res.status(404).json({ message: 'Preferences not found for this user' });
    }

    // Return the user's preferences
    res.status(200).json(user.preferences);
  } catch (error) {
    console.error('Error retrieving preferences:', error);
    res.status(500).json({ message: 'Error retrieving preferences', error });
  }
});


module.exports = router;
