// based on
// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

const CACHE = 'mozilla-iot-cache-0.0.1';

self.addEventListener('fetch', function(event) {
  let accept = event.request.headers.get('Accept');
  if (accept === 'application/json' || event.request.method !== 'GET' ||
      event.request.cache !== 'default' || event.request.mode !== 'no-cors') {
    return;
  }

  event.respondWith((async () => {
    let cache = await caches.open(CACHE);
    let matching = await cache.match(event.request);
    if (matching) {
      event.waitUntil((async () => {
        let response = await fetch(event.request);
        await cache.put(event.request, response.clone());
      })());
      return matching;
    } else {
      let response = await fetch(event.request);
      await cache.put(event.request, response.clone());
      return response;
    }
  })());
});
