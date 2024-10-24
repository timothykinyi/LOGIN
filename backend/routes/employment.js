// Importing necessary modules
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this is the User model where employment is stored

// POST route to handle employment form submission
router.post('/', async (req, res) => {
  try {
    const employmentEntries = req.body; // Array of employment entries
    const savedEntries = [];

    for (let entry of employmentEntries) {
      // Find user by eID
      let user = await User.findOne({ eID: entry.eID });

      if (!user) {
        return res.status(404).json({ message: 'User not found' }); // Updated to 404 for not found
      }

      // Create the employment entry
      const employmentData = {
        jobTitle: entry.jobTitle,
        employer: entry.employer,
        jobCategory: entry.jobCategory,
        startDate: entry.startDate,
        endDate: entry.endDate,
        skills: entry.skills
      };

      // Push the new employment entry to the user's employment array
      user.employment.push(employmentData);

      // Save the updated user with the new employment entry
      const savedEntry = await user.save();
      savedEntries.push(savedEntry);
    }

    res.status(201).json({
      message: 'Employment details saved successfully!',
      data: savedEntries
    });
  } catch (error) {
    console.error('Error saving employment data:', error);
    res.status(500).json({ message: 'Error saving employment details', error: error.message });
  }
});

// GET route to retrieve all stored employment data or by user eID
router.get('/', async (req, res) => {
  try {
    const { eID } = req.query; // Get eID from query parameters if provided

    if (eID) {
      // If eID is provided, find the specific user and return their employment data
      const user = await User.findOne({ eID });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        message: 'Employment data fetched successfully',
        data: user.employment
      });
    }

    // If no eID is provided, return all users with their employment data
    const users = await User.find({}, { employment: 1, eID: 1 }); // Fetch only employment and eID fields
    res.status(200).json({
      message: 'All employment data fetched successfully',
      data: users
    });
  } catch (error) {
    console.error('Error fetching employment data:', error);
    res.status(500).json({ message: 'An error occurred while fetching employment data', error: error.message });
  }
});

module.exports = router;
