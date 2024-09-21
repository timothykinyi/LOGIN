// models/alleID.js

const mongoose = require('mongoose');

const allowedSchema = new mongoose.Schema({
  eIDs: {
    type: [String], // Array of eID strings
    required: true
  }
});

module.exports = mongoose.model('Allowed', allowedSchema);
