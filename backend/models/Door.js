const mongoose = require('mongoose');

const doorSchema = new mongoose.Schema({
  doorID: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
    required: true,
  },
}, { timestamps: true });

const Door = mongoose.model('Door', doorSchema);
module.exports = Door;
