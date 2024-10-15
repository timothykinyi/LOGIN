// models/House.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AllowedUserSchema = new mongoose.Schema({
  eid: { type: String, required: true },
  access: { type: String, enum: ['all', 'specific'], required: true },
  specificDoors: [{ type: String }], // List of specific Door IDs for access
});

const DoorSchema = new mongoose.Schema({
  doorId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Door name
  password: { type: String, required: true },
  allowedUsers: [AllowedUserSchema], // Array of allowed users with access info
});

const HouseSchema = new mongoose.Schema({
  ownerEID: { type: Number, required: true},
  HID: { type: Number, required: true, unique: true },
  address: { type: String, required: true },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
  numberOfDoors: { type: Number, required: true },
  doors: [DoorSchema],
});

DoorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('House', HouseSchema);
