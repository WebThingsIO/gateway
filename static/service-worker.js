// based on
// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

const CACHE = 'mozilla-iot-cache-0.0.1';
const CACHE_PATH = /^\/bundle|^\/images|^\/optimized-images/;

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
