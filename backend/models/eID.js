// models/Contact.js
const mongoose = require('mongoose');

const eidSchema = new mongoose.Schema({
    allowed: [
        {
            eID: { type: Number, required: true, unique: true }, 
            name: { type: String, required: true },
            relationship: { type: String, required: true },
        },
    ],
});

const Alloweds = mongoose.model('Alloweds', eidSchema);

module.exports = Alloweds;
