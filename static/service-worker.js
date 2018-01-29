// based on
// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

const CACHE = 'mozilla-iot-cache-0.0.1';

self.addEventListener('fetch', function(event) {
  let accept = event.request.headers.get('Accept');
  if (accept === 'application/json' || event.request.method !== 'GET' ||
      event.request.cache === 'no-cache') {
    return;
  }

  event.respondWith(fromCache(event.request));
  event.waitUntil(update(event.request));
});

function fromCache(request) {
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request);
  }).then(function(matching) {
    return matching || fetch(request);
  });
}

function update(request) {
  return caches.open(CACHE).then(function(cache) {
    return fetch(request).then(function(response) {
      return cache.put(request, response);
    });
  });
}
