const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const webPush = require('web-push');
const Subscription = require('./models/subscription');  // The model we just defined

const app = express();
const port = 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/notifications', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set VAPID keys (Replace these with your keys)
const publicVapidKey = 'YOUR_PUBLIC_VAPID_KEY';
const privateVapidKey = 'YOUR_PRIVATE_VAPID_KEY';

webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  publicVapidKey,
  privateVapidKey
);

app.use(bodyParser.json());

// Route to handle subscription and store it in MongoDB
app.post('/subscribe', async (req, res) => {
  const { userId, subscription } = req.body;

  try {
    // Find existing subscription or create a new one
    const existingSubscription = await Subscription.findOne({ userId });

    if (existingSubscription) {
      existingSubscription.subscription = subscription;
      await existingSubscription.save();
    } else {
      const newSubscription = new Subscription({ userId, subscription });
      await newSubscription.save();
    }

    res.status(201).json({ message: 'Subscription saved successfully!' });
    console.log(`Subscription saved for user ${userId}`);
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ message: 'Failed to save subscription' });
  }
});

// Route to send a notification to a specific user
app.post('/send-notification/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userSubscription = await Subscription.findOne({ userId });

    if (userSubscription) {
      const payload = JSON.stringify({
        title: 'Targeted Notification',
        body: 'This is a notification just for you!',
      });

      await webPush.sendNotification(userSubscription.subscription, payload);
      res.status(200).json({ message: `Notification sent to user ${userId}` });
    } else {
      res.status(404).json({ message: 'Subscription not found for user ' + userId });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
