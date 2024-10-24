const express = require('express');
const router = express.Router();
const Education = require('../models/User');

// Route to handle education form submission
router.post('/add', async (req, res) => {
  try {
    const educationEntries = req.body; // Array of education entries
    
    const savedEntries = [];
    for (let entry of educationEntries) {
      // Find user by eID or create a new one if not found
      let user = await Education.findOne({ eID: entry.eID });

      if (!user) {
        // Create a new user if not found

        res.status(500).json({ message: 'User not found' });
      }

      // Push the new education entry to the user's education array
      user.education.push({
        educationLevel: entry.educationLevel,
        institutionName: entry.institutionName,
        degreeType: entry.degreeType,
        degree: entry.degree,
        fieldOfStudy: entry.fieldOfStudy,
        startDate: entry.startDate,
        endDate: entry.endDate,
        country: entry.country,
        transferDetails: entry.transferDetails
      });

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
