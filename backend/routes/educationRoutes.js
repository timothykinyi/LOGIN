const express = require('express');
const router = express.Router();
const Education = require('../models/Education');

// Route to handle education form submission
router.post('/add', async (req, res) => {
  try {
    const educationEntries = req.body; // Array of education entries
    
    // Loop through entries and save each one to the database
    const savedEntries = [];
    for (let entry of educationEntries) {
      const newEducation = new Education(entry);
      const savedEntry = await newEducation.save();
      savedEntries.push(savedEntry);
    }

    res.status(201).json({ message: 'Education entries saved successfully', data: savedEntries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while saving education entries', error });
  }
});

module.exports = router;
