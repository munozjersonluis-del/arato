const CACHE='arato-gps-v1';
const ASSETS=['/gps-operador.html','/apps.html'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(cached=>cached||fetch(e.request).catch(()=>cached))
  );
});

// Background sync — mantener GPS activo
self.addEventListener('sync',e=>{
  if(e.tag==='gps-sync'){
    e.waitUntil(syncGPS());
  }
});

async function syncGPS(){
  // Leer datos pendientes de IndexedDB y enviar a Supabase
  try{
    const db=await openDB();
    const pending=await getPending(db);
    for(const item of pending){
      await sendToSupabase(item);
      await deletePending(db,item.id);
    }
  }catch(e){console.warn('GPS sync error:',e);}
}

function openDB(){
  return new Promise((res,rej)=>{
    const req=indexedDB.open('arato-gps',1);
    req.onupgradeneeded=e=>{
      e.target.result.createObjectStore('pending',{keyPath:'id',autoIncrement:true});
    };
    req.onsuccess=e=>res(e.target.result);
    req.onerror=e=>rej(e);
  });
}

function getPending(db){
  return new Promise((res,rej)=>{
    const tx=db.transaction('pending','readonly');
    const req=tx.objectStore('pending').getAll();
    req.onsuccess=e=>res(e.target.result);
    req.onerror=e=>rej(e);
  });
}

function deletePending(db,id){
  return new Promise((res,rej)=>{
    const tx=db.transaction('pending','readwrite');
    const req=tx.objectStore('pending').delete(id);
    req.onsuccess=()=>res();
    req.onerror=e=>rej(e);
  });
}

async function sendToSupabase(data){
  const SURL='https://rqvcvffyynpnighzwxju.supabase.co';
  const SKEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdmN2ZmZ5eW5wbmlnaHp3eGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjgyNDcsImV4cCI6MjA5MzMwNDI0N30.fFufNEdRvAzl6O6BqtTbx83O3Eg8Wd7gACNJDGQKga4';
  await fetch(SURL+'/rest/v1/ubicaciones_maquinaria',{
    method:'POST',
    headers:{'apikey':SKEY,'Authorization':'Bearer '+SKEY,'Content-Type':'application/json','Prefer':'return=minimal'},
    body:JSON.stringify(data)
  });
}
