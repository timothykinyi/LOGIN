// routes/notifications.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create a new notification (this would likely be called from other parts of your system)
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { title, message } = req.body;
  try {
    const notification = await notificationController.postNotification(userId, title, message);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification' });
  }
});

// Get all notifications for a user
router.get('/:userId', notificationController.getUserNotifications);

// Mark a notification as read
router.post('/read/:notificationId', notificationController.markNotificationAsRead);

// Mark all notifications as read for a user
router.post('/read-all/:userId', notificationController.markAllNotificationsAsRead);

module.exports = router;
