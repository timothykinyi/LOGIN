const express = require('express');
const router = express.Router();
const Preference = require('../models/User');

// POST route to add preferences
router.post('/', async (req, res) => {
  try {

    const { eID } = req.body;
    const user = await Preference.findOne({ eID, hobbies, dietaryPreference, religiousAffiliation, selectedHobbies, selectedActivities, selectedMusicGenres, favoriteCuisine, sleepPreference, petPreference, environmentalPractices });

    if(!user)
      {
        res.status(500).json({ message: 'User not found.'});
      }

      user.preference.hobbies = hobbies;
      user.preference.dietaryPreference = dietaryPreference;
      user.preference.religiousAffiliation = religiousAffiliation;
      user.preference.selectedHobbies = selectedHobbies;
      user.preference.selectedActivities = selectedActivities;
      user.preference.selectedMusicGenres = selectedMusicGenres;
      user.preference.favoriteCuisine = favoriteCuisine;
      user.preference.sleepPreference = sleepPreference;
      user.preference.petPreference = petPreference;
      user.preference.environmentalPractices = environmentalPractices;

    const savedPreference = await user.save();
    res.status(201).json({ message: 'Preferences saved successfully!', data: savedPreference });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save preferences.', error });
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
