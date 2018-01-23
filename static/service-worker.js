// based on
// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

const CACHE = 'mozilla-iot-cache-0.0.1';

self.addEventListener('fetch', function(event) {
  let accept = event.request.headers.get('Accept');
  if (accept === 'application/json' || event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  let cache = fromCache(event.request);
  cache.then(function(cached) {
    let resFetch = null;
    if (cached && event.request.cache !== 'no-cache') {
      event.respondWith(cached);
    } else {
      resFetch = fetch(event.request);
      event.respondWith(resFetch);
    }
    update(event.request, resFetch);
  });
});

function fromCache(request) {
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request);
  }).then(function(matching) {
    return matching;
  });
}

function update(request, inProgressFetch) {
  return caches.open(CACHE).then(function(cache) {
    if (!inProgressFetch) {
      inProgressFetch = fetch(request);
    }
    return inProgressFetch.then(function(response) {
      return cache.put(request, response);
    });
  });
}
