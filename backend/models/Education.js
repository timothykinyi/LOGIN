const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const educationSchema = new Schema({
  educationLevel: { type: String, required: true },
  institutionName: { type: String, required: true },
  degreeType: { type: String },
  degree: { type: String },
  fieldOfStudy: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  country: { type: String, required: true },
  transferDetails: { type: String }
});

module.exports = mongoose.model('Education', educationSchema);
