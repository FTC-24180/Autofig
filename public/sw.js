// Import version from external file for easier management
import { VERSION } from './version.js';

const CACHE_NAME = `ftc-autoconfig-v${VERSION}`;
const RUNTIME_CACHE = `ftc-autoconfig-runtime-v${VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.svg',
  '/vite.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing version ${VERSION}`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting - activate immediately');
        return self.skipWaiting();
      })
  );
});

// Activate event - cleanup old caches and notify clients
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating version ${VERSION}`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Delete old caches
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    }).then(() => {
      // Notify all clients about the update
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: VERSION
          });
        });
      });
    })
  );
});

// Fetch event - Network-first strategy for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  const url = new URL(event.request.url);

  // Network-first for HTML and API requests
  if (url.pathname === '/' || url.pathname.endsWith('.html') || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Update cache with fresh response
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Cache-first for static assets (JS, CSS, images, fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Update cache in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {}); // Silently fail
        
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((error) => {
        console.error('[SW] Fetch failed:', error);
        return caches.match('/index.html');
      });
    })
  );
});

// Message handler - respond to client requests
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: VERSION });
  }
});

// Background sync for future use
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(
      Promise.resolve() // Future: sync data when back online
    );
  }
});

// Push notification support (for future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icon-512.svg',
    badge: '/icon-512.svg',
    vibrate: [200, 100, 200],
    tag: 'ftc-autoconfig-update'
  };

  event.waitUntil(
    self.registration.showNotification('FTC AutoConfig', options)
  );
});
