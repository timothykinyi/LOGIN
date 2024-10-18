const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CompSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: Number, required: true, unique: true },
  category: { type: String, required: true },
  cID: { type: Number, required: true, unique: true }, // New cID field
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
  passwordRecoveryToken: { type: String, default: undefined },
  tokenExpiry: { type: Date, default: undefined },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
  passwordRecoveryToken: { type: String, default: undefined },
  tokenExpiry: { type: Date, default: undefined },

  // WebAuthn fields for fingerprint auth
  credentialID: { type: String },   // ID of the WebAuthn credential
  publicKey: { type: String },      // Public key from the fingerprint credential
  counter: { type: Number },        // Replay counter to prevent credential reuse
  transports: { type: [String] },   // Methods of transport (e.g., 'usb', 'nfc')

  // New field for storing selected data
selectedData: { type: Map, default: {} }  // Store selected data as key-value pairs

}, { timestamps: true });

// Hash password before saving
CompSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('Comp', CompSchema);
