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

  if (!eID) {
    return res.status(400).json({ message: 'eID is required' });
  }

  try {
    // Check if the eID already exists in the database
    const existingEID = await Allowed.findOne({ eID });
    if (existingEID) {
      return res.status(400).json({ message: 'eID already exists' }); // Handle duplicate eID
    }

    // Add new eID if it doesn't exist
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
