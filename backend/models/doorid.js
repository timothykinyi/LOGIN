// models/Contact.js
const mongoose = require('mongoose');

const dooridSchema = new mongoose.Schema({
    doorid: [
        {
            doorID: { type: Number, required: true, unique: true }, 
            name: { type: String, required: true },
        },
    ],
});

const Doorids = mongoose.model('doorid', dooridSchema);

module.exports = Doorids;
