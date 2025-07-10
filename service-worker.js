const CACHE_NAME = 'lanverse-v1.0.0';
const STATIC_CACHE = 'lanverse-static-v1.0.0';
const DYNAMIC_CACHE = 'lanverse-dynamic-v1.0.0';

// Files to cache immediately (only local files, no external URLs)
const STATIC_FILES = [
  '/',
  '/index.html',
  '/auth.html',
  '/home.html',
  '/events.html',
  '/profile.html',
  '/my_events.html',
  '/host.html',
  '/social.html',
  '/notifications.html',
  '/join.html',
  '/lobby.html',
  '/pwa-test.html',
  '/test-standalone.html',
  '/pwa-reinstall-guide.html',
  '/assets/css/lanverse.css',
  '/assets/css/join_wizard.css',
  '/assets/css/my_events.css',
  '/assets/css/profile.css',
  '/assets/css/social_stories.css',
  '/assets/css/social.css',
  '/assets/js/join_wizard.js',
  '/assets/js/my_events_slide.js',
  '/assets/js/profile.js',
  '/assets/js/social_stories_simple.js',
  '/assets/js/social_stories.js',
  '/assets/js/social.js',
  '/assets/js/pwa-install.js',
  '/assets/js/standalone-enforcer.js',
  '/manifest.json',
  '/assets/images/icon-72.png',
  '/assets/images/icon-96.png',
  '/assets/images/icon-128.png',
  '/assets/images/icon-144.png',
  '/assets/images/icon-152.png',
  '/assets/images/icon-192.png',
  '/assets/images/icon-384.png',
  '/assets/images/icon-512.png',
  '/assets/images/icon.svg'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        // Cache files one by one to avoid SSL issues
        return Promise.allSettled(
          STATIC_FILES.map(url => 
            cache.add(url).catch(error => {
              console.warn('Service Worker: Failed to cache', url, error);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error during install', error);
        // Continue even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service Worker: Error during activation', error);
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (like Google Fonts) to avoid SSL issues
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static files
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          console.log('Service Worker: Serving from cache', request.url);
          return response;
        }

        console.log('Service Worker: Fetching from network', request.url);
        return fetch(request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, responseToCache);
                console.log('Service Worker: Cached dynamic response', request.url);
              })
              .catch(error => {
                console.warn('Service Worker: Failed to cache dynamic response', error);
              });

            return response;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed', error);
            
            // Return offline page for HTML requests
            if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
              return caches.match('/auth.html');
            }
            
            return new Response('Network error', { status: 503 });
          });
      })
  );
});

// Handle API requests with network-first strategy
function handleApiRequest(request) {
  return fetch(request)
    .then(response => {
      // Cache successful API responses
      if (response && response.status === 200) {
        const responseToCache = response.clone();
        caches.open(DYNAMIC_CACHE)
          .then(cache => {
            cache.put(request, responseToCache);
          })
          .catch(error => {
            console.warn('Service Worker: Failed to cache API response', error);
          });
      }
      return response;
    })
    .catch(error => {
      console.error('Service Worker: API request failed', error);
      // Try to serve from cache as fallback
      return caches.match(request);
    });
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New party invitation!',
    icon: '/assets/images/icon-192.png',
    badge: '/assets/images/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Party',
        icon: '/assets/images/icon-72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/icon-72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('LANverse', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/home.html')
    );
  }
});

// Background sync function
function doBackgroundSync() {
  // Implement background sync logic here
  // For example, sync offline party joins, messages, etc.
  console.log('Service Worker: Performing background sync');
  return Promise.resolve();
}

// Message handling
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 