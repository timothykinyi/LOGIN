// controllers/houseController.js
const House = require('../models/House');
const User = require('../models/User');
const sendEmail = require('../services/emailService');
const { generateAlphanumericVerificationCode } = require('../services/verificationcode');
const bcrypt = require('bcryptjs');
const { getDoorsByHouse } = require('./doorManagementController');

// House registration handler
const registerHouse = async (req, res) => {
  const { ownerEID, address, numberOfDoors, password, confirmPassword, doorNames, userEIDs } = req.body;

  try {
    // EID validation
    const user = await User.findOne({ eID: ownerEID });
    if (!user) {
      return res.status(400).json({ message: "The eID entered is not valid " + ownerEID });
    }

    // Generate unique HID
    const generateHID = () => Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    let HID = generateHID();

    // Ensure HID is unique
    while (await House.exists({ HID })) {
      HID = generateHID();
    }

    // Password validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    } else if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    } else if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter.' });
    } else if (!/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter.' });
    } else if (!/\d/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one number.' });
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing with a salt of 10 rounds
    // Generate verification code
    const alphanumericCode = generateAlphanumericVerificationCode(6);

    const newHouse = new House({ ownerEID, verificationCode: alphanumericCode, HID, address, numberOfDoors });

    // Generate Door IDs and add door names, passwords, and allowed users
    for (let i = 0; i < numberOfDoors; i++) {
      const doorId = `door-${newHouse._id}-${i + 1}`; // Generate a unique Door ID
      const doorPassword = password; // Store the hashed password
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


    const subject = "Verification - " + alphanumericCode;
    const vermessage = `Dear ${user.username},

Thank you for registering your house with eID. Please use the following verification code to complete your registration:

Your house ID (HID) is: ${HID}

Verification Code: ${alphanumericCode}

Follow this link https://own-my-data.web.app/house/verification to verify your account

Best regards,
eID`;

    // Send verification email
    try {
      await sendEmail(user.email, subject, vermessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    res.status(201).json({ message: 'House registered successfully' , HID });
    
  } catch (err) {
    console.error('Error in registerHouse:', err); // More detailed logging
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyUser = async (req, res) => {
  const { HID, verificationCode } = req.body;

  try {
    const house = await House.findOne({ HID });
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    if (house.isVerified) {
      return res.status(400).json({ message: 'House already verified' });
    }

    if (house.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    house.isVerified = true;
    await house.save();

    res.status(200).json({ message: 'House verified successfully' });
  } catch (error) {
    console.error('Server error during verification:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const resendVerificationCode = async (req, res) => {
  const { HID } = req.body;

  try {
    const house = await House.findOne({ HID});
    if (!house) {
      return res.status(404).json({ message: 'House not found register first and try again.' });
    }
    const user = await User.findOne({ eID: house.ownerEID });
    if (!user) {
      return res.status(400).json({ message: "Can't resend try again later."});
    }

    const subject = "Verification - " + house.verificationCode;
    const vermessage = `Dear ${user.username},

Thank you for registering with eID. Please use the following verification code to complete your registration:

Your house ID (HID) is: ${HID}

Verification Code: ${house.verificationCode}

Follow this link https://own-my-data.web.app/house/verification to verify your account

Best regards,
eID`;
    try {
      await sendEmail(user.email, subject, vermessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    res.status(200).json({ message: 'Verification code sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while sending verification code.' });
  }
};

const getHouseDetails = async (req, res) => {
  const { HID } = req.params;

  try {
    const house = await House.findOne({ HID });

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    res.status(200).json(house);
  } catch (error) {
    console.error('Error fetching house details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateDoorAccess = async (req, res) => {
  const { HID, doorId } = req.params;
  const { allowedUsers } = req.body;

  try {
    const house = await House.findOne({ HID });

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    const door = house.doors.find(door => door.doorId === doorId);
    if (!door) {
      return res.status(404).json({ message: 'Door not found' });
    }

    // Update allowedUsers for the door
    door.allowedUsers = allowedUsers;

    await house.save();

    res.status(200).json({ message: 'Access updated successfully', door });
  } catch (error) {
    console.error('Error updating access:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeUserFromDoor = async (req, res) => {
  const { HID, doorId, userEID } = req.params;

  try {
    const house = await House.findOne({ HID });

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    const door = house.doors.find(door => door.doorId === doorId);
    if (!door) {
      return res.status(404).json({ message: 'Door not found' });
    }

    // Remove the user by filtering the allowedUsers array
    door.allowedUsers = door.allowedUsers.filter(user => user.eid !== userEID);

    await house.save();

    res.status(200).json({ message: 'User removed successfully', door });
  } catch (error) {
    console.error('Error removing user from door access:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getHousesByOwnerEID = async (req, res) => {
  const { eID } = req.body;
  console.log(eID);
  try {
    const houses = await House.find({ ownerEID: eID });
    if (houses.length === 0) {
      return res.status(404).json({ message: 'No houses found for this EID '+ ownerEID });
    }
    res.status(200).json(houses);
  } catch (err) {
    console.error('Error fetching houses:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerHouse, verifyUser, resendVerificationCode, getHouseDetails, updateDoorAccess, removeUserFromDoor, getHousesByOwnerEID};
