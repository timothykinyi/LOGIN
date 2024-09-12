const express = require('express');
const router = express.Router();
const Preference = require('../models/Preference');

// POST route to add preferences
router.post('/', async (req, res) => {
  try {
    const newPreference = new Preference(req.body);
    const savedPreference = await newPreference.save();
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
