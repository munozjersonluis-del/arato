// App "Pesos": abre aunque no haya señal. Los registros se envían a la hoja cuando vuelve el internet.
const CACHE = 'pesos-v1';
const PAGE = 'registro-pesos-bandejas.html';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([PAGE, 'pesos.webmanifest', 'pesos-icon-192.png', 'pesos-icon-512.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n.startsWith('pesos-') && n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
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
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.hostname) || (url.origin === location.origin && /pesos/.test(url.pathname))) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })));
  }
});
