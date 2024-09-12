const mongoose = require('mongoose');

const FinancialSchema = new mongoose.Schema({
  eID: { type: Number, required: true},
  bankAccountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  income: { type: Number, required: true },
  creditScore: { type: Number, required: true },
  taxId: { type: String, required: true },
  mobileNumber: { type: String, required: true }
});

module.exports = mongoose.model('Financial', FinancialSchema);
