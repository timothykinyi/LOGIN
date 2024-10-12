const mongoose = require('mongoose');

const sharedDataSchema = new mongoose.Schema({
  eID: { type: Number, required: true },
  dID: { type: Number, required: true },
  sharedData: { type: Object, required: true },
  sharedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SharedData', sharedDataSchema);
