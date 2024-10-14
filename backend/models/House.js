// models/House.js
const mongoose = require('mongoose');

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
  ownerEID: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  numberOfDoors: { type: Number, required: true },
  doors: [DoorSchema],
});

module.exports = mongoose.model('House', HouseSchema);
