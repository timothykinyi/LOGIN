const mongoose = require('mongoose');

const doorSchema = new mongoose.Schema({
    doorID: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
});

const Door = mongoose.model('Door', doorSchema);

module.exports = Door;
