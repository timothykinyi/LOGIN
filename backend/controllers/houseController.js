const House = require('../models/House');

// Add a new house
exports.addHouse = async (req, res) => {
    const { name, ownerEID } = req.body;

    if (!name || !ownerEID) {
        return res.status(400).json({ message: 'House name and owner EID are required' });
    }

    try {
        const newHouse = new House({ name, ownerEID });
        await newHouse.save();
        res.status(201).json({ message: 'House registered successfully', houseId: newHouse._id });
    } catch (error) {
        console.error("Error registering house:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all houses
exports.getHouses = async (req, res) => {
    try {
        const houses = await House.find();
        res.json(houses);
    } catch (error) {
        console.error("Error fetching houses:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
