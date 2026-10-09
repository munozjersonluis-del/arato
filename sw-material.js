// Service worker de "Bandejas por punto": permite instalarla como app y abrirla sin señal.
// Solo atiende su propia página; los envíos a la hoja (script.google.com) nunca se guardan en caché.
const CACHE = 'material-v2';
const PAGINA = 'material-solicitado.html';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([PAGINA, 'material-icon-192.png', 'material-icon-512.png', 'material.webmanifest'])).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('material-') && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;            // la hoja y las fuentes van directo
  if (req.mode === 'navigate' && !url.pathname.endsWith(PAGINA)) return;           // otras páginas del sitio, no
  // primero la red (siempre la versión nueva); si no hay señal, lo guardado
  e.respondWith(fetch(req, { cache: 'no-store' }).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; })
    .catch(() => caches.match(req).then(h => h || caches.match(PAGINA))));
});
