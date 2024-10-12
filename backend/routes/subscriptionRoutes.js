const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Route to handle subscription
router.post('/subscribe', subscriptionController.subscribeUser);

// Route to send notification to a specific user
router.post('/send-notification/:userId', subscriptionController.sendNotification);

module.exports = router;
