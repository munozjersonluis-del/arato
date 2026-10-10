// Service worker de la app de palta (Arato). Primero la red: siempre la versión nueva.
// Solo usa lo guardado cuando no hay señal, y solo guarda páginas que respondieron bien.
// No toca las otras apps del sitio (material-solicitado, resumen, vales, pesos), que tienen su propio service worker.
const CACHE = 'cosecha-palta-v2';
const FILES = ['./arato-remanentes.html', './manifest.json'];
const AJENAS = /material-solicitado|resumen-|vale-traslado|registro-pesos|sw-|\.webmanifest$/;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // borra la caché vieja (la que guardaba páginas equivocadas)
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('cosecha-palta') && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;   // APIs y otros sitios van directo
  if (AJENAS.test(url.pathname)) return;                                 // las otras apps se manejan solas
  e.respondWith(
    fetch(req, { cache: 'no-store' }).then(r => {
      if (r.ok && r.type === 'basic') { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
      return r;
    }).catch(() => caches.match(req))
  );
});
