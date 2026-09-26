// Service worker de "Vales de traslado": abre la app aunque la señal sea mala.
// Los datos (Supabase) siempre van por internet; aquí solo se guarda la app.
const CACHE = 'vales-v2';
const APP = ['vale-traslado.html', 'vales.webmanifest', 'vales-icon-192.png', 'vales-icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n.startsWith('vales-') && n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('supabase.co')) return; // datos: siempre en línea
  // La app: primero internet (para tener siempre la última versión), si no hay, la guardada
  // Solo atiende la app de vales; las demás páginas del sitio no se tocan
  if (req.mode === 'navigate' && !url.pathname.endsWith('vale-traslado.html')) return;
  if (!req.referrer.includes('vale-traslado') && !url.pathname.endsWith('vale-traslado.html') && !/vales/.test(url.pathname)) return;
  if (req.mode === 'navigate' || url.pathname.endsWith('vale-traslado.html')) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('vale-traslado.html', c)); return r; })
      .catch(() => caches.match('vale-traslado.html')));
    return;
  }
  // Librerías, fuentes e íconos: guardados, y se actualizan en segundo plano
  if (/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(url.hostname) || url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; }).catch(() => hit);
      return hit || net;
    }));
  }
});
