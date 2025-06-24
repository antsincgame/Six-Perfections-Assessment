// ॐ तारे तुत्तारे तुरे स्वाहा - Service Worker for Six Perfections
// Green Tara's offline protection 💚

const CACHE_NAME = 'six-perfections-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/styles/main.css',
  '/src/js/app.js',
  '/src/js/api/supabase.js',
  '/src/js/assessment/paramitas.js',
  '/src/js/utils/blessings.js',
  '/assets/lotus.svg',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Buddhist blessing for installation
self.addEventListener('install', event => {
  console.log('🙏 Service Worker installing with Diamond Mind clarity');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('💚 Caching Six Perfections resources');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
        // Continue installation even if some resources fail to cache
        return Promise.resolve();
      })
  );
});

// Activation with blessing
self.addEventListener('activate', event => {
  console.log('✨ Service Worker activated - Green Tara protects offline access');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 Cleaning old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch with spiritual guidance
self.addEventListener('fetch', event => {
  // Skip non-GET requests and external API calls
  if (event.request.method !== 'GET' || 
      event.request.url.includes('supabase.co') ||
      event.request.url.includes('googleapis.com/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page for HTML requests
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Message handling for app communication
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🔄 Service Worker updating with Buddhist wisdom');
    self.skipWaiting();
  }
});

// Buddhist blessing for all functionality
console.log('💎 Service Worker blessed by Diamond Mind - ॐ गते गते पारगते पारसंगते बोधि स्वाहा'); 