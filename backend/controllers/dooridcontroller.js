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
// Add a new door entry with multiple door IDs
exports.addDID = async (req, res) => {
  const { doorIDs, name } = req.body; // Extract doorIDs (array) and name from the request body

  if (!doorIDs || !Array.isArray(doorIDs) || doorIDs.length === 0 || !name) {
    return res.status(400).json({ message: 'An array of doorIDs and a name are required' });
  }

  try {
    // Create a new door entry with multiple door IDs
    const newDoor = new Doorids({ doorIDs, name });
    await newDoor.save();
    res.status(201).json({ message: 'Door IDs added successfully' });
  } catch (error) {
    console.error("Error adding door IDs:", error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'One or more Door IDs already exist' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};


// Remove a door ID
// Remove a specific door ID from an entry
exports.removeDID = async (req, res) => {
  const { id } = req.params; // The document ID
  const { doorID } = req.body; // The specific door ID to remove

  try {
    const doorEntry = await Doorids.findById(id);

    if (!doorEntry) {
      return res.status(404).json({ message: 'Door entry not found' });
    }

    // Remove the specific door ID from the array
    doorEntry.doorIDs = doorEntry.doorIDs.filter(did => did !== doorID);

    // If no doorIDs left, delete the entry, otherwise update it
    if (doorEntry.doorIDs.length === 0) {
      await Doorids.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Door entry removed successfully as no doorIDs left' });
    } else {
      await doorEntry.save();
      return res.status(200).json({ message: 'Door ID removed successfully' });
    }
  } catch (error) {
    console.error("Error removing door ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all allowed door IDs
exports.getAllowedDIDs = async (req, res) => {
  try {
    const allowedDIDs = await Doorids.find();
    res.json(allowedDIDs); // This will now return multiple doorIDs for each entry
  } catch (error) {
    console.error("Error fetching allowed door IDs:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
