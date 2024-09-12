// models/SocialFamily.js
const mongoose = require('mongoose');

const socialFamilySchema = new mongoose.Schema({
  eID: { type: Number, required: true},
  maritalStatus: { type: String, required: true },
  familyMembers: [
    {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
    },
  ],
  dependents: [
    {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
    },
  ],
  socialAffiliations: [
    {
      organization: { type: String, required: true },
      role: { type: String, required: true },
    },
  ],
});

const SocialFamily = mongoose.model('SocialFamily', socialFamilySchema);

module.exports = SocialFamily;
