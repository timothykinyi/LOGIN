// controllers/personalInfoController.js
const PersonalInfo = require('../models/PersonalInfoModel');

exports.submitPersonalInfo = async (req, res) => {
  try {
    const formData = new PersonalInfo(req.body);
    await formData.save();
    res.status(201).send({ message: 'Form data saved successfully!' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).send({ message: 'Error saving form data, please try again.' });
  }
};
