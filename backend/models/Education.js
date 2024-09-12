const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  eID: { type: Number, required: true},
  educationLevel: { type: String, required: true },
  institutionName: { type: String, required: true },
  degreeType: { type: String },
  degree: { type: String },
  fieldOfStudy: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  country: { type: String, required: true },
  transferDetails: { type: String },
});

const Education = mongoose.model('Education', educationSchema);

module.exports = Education;
