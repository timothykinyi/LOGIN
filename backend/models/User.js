const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Importing the new models
const SocialFamily = require('./models/SocialFamily');
const Preference = require('./models/Preference');
const PersonalInfo = require('./models/PersonalInfo');
const Financial = require('./models/Financial');
const Contact = require('./models/Contact');

// User Schema
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

  // WebAuthn fields for fingerprint auth
  credentialID: { type: String },
  publicKey: { type: String },
  counter: { type: Number, default: 0 },
  transports: { type: [String] },

  // Reference to the new models
  socialFamily: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialFamily' },
  preferences: { type: mongoose.Schema.Types.ObjectId, ref: 'Preference' },
  personalInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalInfo' },
  financial: { type: mongoose.Schema.Types.ObjectId, ref: 'Financial' },
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },

  // Health model
  health: {
    bloodType: { type: String },
    allergies: [String],
    medicalHistory: [{
      date: { type: Date },
      description: { type: String }
    }],
    insuranceProvider: { type: String },
    policyNumber: { type: String },
    coverageDetails: { type: String },
    conditions: [String],
    disabilities: [String],
    additionalInfo: { type: String }
  },

  // Education model
  education: [{
    educationLevel: { type: String },
    institutionName: { type: String },
    degreeType: { type: String },
    degree: { type: String },
    fieldOfStudy: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    country: { type: String },
    transferDetails: { type: String }
  }],

  // Employment model
  employment: [{
    jobTitle: { type: String },
    employer: { type: String },
    jobCategory: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    skills: { type: String }
  }]
}, { timestamps: true });

// Password hashing middleware
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
