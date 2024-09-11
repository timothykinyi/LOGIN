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
    res.status(500).json({ message: 'Error submitting financial data', error });
  }
});

module.exports = router;
