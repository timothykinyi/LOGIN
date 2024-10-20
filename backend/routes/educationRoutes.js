const express = require('express');
const router = express.Router();
const Education = require('../models/User'); // Assuming User model includes education

// Route to handle education form submission
router.post('/add', async (req, res) => {
  const { eID, educationEntries } = req.body;

  try {
    const user = await Education.findOne({ eID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add new education entries
    educationEntries.forEach((entry) => {
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
    });

    await user.save();
    res.status(201).json({ message: 'Education entries saved successfully' });
  } catch (error) {
    console.error('Error saving education data:', error);
    res.status(500).json({ message: 'An error occurred while saving education entries', error });
  }
});

// Route to retrieve all stored education data
router.get('/all', async (req, res) => {
  try {
    const educationData = await Education.find({}, 'education'); // Retrieve all education entries
    res.status(200).json({ message: 'Education data fetched successfully', data: educationData });
  } catch (error) {
    console.error('Error fetching education data:', error);
    res.status(500).json({ message: 'An error occurred while fetching education data', error });
  }
});

module.exports = router;
