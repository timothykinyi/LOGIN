self.addEventListener('push', function(event) {
  const data = event.data.json();
  console.log('Push event received: ', data); // Log the push event

  const options = {
    body: data.body,
    icon: data.icon || '/logo192.png',
    badge: data.badge || '/logo192.png',
    actions: [
      { action: 'view', title: 'View Details', icon: '/images/view-icon.png' },
      { action: 'dismiss', title: 'Dismiss', icon: '/images/dismiss-icon.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click event: ', event.action); // Log the action that was clicked
  event.notification.close(); // Close the notification

  if (event.action === 'view') {
    console.log('View action clicked'); // Log for 'view' action
    event.waitUntil(clients.openWindow('/notifications')); // Open the notifications page
  } else {
    console.log('Default action clicked'); // Log for any other default action
    event.waitUntil(clients.openWindow('/')); // Open the default page
  }
});
