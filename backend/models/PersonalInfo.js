const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  nationality: { type: String, required: true },
  idType: { type: String, required: true },
  idNumber: { type: String, required: true },
}, {
  timestamps: true  // Adds createdAt and updatedAt timestamps
});

const PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);

module.exports = PersonalInfo;
