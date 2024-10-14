// controllers/houseController.js
const House = require('../models/House');
const sendEmail = require('../utils/sendEmail');

// House registration handler
const registerHouse = async (req, res) => {
  const { ownerEID, address, numberOfDoors, password, confirmPassword, doorNames, userEIDs } = req.body;

  try {
    // EID validation
    const isValidEID = await validateEID(ownerEID); // Implement this function according to your requirements
    if (!isValidEID) return res.status(400).json({ message: 'Invalid EID' });

    const existingHouse = await House.findOne({ ownerEID });
    if (existingHouse) return res.status(400).json({ message: 'EID already registered' });

    // Password validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const newHouse = new House({ ownerEID, address, numberOfDoors });

    // Generate Door IDs and add door names, passwords, and allowed users
    for (let i = 0; i < numberOfDoors; i++) {
      const doorId = `door-${newHouse._id}-${i + 1}`; // Generate a unique Door ID
      const doorPassword = Math.random().toString(36).slice(-8); // Generate a random password
      const doorName = doorNames[i]; // Get the name from the input
      
      // Initialize door with allowed users
      const allowedUsers = userEIDs.map(user => {
        return {
          eid: user.eid,
          access: user.access,
          specificDoors: user.access === 'specific' ? [doorId] : [], // If specific access, add the door ID
        };
      });

      newHouse.doors.push({ doorId, name: doorName, password: doorPassword, allowedUsers });
    }

    await newHouse.save();

    // Send email notification
    await sendEmail(ownerEID, 'House Registration', `Your house has been registered at ${address} with ${numberOfDoors} doors.`);

    res.status(201).json({ message: 'House registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mock EID Validation (replace with your own logic)
const validateEID = async (eid) => {
  // Implement your EID validation logic here
  return true; // Assume valid for this example
};

module.exports = { registerHouse };
