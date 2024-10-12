/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// Your service worker code
self.addEventListener('push', (event) => {
  console.log('Push event received:', event); // Log for debugging
  const data = event.data ? event.data.json() : { title: 'New Notification', body: 'No content' };

  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.openWindow(url) // Open the associated URL in the client
  );
});
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        subscribeUserToPush(registration);
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    });
  }
}

async function subscribeUserToPush(registration) {
  try {
    const response = await fetch('YOUR_VAPID_PUBLIC_KEY'); // Fetch your VAPID public key from the server or define it here
    const vapidPublicKey = await response.text();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // Send subscription to your server to save it
    await sendSubscriptionToServer(subscription);

    console.log('User is subscribed:', subscription);
  } catch (error) {
    console.error('Failed to subscribe the user: ', error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...Array(rawData.length)].map((_, i) => rawData.charCodeAt(i)));
}

async function sendSubscriptionToServer(subscription) {
  // Replace this URL with your API endpoint to save the subscription
  await fetch('https://yourserver.com/api/save-subscription', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
