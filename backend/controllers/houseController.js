const House = require('../models/House');

// Register a new house
exports.registerHouse = async (req, res) => {
    const { name, address, ownerEID } = req.body;

    if (!name || !address || !ownerEID) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newHouse = new House({ name, address, ownerEID });
        await newHouse.save();
        res.status(201).json({ message: 'House registered successfully', newHouse });
    } catch (error) {
        console.error("Error registering house:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all houses
exports.getAllHouses = async (req, res) => {
    try {
        const houses = await House.find();
        res.json(houses);
    } catch (error) {
        console.error("Error fetching houses:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
