const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  publicKey: { type: String, required: true }, // Public key credential
});

module.exports = mongoose.model('Fingeruser', userSchema);
