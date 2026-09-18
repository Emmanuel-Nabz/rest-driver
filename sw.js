// ============================================================
// SERVICE WORKER — Nabz-Tech Driver
// Handles push notifications + basic passthrough caching
// ============================================================

self.addEventListener('install', function(e) {
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    self.clients.claim();
});

// ============================================================
// PUSH — receive and show notification
// ============================================================
self.addEventListener('push', function(event) {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        data = { title: 'Nabz-Tech Driver', body: event.data ? event.data.text() : 'New update' };
    }

    const title = data.title || 'Nabz-Tech Driver';
    const options = {
        body: data.body || '',
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        vibrate: [200, 100, 200, 100, 200],
        tag: 'nabz-order',
        renotify: true,
        requireInteraction: true,
        data: data.data || {},
        actions: [
            { action: 'open', title: 'Open App' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// ============================================================
// NOTIFICATION CLICK — focus or open the driver app
// ============================================================
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // If a driver app tab is already open, focus it
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.indexOf(self.location.origin) !== -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new one
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// ============================================================
// FETCH — passthrough (no offline cache for now)
// ============================================================
self.addEventListener('fetch', function(e) {
    // Let the network handle everything
});