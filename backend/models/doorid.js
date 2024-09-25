// models/doorid.js
const mongoose = require('mongoose');

const dooridSchema = new mongoose.Schema({
    doorID: { type: Number, required: true, unique: true }, 
    name: { type: String, required: true },
});

const Doorids = mongoose.model('Doorid', dooridSchema);

module.exports = Doorids;
