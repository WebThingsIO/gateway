// based on
// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

// eslint-disable-next-line no-undef
const CACHE = `mozilla-iot-cache-${VERSION}`;

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

self.addEventListener('fetch', (event) => {
  const accept = event.request.headers.get('Accept');
  if (accept === 'application/json' || event.request.method !== 'GET' ||
      !['no-cors', 'navigate'].includes(event.request.mode)) {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== location.origin ||
      url.pathname.endsWith('.map') ||
      url.pathname.endsWith('floorplan.svg') ||
      url.pathname.startsWith('/internal-logs')) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const matching = await cache.match(event.request, {ignoreVary: true});
    if (matching) {
      return matching;
    }

    const response = await fetch(event.request);
    await cache.put(event.request, response.clone());
    return response;
  })());
});

self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.text() : '';

  event.waitUntil(
    self.registration.showNotification(
      'Mozilla WebThings Gateway',
      {body: payload}
    )
  );
});
