const CACHE='japan-trip-v9-6-hotfix1';
const CORE=['./','./index.html','./manifest.json','./icon.svg','./styles.css'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.pathname.endsWith('/app.js')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{
      let txt=await r.text();
      txt=txt.replace(/function toggleDetail\(b\)[\s\S]*?document\.addEventListener\('DOMContentLoaded',loadTake\);\s*(?=const PLACE_DATA=)/,'');
      return new Response(txt,{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}});
    }));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
