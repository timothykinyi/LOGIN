const Door = require('../models/Door');
const House = require('../models/House');

// Get doors by house ID
exports.getDoorsByHouse = async (req, res) => {
  const { houseId } = req.params;

  try {
    const doors = await Door.find({ house: houseId });
    res.json(doors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add a new door to a house
exports.addDoor = async (req, res) => {
  const { name, houseId } = req.body;

  if (!name || !houseId) {
    return res.status(400).json({ message: 'Door name and house ID are required' });
  }

  try {
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    const newDoor = new Door({
      doorID: `${houseId}-${Math.floor(1000 + Math.random() * 9000)}`, // Generate random door ID
      name,
      house: houseId,
    });

    await newDoor.save();

    house.doors.push(newDoor._id);
    await house.save();

    res.status(201).json(newDoor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
