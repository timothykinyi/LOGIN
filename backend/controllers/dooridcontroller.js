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

// Add new door IDs (supporting multiple doors in one request)
exports.addDID = async (req, res) => {
  const doors = req.body.doors; // Expecting an array of door objects

  if (!doors || doors.length === 0) {
    return res.status(400).json({ message: 'At least one door (with doorID and name) is required' });
  }

  // Validate that each door has both doorID and name
  for (let door of doors) {
    if (!door.doorID || !door.name) {
      return res.status(400).json({ message: 'Each door must have a doorID and a name' });
    }
  }

  try {
    // Use insertMany to add multiple door entries at once
    await Doorids.insertMany(doors);
    res.status(201).json({ message: 'Doors added successfully' });
  } catch (error) {
    console.error("Error adding door IDs:", error);
    if (error.code === 11000) { // Handle duplicate key errors for unique doorIDs
      res.status(400).json({ message: 'One or more Door IDs already exist' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Remove a door ID by its ID
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
