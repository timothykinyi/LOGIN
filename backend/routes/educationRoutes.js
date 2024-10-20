const express = require('express');
const router = express.Router();
const Education = require('../models/Education');

// Route to handle education form submission
router.post('/add', async (req, res) => {
  try {
    const educationEntries = req.body; // Array of education entries entries
    
    // Loop through entries and save each one to the database
    const savedEntries = [];
    for (let entry of educationEntries) {
      const newEducation = new Education(entry);
      const savedEntry = await newEducation.save();
      savedEntries.push(savedEntry);
    }

    res.status(201).json({ message: 'Education entries saved successfully', data: savedEntries });
  } catch (error) {
    console.error('Error saving education data:', error);
    res.status(500).json({ message: 'An error occurred while saving education entries', error });
  }
});

// New Route to retrieve all stored education data
router.get('/all', async (req, res) => {
  try {
    const educationData = await Education.find(); // Retrieve all entries from the database
    res.status(200).json({ message: 'Education data fetched successfully', data: educationData });
  } catch (error) {
    console.error('Error fetching education data:', error);
    res.status(500).json({ message: 'An error occurred while fetching education data', error });
  }
});

module.exports = router;
