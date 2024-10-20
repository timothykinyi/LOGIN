const express = require('express');
const router = express.Router();
const HealthData = require('../models/User');

// POST route to submit health data
router.post('/', async (req, res) => {
  try {
    const { eID, bloodType, allergies, medicalHistory, insuranceProvider, policyNumber, coverageDetails, conditions, disabilities, additionalInfo } = req.body;
    const user = await HealthData.findOne({ eID });

    user.bloodType = bloodType;
    user.allergies = allergies;
    user.medicalHistory = medicalHistory;
    user.insuranceProvider = insuranceProvider;
    user.policyNumber = policyNumber;
    user.coverageDetails = coverageDetails;
    user.conditions = conditions;
    user.disabilities = disabilities;
    user.additionalInfo = additionalInfo;
    
    await user.save();
    res.status(200).json({ message: 'Health data successfully submitted' });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'An error occurred while submitting the form' });
  }
});

// GET route to retrieve all health data
router.get('/all', async (req, res) => {
  try {
    const healthData = await HealthData.find();
    res.status(200).json({ message: 'Health data fetched successfully', data: healthData });
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({ message: 'An error occurred while fetching health data', error });
  }
});

module.exports = router;
