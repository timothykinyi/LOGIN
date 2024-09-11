const Education = require('../models/Education');

// Add new education entry
const addEducation = async (req, res) => {
  try {
    const newEducation = new Education(req.body);
    const savedEducation = await newEducation.save();
    res.status(201).json(savedEducation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add education entry', details: error.message });
  }
};

// Get all education entries
const getAllEducation = async (req, res) => {
  try {
    const educationEntries = await Education.find();
    res.status(200).json(educationEntries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch education entries', details: error.message });
  }
};

module.exports = {
  addEducation,
  getAllEducation
};
