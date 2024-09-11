const PersonalInfo = require('../models/PersonalInfo');

// @desc    Submit personal info
// @route   POST /api/personal-info
// @access  Public
const submitPersonalInfo = async (req, res) => {
  const {
    firstName, lastName, dateOfBirth, gender, maritalStatus,
    nationality, streetAddress1, streetAddress2, city, state, postalCode, country
  } = req.body;

  try {
    // Create a new PersonalInfo document
    const personalInfo = new PersonalInfo({
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

module.exports = { submitPersonalInfo };
