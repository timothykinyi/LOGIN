const PersonalInfo = require('../models/User');

// @desc    Submit personal info
// @route   POST /api/personal-info
// @access  Public
const submitPersonalInfo = async (req, res) => {
  const { eID, firstName, lastName, dateOfBirth, gender, maritalStatus, nationality, streetAddress1, streetAddress2, city, state, postalCode, country } = req.body;

  try {
    // Step 1: Check if the user exists
    const user = await User.findOne({ eID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Update the personalinfo array
    user.personalinfo.push({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      maritalStatus,
      nationality,
      streetAddress1,
      streetAddress2,
      city,
      state,
      postalCode,
      country,
    });

    // Save the user
    await user.save();
    
    res.status(200).json({ message: "Personal information added successfully" });
  } catch (error) {
    console.error("Error adding personal information:", error);
    res.status(500).json({ message: "Server error, could not add personal information" });
  }
};

// @desc    Get all personal info
// @route   GET /api/personal-info
// @access  Public
const getAllPersonalInfo = async (req, res) => {
  try {
    const personalInfoList = await PersonalInfo.find(); // Fetch all entries
    res.status(200).json({ message: 'Data fetched successfully', data: personalInfoList });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { submitPersonalInfo, getAllPersonalInfo };
