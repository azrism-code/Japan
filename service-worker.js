const VERSION='v9.13.0';
const CACHE='japan-trip-v9-13-0';
const MODULES=['./data.js','./drive.js'];
const CORE=['./','./index.html','./manifest.json','./icon.svg','./styles.css','./app.js','./index.htm',...MODULES];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
    const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of clients){
      try{
        const u=new URL(client.url);
        if(u.origin===self.location.origin&&!u.searchParams.has('v9130')){
          u.searchParams.set('v9130',Date.now().toString());
          await client.navigate(u.href);
        }
      }catch(e){}
    }
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);

  // Build one runtime bundle from the main app + two maintained modules.
  // Historical patch files are no longer loaded.
  if(url.origin===self.location.origin&&/\/app\.js$/.test(url.pathname)){
    event.respondWith((async()=>{
      const baseResponse=await fetch(event.request,{cache:'no-store'});
      if(!baseResponse.ok)return baseResponse;
      let merged=await baseResponse.text();
      // The old app.js loader still contains its historical label; normalize it during the build.
      merged=merged.replace(/v9\.10/g,VERSION).replace(/Japan Trip 2026 · v9\.10/g,'Japan Trip 2026 · '+VERSION);
      for(const file of MODULES){
        const r=await fetch(file+'?v=9130',{cache:'no-store'});
        if(r.ok)merged+='\n\n'+await r.text();
      }
      return new Response(merged,{status:200,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}});
    })().catch(()=>caches.match(event.request)));
    return;
  }

  // Keep the initially rendered shell on the same version/title too, so the label does not visibly race on startup.
  if(url.origin===self.location.origin&&(/\/index\.html$/.test(url.pathname)||url.pathname.endsWith('/Japan/')||url.pathname.endsWith('/Japan'))){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(async response=>{
      if(!response.ok)return response;
      let html=await response.text();
      html=html.replace(/v9\.5/g,VERSION).replace(/v9\.6/g,VERSION).replace(/>יוצאים לדרך ✈️</g,'>עזרי ואיילי יוצאים לדרך ✈️<');
      return new Response(html,{status:response.status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
    }).catch(()=>caches.match('./index.html')));
    return;
  }

  if(url.origin===self.location.origin){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{
      if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
      return response;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});