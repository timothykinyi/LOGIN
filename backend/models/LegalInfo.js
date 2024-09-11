const mongoose = require('mongoose');

const LegalInfoSchema = new mongoose.Schema({
  criminalRecord: { type: String, required: false },
  contracts: { type: String, required: false },
  agreements: { type: String, required: false },
  legalDisputes: { type: String, required: false },
  uploadRecords: { type: String, required: false },
  uploadContracts: { type: String, required: false },
  uploadAgreements: { type: String, required: false },
  uploadDisputes: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('LegalInfo', LegalInfoSchema);
