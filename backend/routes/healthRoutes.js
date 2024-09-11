// routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData');

// POST route to submit health data
router.post('/', async (req, res) => {
  try {
    const healthData = new HealthData(req.body);
    await healthData.save();
    res.status(200).json({ message: 'Health data successfully submitted' });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'An error occurred while submitting the form' });
  }
});

module.exports = router;
