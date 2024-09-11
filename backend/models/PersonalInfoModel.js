// models/PersonalInfoModel.js
const mongoose = require('mongoose');

const PersonalInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  idNumber: { type: String, required: true },
  idType: { type: String, required: true },
  gender: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  nationality: { type: String, required: true },
  streetAddress1: { type: String, required: true },
  streetAddress2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

module.exports = mongoose.model('PersonalInfo', PersonalInfoSchema);
