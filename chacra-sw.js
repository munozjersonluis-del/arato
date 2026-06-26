const CACHE='chacra-munoz-v1';
const ASSETS=[
  '/chacra-control.html',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;800;900&family=JetBrains+Mono:wght@700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  // Solo cachear assets estáticos, no Supabase
  if(e.request.url.includes('supabase.co')||e.request.url.includes('script.google.com'))return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached)return cached;
      return fetch(e.request).then(res=>{
        if(res&&res.status===200){
          const clone=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request,clone)).catch(()=>{});
        }
        return res;
      }).catch(()=>cached);
    })
  );
});
