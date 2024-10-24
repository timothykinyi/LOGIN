// routes/employment.js
const express = require('express');
const router = express.Router();
const Employment = require('../models/User');

// POST route to handle form submission
router.post('/', async (req, res) => {
  try {
    const employmentEntries = req.body; // Array of education entries
    
    const savedEntries = [];
    for (let entry of employmentEntries) {
      // Find user by eID or create a new one if not found
      let user = await User.findOne({ eID: entry.eID });

      if (!user) {
        // Create a new user if not found
        return res.status(404).json({ message: 'User not found' }); // Updated to 404 for not found
      }

      // Push the new education entry to the user's education array
      user.employment.push({
        jobTitle: entry.jobTitle,
        employer: entry.employer,
        jobCategory: entry.jobCategory,
        startDate: entry.startDate,
        endDate: entry.endDate,
        skills: entry.skills
      });

      const savedEntry = await user.save();
      savedEntries.push(savedEntry);
    }
    res.status(201).json({
      message: 'Employment details saved successfully!',
      data: savedEntries
    });
  } catch (error) {
    console.error('Error saving employment data:', error);
    res.status(500).json({ message: 'Error saving employment details', error });
  }
});


router.get('/', async (req, res) => {
  try {
    const employmentData = await Employment.find(); // Retrieve all entries from the database
    res.status(200).json({ message: 'Employment data fetched successfully', data: employmentData });
  } catch (error) {
    console.error('Error fetching employment data:', error);
    res.status(500).json({ message: 'An error occurred while fetching employment data', error });
  }
});

module.exports = router;
