// routes/employment.js
const express = require('express');
const router = express.Router();
const Employment = require('../models/Employment');

// POST route to handle form submission
router.post('/', async (req, res) => {
  try {
    const employmentEntries = req.body; // Expecting an array of employment entries

    // Loop through each entry and save it
    const savedEntries = await Employment.insertMany(employmentEntries);
    res.status(201).json({
      message: 'Employment details saved successfully!',
      data: savedEntries
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving employment details', error });
  }
});

module.exports = router;
