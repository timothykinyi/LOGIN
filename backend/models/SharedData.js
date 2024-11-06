const mongoose = require('mongoose');

const DataShareSchema = new mongoose.Schema({
  eID: { type: Number, required: true}, 
  dataID: { type: String, required: true, unique: true },
  selectedData: { type: Map, default: {} },
  expiryTime: { type: Date, required: true },
  viewOnce: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('DataShare', DataShareSchema);
