const express = require('express');
const router = express.Router();
const Employment = require('../models/Employment'); // Use Employment model

// Route to handle employment form submission
router.post('/add', async (req, res) => {
  try {
    const employmentEntries = req.body; // Array of employment entries
    
    // Loop through entries and save each one to the database
    const savedEntries = [];
    for (let entry of employmentEntries) {
      const newEmployment = new Employment(entry);
      const savedEntry = await newEmployment.save();
      savedEntries.push(savedEntry);
    }

    res.status(201).json({ message: 'Employment entries saved successfully', data: savedEntries });
  } catch (error) {
    console.error('Error saving employment data:', error);
    res.status(500).json({ message: 'An error occurred while saving employment entries', error });
  }
});

// New Route to retrieve all stored employment data
router.get('/all', async (req, res) => {
  try {
    const employmentData = await Employment.find(); // Retrieve all entries from the database
    res.status(200).json({ message: 'Employment data fetched successfully', data: employmentData });
  } catch (error) {
    console.error('Error fetching employment data:', error);
    res.status(500).json({ message: 'An error occurred while fetching employment data', error });
  }
});

module.exports = router;
