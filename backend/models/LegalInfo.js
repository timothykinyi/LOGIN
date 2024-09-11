const mongoose = require('mongoose');

const legalInfoSchema = new mongoose.Schema({
  criminalRecord: { type: String, required: true },
  contracts: { type: String, required: true },
  agreements: { type: String, required: true },
  legalDisputes: { type: String, required: true },
  uploadRecords: { type: String },
  uploadContracts: { type: String },
  uploadAgreements: { type: String },
  uploadDisputes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('LegalInfo', legalInfoSchema);
