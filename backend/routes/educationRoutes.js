// Importing necessary modules
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this is the User model where education is stored

// Route to handle education form submission
router.post('/add', async (req, res) => {
  try {
    const educationEntries = req.body; // Array of education entries
    
    const savedEntries = [];
    for (let entry of educationEntries) {
      // Find user by eID or create a new one if not found
      let user = await User.findOne({ eID: entry.eID });

      if (!user) {
        // Create a new user if not found
        return res.status(404).json({ message: 'User not found' }); // Updated to 404 for not found
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

// New Route to retrieve all stored education data or by user eID
router.get('/all', async (req, res) => {
  try {
    const { eID } = req.query; // Get eID from query parameters if provided

    if (eID) {
      // If eID is provided, find the specific user and return their education data
      const user = await User.findOne({ eID });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'Education data fetched successfully', data: user.education });
    }

    // If no eID is provided, return all users with their education data
    const users = await User.find({}, { education: 1, eID: 1 }); // Fetch only education and eID fields
    res.status(200).json({ message: 'All education data fetched successfully', data: users });
  } catch (error) {
    console.error('Error fetching education data:', error);
    res.status(500).json({ message: 'An error occurred while fetching education data', error: error.message });
  }
});

module.exports = router;
