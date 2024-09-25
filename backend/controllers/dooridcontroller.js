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

// Add a new door ID
exports.addDID = async (req, res) => {
  const { doorID, name } = req.body; // Extract doorID and name from request body

  // Validate input
  if (!doorID || !name) {
    return res.status(400).json({ message: 'Both doorID and name are required' });
  }

  try {
    // Check if the doorID already exists
    const existingDID = await Doorids.findOne({ doorID });
    if (existingDID) {
      return res.status(400).json({ message: `Door ID ${doorID} already exists` });
    }

    // Create a new instance of Doorids
    const newDID = new Doorids({ doorID, name });
    await newDID.save(); // Save the instance to the database

    // Return the newly created instance as a response
    res.status(201).json({ message: 'Door ID added successfully', newDID });
  } catch (error) {
    console.error("Error adding door ID:", error);
    res.status(500).json({ message: 'Server error' });
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
