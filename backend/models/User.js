const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Education sub-schema
const educationSchema = new mongoose.Schema({
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

// Main User Schema
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  category: { type: String, required: true },
  eID: { type: Number, required: true, unique: true },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
  passwordRecoveryToken: { type: String, default: undefined },
  tokenExpiry: { type: Date, default: undefined },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },

  // WebAuthn fields
  credentialID: { type: String },
  publicKey: { type: String },
  counter: { type: Number },
  transports: { type: [String] },

  // Health Model
  bloodType: { type: String, default: undefined },
  allergies: String,
  medicalHistory: [{
    date: { type: Date, default: undefined },
    description: { type: String, default: undefined }
  }],
  insuranceProvider: { type: String, default: undefined },
  policyNumber: { type: String, default: undefined },
  coverageDetails: { type: String, default: undefined },
  conditions: String,
  disabilities: String,
  additionalInfo: String,

  // Employment Model
  jobTitle: { type: String, default: undefined },
  employer: { type: String, default: undefined },
  jobCategory: { type: String, default: undefined },
  startDate: { type: Date, default: undefined },
  endDate: { type: Date, default: undefined },
  skills: { type: String, default: undefined },

  // New education field
  education: [educationSchema], // Array of education sub-documents
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
