self.addEventListener('push', function(event) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: data.icon || '/logo192.png',
      badge: data.badge || '/logo192.png',
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  