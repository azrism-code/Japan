const CACHE='japan-trip-v9-12';
const CORE=['./','./index.html','./manifest.json','./icon.svg','./styles.css','./app.js','./index.htm','./enhancements-v9.11.js','./walking-v9.12.js'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin===self.location.origin && /\/app\.js$/.test(url.pathname)){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(async response=>{
      if(!response.ok)return response;
      const base=await response.text();
      let extra='';let walking='';
      try{const er=await fetch('./enhancements-v9.11.js',{cache:'no-store'});if(er.ok)extra=await er.text();}catch(e){}
      try{const wr=await fetch('./walking-v9.12.js',{cache:'no-store'});if(wr.ok)walking=await wr.text();}catch(e){}
      return new Response(base+'\n\n'+extra+'\n\n'+walking,{status:200,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}});
    }).catch(()=>caches.match(event.request)));
    return;
  }
  if(url.origin===self.location.origin && /\/(index\.html|styles\.css|index\.htm|enhancements-v9\.11\.js|walking-v9\.12\.js)$/.test(url.pathname)){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{
      if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
      return response;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  })));
});
