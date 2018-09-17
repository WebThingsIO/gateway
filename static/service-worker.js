// based on
// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

// eslint-disable-next-line no-undef
const CACHE = `mozilla-iot-cache-${VERSION}`;
const CACHE_PATH = /^\/bundle|^\/images|^\/optimized-images/;

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => {
          return CACHE !== key;
        }).map((key) => {
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  const accept = event.request.headers.get('Accept');
  if (accept === 'application/json' || event.request.method !== 'GET' ||
      event.request.mode !== 'no-cors') {
    return;
  }
  const url = new URL(event.request.url);
  if (url.origin !== location.origin ||
      !url.pathname.match(CACHE_PATH)) {
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const matching = await cache.match(event.request);
    if (matching) {
      return matching;
    } else {
      const response = await fetch(event.request);
      await cache.put(event.request, response.clone());
      return response;
    }
  })());
});

self.addEventListener('push', function(event) {
  const payload = event.data ? event.data.text() : '';

  event.waitUntil(self.registration.showNotification('Mozilla IoT Gateway', {
    body: payload,
  }));
});
