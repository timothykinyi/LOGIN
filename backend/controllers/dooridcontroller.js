const Doorids = require('../models/Doorids');

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

// Add a new door ID
exports.addDID = async (req, res) => {
  const { doorID, name } = req.body; // Extract doorID and name from request body

  if (!doorID || !name) {
    return res.status(400).json({ message: 'doorID and name are required' });
  }

  try {
    const newDID = new Doorids({ doorID, name });
    await newDID.save();
    res.status(201).json({ message: 'Door ID added successfully' });
  } catch (error) {
    console.error("Error adding door ID:", error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Door ID already exists' });
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