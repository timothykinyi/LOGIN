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


  personalinfo: [
    {
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
      gender: String,
      maritalStatus: String,
      nationality: String,
      streetAddress1: String,
      streetAddress2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  ],

  contacts: [
    {
      phoneNumbers: [
        {
          number: String,
        },
      ],
      emails: [
        {
          email: String,
        },
      ],
      emergencyContacts: [
        {
          name: String,
          phone: String,
          address: String,
        },
      ],
      socialMedia: [
        {
          platform: String,
          username: String,
        },
      ],
      address: {
        streetAddress1: String,
        streetAddress2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    },
  ],

  //EDUDATION MODEL
  education: [
    {
      educationLevel: String,
      institutionName: String,
      degreeType: String,
      degree: String,
      fieldOfStudy: String,
      startDate: Date,
      endDate: Date,
      country: String,
      transferDetails: String,
    }
  ],

  // EMPLOYMENT MODEL
  employment: [
    {    
      jobTitle: String,
      employer: String,
      jobCategory: String,
      startDate: Date,
      endDate: Date,
      skills: String,
    }
  ],

  preference: [
    {
      hobbies: [String],
      dietaryPreference: String,
      religiousAffiliation: String,
      selectedHobbies: [String],
      selectedActivities: [String],
      selectedMusicGenres: [String],
      favoriteCuisine: String,
      sleepPreference: String,
      petPreference: String,
      environmentalPractices: String,
    }
  ],

  finance: [
    {
      bankAccountNumber: String,
      bankName: String,
      income: Number,
      creditScore: Number,
      taxId: String,
      mobileNumber: String,
    }
  ],

  social: [
    {
      maritalStatus: String,
      familyMembers: [
        {
          name: String,
          relationship: String,
        },
      ],
      dependents: [
        {
          name: String,
          relationship: String,
        },
      ],
      socialAffiliations: [
        {
          organization: String,
          role: String,
        },
      ],
    }
  ]


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
