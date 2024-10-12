const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: { type: Number, required: true},
    subscription: { type: Object, required: true },          // Store the push subscription object
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
