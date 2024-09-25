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

// Add multiple door IDs with corresponding names
exports.addDID = async (req, res) => {
  const { doors } = req.body; // Extract doors from request body

  // Validate input
  if (!doors || !Array.isArray(doors) || doors.length === 0) {
    return res.status(400).json({ message: 'An array of doors is required' });
  }

  try {
    const newDIDs = doors.map(({ doorID, name }) => {
      if (!doorID || !name) {
        throw new Error('doorID and name are required for each door');
      }
      return { doorID, name };
    });

    // Insert new door IDs into the database
    await Doorids.insertMany(newDIDs);
    res.status(201).json({ message: 'Door IDs added successfully', newDIDs });
  } catch (error) {
    console.error('Error adding door IDs:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'One or more Door IDs already exist' });
    }
    res.status(500).json({ message: error.message || 'Server error' });
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
