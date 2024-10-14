// controllers/houseController.js
const House = require('../models/House');
const User = require('../models/User');
const sendEmail = require('../services/emailService');
const { generateAlphanumericVerificationCode } = require('../services/verificationcode');

// House registration handler
const registerHouse = async (req, res) => {
  const { ownerEID, address, numberOfDoors, password, confirmPassword, doorNames, userEIDs } = req.body;

  try {
    // EID validation
    const user = await User.findOne({ eID: ownerEID });
    if (!user) {
      return res.status(400).json({ message: "The eID entered is not valid "+ ownerEID});
    }

    const generateHID = () => {
      return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    };
    const HID = generateHID();
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

    const newHouse = new House({ ownerEID, HID, address, numberOfDoors });

    // Generate Door IDs and add door names, passwords, and allowed users
    for (let i = 0; i < numberOfDoors; i++) {
      const doorId = `door-${newHouse._id}-${i + 1}`; // Generate a unique Door ID
      const doorPassword = password
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


      // Generate verification code
      const alphanumericCode = generateAlphanumericVerificationCode(6);
      const subject = "Verification - " + alphanumericCode;
      const vermessage = `Dear ${user.username},

  Thank you for registering your house with eID. Please use the following verification code to complete your registration:

  Verification Code: ${alphanumericCode}

  Follow this link https://own-my-data.web.app/verification to verify your account

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
      res.status(201).json({ message: 'House registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }

  
};



module.exports = { registerHouse };
