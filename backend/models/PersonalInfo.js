const mongoose = require('mongoose');

const personalInfoSchema = mongoose.Schema({
  eID: { type: Number, required: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  nationality: { type: String, required: true },
  streetAddress1: { type: String, required: true },
  streetAddress2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('PersonalInfo', personalInfoSchema);
