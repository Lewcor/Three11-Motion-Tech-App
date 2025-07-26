// THREE11 MOTION TECH - Service Worker
// Enables offline functionality and app-like behavior

const CACHE_NAME = 'three11-motion-tech-v2-2025-01-26';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/generator',
  '/content-creation',
  '/premium'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('THREE11 MOTION TECH: Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('THREE11 MOTION TECH: Deleting old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push Notification Support
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Generate Content',
        icon: '/icons/action-generate.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('THREE11 MOTION TECH', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/generator')
    );
  }
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      // Sync user's content when back online
      syncUserContent()
    );
  }
});

async function syncUserContent() {
  try {
    // Sync logic for offline content
    console.log('THREE11 MOTION TECH: Syncing user content...');
    // Implementation would sync cached content with server
  } catch (error) {
    console.error('THREE11 MOTION TECH: Sync failed', error);
  }
}