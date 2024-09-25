const mongoose = require('mongoose');

const doorSchema = new mongoose.Schema({
  doorIDs: {
    type: [Number], // Array of numbers (multiple door IDs)
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Doorids', doorSchema);
