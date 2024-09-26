const mongoose = require('mongoose');

const accessSchema = new mongoose.Schema({
  door: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Door',
    required: true,
  },
  userEID: {
    type: String,
    required: true,
  },
  accessLevel: {
    type: String,
    enum: ['view', 'control'],
    default: 'view',
  },
}, { timestamps: true });

const Access = mongoose.model('Access', accessSchema);
module.exports = Access;
