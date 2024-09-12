// models/Employment.js
const mongoose = require('mongoose');

const employmentSchema = new mongoose.Schema({
  eID: { type: Number, required: true},
  jobTitle: {
    type: String,
    required: true
  },
  employer: {
    type: String,
    required: true
  },
  jobCategory: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: 'Continuing'
  },
  skills: {
    type: String
  },
}, { timestamps: true }); // adds createdAt and updatedAt timestamps

const Employment = mongoose.model('Employment', employmentSchema);

module.exports = Employment;
