const Door = require('../models/Door');

// Add a new door
exports.addDoor = async (req, res) => {
    const { name, houseId } = req.body;

    if (!name || !houseId) {
        return res.status(400).json({ message: 'Door name and house ID are required' });
    }

    try {
        // Generate a new door ID (incremental, unique)
        const lastDoor = await Door.findOne({}).sort({ doorID: -1 }).limit(1);
        const newDoorID = lastDoor ? lastDoor.doorID + 1 : 1;

        const newDoor = new Door({ name, houseId, doorID: newDoorID });
        await newDoor.save();
        res.status(201).json({ message: 'Door added successfully', door: newDoor });
    } catch (error) {
        console.error("Error adding door:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all doors for a specific house
exports.getDoorsByHouseId = async (req, res) => {
    const { houseId } = req.params;

    try {
        const doors = await Door.find({ houseId });
        res.json(doors);
    } catch (error) {
        console.error("Error fetching doors:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
