const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerEID: { type: String, required: true },
    houseID: { type: Number, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('House', houseSchema);
