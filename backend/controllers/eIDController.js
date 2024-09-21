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

// Add a new eID to the existing list
exports.addEID = async (req, res) => {
  const { eID } = req.body;

  if (!eID) {
    return res.status(400).json({ message: 'eID is required' });
  }

  try {
    // Check if the document with allowed eIDs exists, if not create one
    let allowed = await Allowed.findOne();
    if (!allowed) {
      allowed = new Allowed({ eIDs: [eID] });
    } else {
      // Check if the eID already exists
      if (allowed.eIDs.includes(eID)) {
        return res.status(400).json({ message: 'eID already exists' });
      }

      // Add new eID to the array
      allowed.eIDs.push(eID);
    }

    await allowed.save();
    res.status(201).json({ message: 'eID added successfully', allowed });
  } catch (error) {
    console.error('Error adding eID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove an eID from the allowed list
exports.removeEID = async (req, res) => {
  const { eIDToRemove } = req.params;

  try {
    let allowed = await Allowed.findOne();
    if (!allowed || !allowed.eIDs.includes(eIDToRemove)) {
      return res.status(404).json({ message: 'eID not found' });
    }

    // Remove the eID from the array
    allowed.eIDs = allowed.eIDs.filter((id) => id !== eIDToRemove);
    await allowed.save();

    res.json({ message: 'eID removed successfully', allowed });
  } catch (error) {
    console.error('Error removing eID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
