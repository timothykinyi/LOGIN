const PersonalInfo = require('../models/PersonalInfo');

// @desc    Submit personal info
// @route   POST /api/personal-info
// @access  Public
const submitPersonalInfo = async (req, res) => {
  const {
    eID, firstName, lastName, dateOfBirth, gender, maritalStatus,
    nationality, streetAddress1, streetAddress2, city, state, postalCode, country
  } = req.body;

  try {
    const personalInfo = new PersonalInfo({
      eID,
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
      country
    });

    await personalInfo.save();
    res.status(201).json({ message: 'Personal info submitted successfully', data: personalInfo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
