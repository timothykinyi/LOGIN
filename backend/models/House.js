const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    ownerEID: { type: String, required: true },
});

const House = mongoose.model('House', houseSchema);

module.exports = House;
