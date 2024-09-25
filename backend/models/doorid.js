const mongoose = require('mongoose');

// Define schema for each door with a unique doorID and name
const dooridSchema = new mongoose.Schema({
  doorID: { type: Number, required: true, unique: true }, // doorID must be unique
  name: { type: String, required: true }, // Human-readable name for the door
});

// Define and export the model
const Doorids = mongoose.model('Doorids', dooridSchema);

module.exports = Doorids;
