const mongoose = require('mongoose');

const DataShareSchema = new mongoose.Schema({
  dataID: { type: String, required: true, unique: true },
  sharedData: { type: mongoose.Schema.Types.Mixed, required: true },
  expiryTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DataShare', DataShareSchema);
