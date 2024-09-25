const Doorids = require('../models/doorid');

// Get all allowed door IDs
exports.getAllowedDIDs = async (req, res) => {
  try {
    const allowedDIDs = await Doorids.find();
    res.json(allowedDIDs);
  } catch (error) {
    console.error("Error fetching allowed door IDs:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new door ID (single or multiple doors)
exports.addDID = async (req, res) => {
  const { doors } = req.body; // Expecting an array of doors [{ doorID, name }, ...]

  if (!doors || !Array.isArray(doors) || doors.length === 0) {
    return res.status(400).json({ message: 'At least one door is required' });
  }

  try {
    const newDoors = await Doorids.insertMany(doors);
    res.status(201).json({ message: `${newDoors.length} door(s) added successfully` });
  } catch (error) {
    console.error("Error adding door(s):", error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'One or more Door IDs already exist' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Remove a door ID
exports.removeDID = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Doorids.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Door ID removed successfully' });
    } else {
      res.status(404).json({ message: 'Door ID not found' });
    }
  } catch (error) {
    console.error("Error removing door ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
