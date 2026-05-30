const CACHE = 'arato-v2';
const ASSETS = [
  '/arato/',
  '/arato/index.html'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS).catch(function(){});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Solo cachear GET requests
  if (e.request.method !== 'GET') return;
  // No cachear Supabase API
  if (e.request.url.includes('supabase.co')) return;

  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // Guardar en cache si es exitoso
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      })
      .catch(function() {
        // Sin internet: usar cache
        return caches.match(e.request).then(function(cached) {
          return cached || new Response('Sin conexión', {status: 503});
        });
      })
  );
});
