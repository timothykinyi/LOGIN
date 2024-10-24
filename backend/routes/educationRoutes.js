const express = require('express');
const router = express.Router();
const Education = require('../models/User');

// Route to handle education form submission
router.post('/add', async (req, res) => {
  try {
    const educationEntries = req.body; // Array of education entries

    // Loop through entries and save each one to the database
    const savedEntries = [];
    for (let entry of educationEntries) {
      // Find the user based on eID, or create a new one if not found
      let user = await Education.findOne({ eID: entry.eID });
      
      if (!user) {
        user = new Education({ eID: entry.eID });
      }

      // Update the user's education details
      user.educationLevel = entry.educationLevel;
      user.institutionName = entry.institutionName;
      user.degreeType = entry.degreeType;
      user.degree = entry.degree;
      user.fieldOfStudy = entry.fieldOfStudy;
      user.startDate = entry.startDate;
      user.endDate = entry.endDate;
      user.country = entry.country;
      user.transferDetails = entry.transferDetails;

      const savedEntry = await user.save();
      savedEntries.push(savedEntry);
    }

    res.status(201).json({ message: 'Education entries saved successfully', data: savedEntries });
  } catch (error) {
    console.error('Error saving education data:', error);
    res.status(500).json({ message: 'An error occurred while saving education entries', error: error.message });
  }
});

// New Route to retrieve all stored education data
router.get('/all', async (req, res) => {
  try {
    const educationData = await Education.find(); // Retrieve all entries from the database
    res.status(200).json({ message: 'Education data fetched successfully', data: educationData });
  } catch (error) {
    console.error('Error fetching education data:', error);
    res.status(500).json({ message: 'An error occurred while fetching education data', error: error.message });
  }
});

module.exports = router;
