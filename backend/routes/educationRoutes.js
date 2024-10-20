const express = require('express');
const router = express.Router();
const Education = require('../models/User');

// Route to handle education form submission
router.post('/add', async (req, res) => {

  const { eID, educationLevel, institutionName, degreeType, degree, fieldOfStudy, startDate, endDate, country, transferDetails} = req.body;
  const user = await Education.findOne({ eID });
  if(!user)
    {
      res.status(201).json({ message: 'User not found'});
    }
  try {
    user.educationLevel = educationLevel;
    user.institutionName = institutionName;
    user.degreeType = degreeType;
    user.degree = degree;
    user.fieldOfStudy = fieldOfStudy;
    user.startDate = startDate;
    user.endDate = endDate;
    user.country = country;
    user.transferDetails = transferDetails;

    await user.save();
    res.status(201).json({ message: 'Education entries saved successfully'});
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
