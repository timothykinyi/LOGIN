// controllers/eIDController.js

const Allowed = require('../models/alleID'); // Assume this is your MongoDB model

// Get all allowed eIDs
exports.getAllowedEIDs = async (req, res) => {
  try {
    const allowedEIDs = await Allowed.find();
    res.json(allowedEIDs);
  } catch (error) {
    console.error('Error fetching eIDs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new eID
exports.addEID = async (req, res) => {
  const { eID } = req.body;

  // Check if eID is provided and is not null/undefined/empty
  if (!eID || typeof eID !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing eID' });
  }

  try {
    // Check if the eID already exists in the database
    const existingEID = await Allowed.findOne({ eID });
    if (existingEID) {
      return res.status(400).json({ message: 'eID already exists' });
    }

    // Add the new eID
    const newEID = new Allowed({ eID });
    await newEID.save();
    res.status(201).json({ message: 'eID added successfully' });
  } catch (error) {
    console.error('Error adding eID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Remove an eID
exports.removeEID = async (req, res) => {
  const { id } = req.params;

  try {
    await Allowed.findByIdAndDelete(id);
    res.json({ message: 'eID removed successfully' });
  } catch (error) {
    console.error('Error removing eID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
