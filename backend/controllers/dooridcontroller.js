const Doorid = require('../models/Doorid');

// Get all door IDs
exports.getAllDoorIDs = async (req, res) => {
    try {
        const doorIDs = await Doorid.find();
        res.json(doorIDs);
    } catch (error) {
        console.error("Error fetching door IDs:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new door ID
exports.addDoorID = async (req, res) => {
    const { doorID, name } = req.body;

    if (!doorID || !name) {
        return res.status(400).json({ message: 'Both doorID and name are required' });
    }

    try {
        const existingDoorID = await Doorid.findOne({ doorID });
        if (existingDoorID) {
            return res.status(400).json({ message: `Door ID ${doorID} already exists` });
        }

        const newDoorID = new Doorid({ doorID, name });
        await newDoorID.save();
        res.status(201).json({ message: 'Door ID added successfully', newDoorID });
    } catch (error) {
        console.error("Error adding door ID:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove a door ID
exports.removeDoorID = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Doorid.findByIdAndDelete(id);
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
