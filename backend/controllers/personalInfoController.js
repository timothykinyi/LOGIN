const PersonalInfo = require("../models/PersonalInfo");

// Handle the form data submission and store it in MongoDB
const submitPersonalInfo = async (req, res) => {
  try {
    const { fullName, gender, dob, nationality, idType, idNumber } = req.body;

    // Create a new personal info entry using the model
    const newPersonalInfo = new PersonalInfo({
      fullName,
      gender,
      dob,
      nationality,
      idType,
      idNumber,
    });

    // Save the data to the database
    await newPersonalInfo.save();

    // Send a success response to the client
    res.status(201).json({ message: "Personal info stored successfully" });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Failed to store personal info", error });
  }
};

module.exports = { submitPersonalInfo };
