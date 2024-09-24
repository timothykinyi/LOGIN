// controllers/dooridcontroller.js

const Doorids = require('../models/doorid'); // Assume this is your MongoDB model

// Get all allowed eIDs
exports.getAllowedDIDs = async (req, res) => {
  try {
    const allowedDIDs = await Doorids.find();
    res.json(allowedDIDs);
  } catch (error) {
    console.error('Error fetching DIDs:', error);
    res.status(500).json({ message: 'Error fetching DIDs' });
  }
};

// Add a new eID to the existing list
exports.addDID = async (req, res) => {
  const { DID } = req.body;

  if (!DID) {
    return res.status(400).json({ message: 'DID is required' });
  }

  try {
    // Check if the document with allowed eIDs exists, if not create one
    let allowedDID = await Doorids.findOne();
    if (!allowedDID) {
        allowedDID = new Allowed({ doorid: [DID] });
    } else {
      // Check if the eID already exists
      if (allowedDID.doorid.includes(DID)) {
        return res.status(400).json({ message: 'DID already exists' });
      }

      // Add new eID to the array
      allowedDID.doorid.push(DID);
    }

    await allowedDID.save();
    res.status(201).json({ message: 'eID added successfully', allowed });
  } catch (error) {
    console.error('Error adding eID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove an eID from the allowed list
exports.removeDID = async (req, res) => {
  const { DIDToRemove } = req.params;

  try {
    let doorids = await Doorids.findOne();
    if (!doorids || !doorids.doorid.includes(DIDToRemove)) {
      return res.status(404).json({ message: 'eID not found' });
    }

    // Remove the eID from the array
    doorids.doorid = doorids.doorid.filter((id) => id !== DIDToRemove);
    await doorids.save();

    res.json({ message: 'eID removed successfully', doorids });
  } catch (error) {
    console.error('Error removing eID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
