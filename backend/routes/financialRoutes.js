const express = require('express');
const router = express.Router();
const Financial = require('../models/Financial');

// POST endpoint to handle financial data submission
router.post('/', async (req, res) => {
  try {
    const financialEntries = req.body;

    // Save each entry to the database
    await Promise.all(financialEntries.map(async (entry) => {
      const newEntry = new Financial(entry);
      await newEntry.save();
    }));

    res.status(200).json({ message: 'Financial data successfully submitted' });
  } catch (error) {
    console.error('Error submitting financial data:', error);
    res.status(500).json({ message: 'Error submitting financial data', error });
  }
});

// GET endpoint to retrieve all financial data
router.get('/all', async (req, res) => {
  try {
    const financialData = await Financial.find(); // Retrieve all financial records
    res.status(200).json({ message: 'Financial data fetched successfully', data: financialData });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ message: 'Error fetching financial data', error });
  }
});

module.exports = router;
