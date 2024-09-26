const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerEID: { type: String, required: true },
    houseID: { type: Number, required: true, unique: true },
    doors: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Door',
        },
      ],
}, { timestamps: true });

module.exports = mongoose.model('House', houseSchema);
