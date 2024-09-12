// models/HealthData.js
const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  eID: { type: Number, required: true},
  bloodType: { type: String, required: true },
  allergies: String,
  medicalHistory: [{
    date: { type: Date, required: true },
    description: { type: String, required: true }
  }],
  insuranceProvider: { type: String, required: true },
  policyNumber: { type: String, required: true },
  coverageDetails: { type: String, required: true },
  conditions: String,
  disabilities: String,
  additionalInfo: String
});

const HealthData = mongoose.model('HealthData', healthDataSchema);

module.exports = HealthData;
