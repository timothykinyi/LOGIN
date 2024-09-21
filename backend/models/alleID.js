// models/EID.js
const mongoose = require('mongoose');

const eIDSchema = new mongoose.Schema({
  eID: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model('Allowed', eIDSchema);
