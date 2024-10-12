const Subscription = require('../models/subscription');
const webPush = require('web-push');

// Set VAPID keys (Replace these with your keys)
const publicVapidKey = 'BHy-iFuUVJcGUNDPMC4LbU4-XF__xh_60-zl5c8nS4eOwY5bfcxjEmGBZ4JIfzwcDkuq7IttOv0_YRKo9qm_On8';
const privateVapidKey = 'DsB4ClhnMAIRGvk3uqJMl0_cpcf_kgJ1UPZITHYZbmw';

webPush.setVapidDetails(
  'mailto:techhiracontact@gmail.com',
  publicVapidKey,
  privateVapidKey
);

// Controller function to handle user subscription
exports.subscribeUser = async (req, res) => {
  const { userId, subscription } = req.body;

  try {
    // Find an existing subscription for the user
    const existingSubscription = await Subscription.findOne({ userId });

    if (existingSubscription) {
      // Update the existing subscription
      existingSubscription.subscription = subscription;
      await existingSubscription.save();
    } else {
      // Create a new subscription
      const newSubscription = new Subscription({ userId, subscription });
      await newSubscription.save();
    }

    res.status(201).json({ message: 'Subscription saved successfully!' });
    console.log(`Subscription saved for user ${userId}`);
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ message: 'Failed to save subscription' });
  }
};

// Controller function to send notification to a specific user
exports.sendNotification = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch the subscription for the user
    const userSubscription = await Subscription.findOne({ userId });

    if (userSubscription) {
      const payload = JSON.stringify({
        title: 'Targeted Notification',
        body: 'This is a notification just for you!',
      });

      // Send the push notification
      await webPush.sendNotification(userSubscription.subscription, payload);
      res.status(200).json({ message: `Notification sent to user ${userId}` });
    } else {
      res.status(404).json({ message: 'Subscription not found for user ' + userId });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
};
