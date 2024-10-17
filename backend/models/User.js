const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema for SocialFamily
const socialFamilySchema = new mongoose.Schema({
  eID: { type: Number, required: true },
  maritalStatus: { type: String, required: true },
  familyMembers: [
    {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
    },
  ],
  dependents: [
    {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
    },
  ],
  socialAffiliations: [
    {
      organization: { type: String, required: true },
      role: { type: String, required: true },
    },
  ],
});

// Schema for PersonalInfo
const personalInfoSchema = new mongoose.Schema({
  eID: { type: Number, required: true },
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
}, { timestamps: true });

// Schema for HealthData
const healthDataSchema = new mongoose.Schema({
  eID: { type: Number, required: true },
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

// Other Schemas for Financial, Employment, Education, Contact, and Preferences
// Add them as per the models you've shared above, in the same way as shown above for healthDataSchema and personalInfoSchema.

// Main User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  category: { type: String, required: true },
  eID: { type: Number, required: true, unique: true }, // New E ID field
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
  passwordRecoveryToken: { type: String, default: undefined },
  tokenExpiry: { type: Date, default: undefined },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },

  dataMigrated: { type: Boolean, default: false },
  
  socialFamily: socialFamilySchema, // Embedding the SocialFamily schema
  personalInfo: personalInfoSchema, // Embedding the PersonalInfo schema
  healthData: healthDataSchema, // Embedding the HealthData schema
  // Add other embedded schemas here

  // WebAuthn fields for fingerprint auth
  credentialID: { type: String },   // ID of the WebAuthn credential
  publicKey: { type: String },      // Public key from the fingerprint credential
  counter: { type: Number },        // Replay counter to prevent credential reuse
  transports: { type: [String] },   // Methods of transport (e.g., 'usb', 'nfc')

}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
