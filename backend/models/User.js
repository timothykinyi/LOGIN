const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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

  // WebAuthn fields for fingerprint auth
  credentialID: { type: String },   // ID of the WebAuthn credential
  publicKey: { type: String },      // Public key from the fingerprint credential
  counter: { type: Number },        // Replay counter to prevent credential reuse
  transports: { type: [String] },   // Methods of transport (e.g., 'usb', 'nfc')

  //HEATH MODEL
  bloodType: { type: String, default: undefined  },
  allergies: String,
  medicalHistory: [{
    date: { type: Date, default: undefined  },
    description: { type: String, default: undefined }
  }],
  insuranceProvider: { type: String, default: undefined  },
  policyNumber: { type: String, default: undefined  },
  coverageDetails: { type: String, default: undefined  },
  conditions: String,
  disabilities: String,
  additionalInfo: String,

  //EDUDATION MODEL
  educationLevel: { type: String, default: '-' },
  institutionName: { type: String, default: undefined },
  degreeType: { type: String, default: undefined  },
  degree: { type: String, default: undefined  },
  fieldOfStudy: { type: String, default: undefined },
  startDate: { type: Date, default: undefined },
  endDate: { type: Date, default: undefined },
  country: { type: String, default: undefined  },
  transferDetails: { type: String, default: undefined},


  // EMPLOYMENT MODEL
  jobTitle: {type: String, default: undefined },
  employer: {type: String, default: undefined },
  jobCategory: {type: String, default: undefined },
  startDate: {type: Date, default: undefined },
  endDate: {type: Date, default: undefined },
  skills: {type: String, default: undefined },
  
  //SOCIALS
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
