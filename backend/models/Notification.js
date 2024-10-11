// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: Number, required: true},
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timeSent: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
