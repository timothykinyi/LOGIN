const mongoose = require('mongoose');

const selectedDataSchema = new mongoose.Schema({
  compId: { type: String, required: true },
  did: { type: String, unique: true, required: true },
  expiry: { type: Date, required: true },
  data: { type: Map, of: String }, // This will store the selected fields data
});

module.exports = mongoose.model('SelectedData', selectedDataSchema);
