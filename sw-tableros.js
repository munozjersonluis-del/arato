// App "Tableros": la página abre aunque no haya señal; los datos siempre van en línea.
const CACHE = 'tableros-v2';
const PAGE = 'tableros.html';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([PAGE, 'tableros.webmanifest', 'tableros-icon-192.png', 'tableros-icon-512.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n.startsWith('tableros-') && n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.includes('script.google')) return; // la hoja siempre en línea
  if (url.pathname.endsWith(PAGE)) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(PAGE, c)); return r; }).catch(() => caches.match(PAGE)));
    return;
  }
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.hostname) || (url.origin === location.origin && /tableros/.test(url.pathname))) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })));
  }
});
