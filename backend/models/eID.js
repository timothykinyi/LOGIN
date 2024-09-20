// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    allowed: [
        {
            eID: { type: Number, required: true, unique: true }, 
            name: { type: String, required: true },
            relationship: { type: String, required: true },
        },
    ],
});

const Contact = mongoose.model('Allowed', contactSchema);

module.exports = Contact;
