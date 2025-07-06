/**
 * LANverse Service Worker
 * Handles offline functionality, caching, and push notifications
 */

const CACHE_NAME = 'lanverse-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CACHE_FILES = [
    '/',
    '/index.html',
    '/create-event.html',
    '/join-event.html',
    '/event-lobby.html',
    '/profile.html',
    '/styles.css',
    '/js/app.js',
    '/js/events.js',
    '/js/storage.js',
    '/assets/logo.webp',
    '/manifest.json'
];

// Install event - cache initial files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => {
                console.log('Service Worker: Installed');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Handle navigation requests
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match('/') || caches.match('/index.html');
                })
        );
        return;
    }

    // Handle other requests with cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Cache the response for future use
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // If request is for an HTML page, return offline page
                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match(OFFLINE_URL);
                }
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            syncOfflineActions()
        );
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New event update!',
        icon: '/assets/logo.webp',
        badge: '/assets/logo.webp',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Event',
                icon: '/assets/logo.webp'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/logo.webp'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('LANverse', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification click received');
    
    event.notification.close();

    if (event.action === 'explore') {
        // Open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        event.notification.close();
    } else {
        // Default action - open app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.addAll(event.data.payload);
                })
        );
    }
});

/**
 * Sync offline actions when back online
 */
async function syncOfflineActions() {
    try {
        // Get offline actions from IndexedDB or localStorage
        const offlineActions = await getOfflineActions();
        
        for (const action of offlineActions) {
            try {
                await processOfflineAction(action);
                await removeOfflineAction(action.id);
            } catch (error) {
                console.error('Service Worker: Failed to sync action', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Sync failed', error);
    }
}

/**
 * Get offline actions from storage
 */
async function getOfflineActions() {
    // This would typically read from IndexedDB
    // For now, return empty array
    return [];
}

/**
 * Process individual offline action
 */
async function processOfflineAction(action) {
    switch (action.type) {
        case 'CREATE_EVENT':
            await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(action.data)
            });
            break;
        case 'JOIN_EVENT':
            await fetch(`/api/events/${action.data.eventId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(action.data)
            });
            break;
        case 'SEND_MESSAGE':
            await fetch(`/api/events/${action.data.eventId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(action.data)
            });
            break;
        default:
            console.warn('Unknown offline action type:', action.type);
    }
}

/**
 * Remove processed offline action
 */
async function removeOfflineAction(actionId) {
    // This would typically remove from IndexedDB
    console.log('Removing offline action:', actionId);
}

// Periodic background sync for updates
self.addEventListener('periodicsync', (event) => {
    console.log('Service Worker: Periodic sync', event.tag);
    
    if (event.tag === 'update-events') {
        event.waitUntil(
            updateEventsCache()
        );
    }
});

/**
 * Update events cache with fresh data
 */
async function updateEventsCache() {
    try {
        const response = await fetch('/api/events');
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put('/api/events', response);
        }
    } catch (error) {
        console.error('Service Worker: Failed to update events cache', error);
    }
}

console.log('Service Worker: Loaded');