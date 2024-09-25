const Door = require('../models/Door');

// Function to generate a unique door ID
const generateDoorID = async () => {
    let doorID = Math.floor(Math.random() * 10000); // Generate a random ID
    while (await Door.exists({ doorID })) {
        doorID = Math.floor(Math.random() * 10000); // Regenerate if it already exists
    }
    return doorID;
};

// Add a new door to a house
exports.addDoor = async (req, res) => {
    const { name, houseId } = req.body;

    if (!name || !houseId) {
        return res.status(400).json({ message: 'Door name and house ID are required' });
    }

    try {
        const doorID = await generateDoorID(); // Generate a unique door ID
        const newDoor = new Door({ doorID, name, houseId });
        await newDoor.save();
        res.status(201).json({ message: 'Door added successfully', newDoor });
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
