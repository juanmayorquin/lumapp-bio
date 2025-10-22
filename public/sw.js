/* Simple Service Worker for LumApp
   - Listens for `push` events and displays notifications.
   - Requires a server to send push messages (VAPID, web-push) to be useful.
*/

self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'LumApp', body: event.data ? event.data.text() : 'Tienes una nueva notificación.' };
  }

  const title = data.title || 'LumApp';
  const options = {
    body: data.body || 'Tienes una nueva notificación.',
    icon: data.icon || '/favicon.ico',
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
