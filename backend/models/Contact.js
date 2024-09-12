// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  eID: { type: Number, required: true},
  phoneNumbers: [{ number: String }],
  emails: [{ email: String }],
  emergencyContacts: [
    {
      name: String,
      phone: String,
      address: String,
    },
  ],
  socialMedia: [
    {
      platform: String,
      username: String,
    },
  ],
  address: {
    streetAddress: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
