// App "Avance": la página abre aunque no haya señal; los datos siempre van en línea.
const CACHE = 'recepcion-v6';
const PAGE = 'recepcion-descarte.html';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([PAGE, 'recepcion.webmanifest', 'recepcion-icon-192.png', 'recepcion-icon-512.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n.startsWith('recepcion-') && n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.includes('script.google')) return; // la hoja siempre en línea
  if (req.mode === 'navigate' || url.pathname.endsWith(PAGE)) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(PAGE, c)); return r; }).catch(() => caches.match(PAGE)));
    return;
  }
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.hostname) || (url.origin === location.origin && /recepcion/.test(url.pathname))) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })));
  }
});
