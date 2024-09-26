const Access = require('../models/Access');
const Door = require('../models/Door');

// Grant access to a user for a specific door
exports.grantAccess = async (req, res) => {
  const { doorId, userEID, accessLevel } = req.body;

  if (!doorId || !userEID || !accessLevel) {
    return res.status(400).json({ message: 'Door ID, user EID, and access level are required' });
  }

  try {
    const door = await Door.findById(doorId);
    if (!door) {
      return res.status(404).json({ message: 'Door not found' });
    }

    const newAccess = new Access({ door: doorId, userEID, accessLevel });
    await newAccess.save();
    res.status(201).json(newAccess);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get access levels for a specific door
exports.getAccessByDoor = async (req, res) => {
  const { doorId } = req.params;

  try {
    const accessList = await Access.find({ door: doorId });
    res.json(accessList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
