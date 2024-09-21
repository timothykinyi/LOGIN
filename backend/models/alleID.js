// models/EID.js
const mongoose = require('mongoose');

const eIDSchema = new mongoose.Schema({
  eID: {
    type: String,
    required: true, // Ensure eID is required
    unique: true,   // Ensure eID is unique
  },
});


module.exports = mongoose.model('Allowed', eIDSchema);
