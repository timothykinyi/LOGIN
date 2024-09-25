const mongoose = require('mongoose');

const doorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
    doorID: { type: Number, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Door', doorSchema);
