// based on
// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

const CACHE = 'mozilla-iot-cache-0.0.1';

self.addEventListener('fetch', function(event) {
  const accept = event.request.headers.get('Accept');
  if (accept === 'application/json' || event.request.method !== 'GET' ||
      event.request.cache !== 'default' || event.request.mode !== 'no-cors') {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const matching = await cache.match(event.request);
    if (matching) {
      event.waitUntil((async () => {
        const response = await fetch(event.request);
        await cache.put(event.request, response.clone());
      })());
      return matching;
    } else {
      const response = await fetch(event.request);
      await cache.put(event.request, response.clone());
      return response;
    }
  })());
});
