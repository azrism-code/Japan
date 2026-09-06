const VERSION='v9.13.2';
const CACHE='japan-trip-v9-13-2';
const MODULES=['./data.js','./drive.js','./ui-fixes.js'];
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
        if(u.origin===self.location.origin&&!u.searchParams.has('v9132')){
          u.searchParams.set('v9132',Date.now().toString());
          await client.navigate(u.href);
        }
      }catch(e){}
    }
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);

  if(url.origin===self.location.origin&&/\/app\.js$/.test(url.pathname)){
    event.respondWith((async()=>{
      const baseResponse=await fetch(event.request,{cache:'no-store'});
      if(!baseResponse.ok)return baseResponse;
      let merged=await baseResponse.text();
      merged=merged.replace(/v9\.10/g,VERSION).replace(/Japan Trip 2026 · v9\.10/g,'Japan Trip 2026 · '+VERSION);
      const moduleTexts=[];
      for(const file of MODULES){
        const r=await fetch(file+'?v=9132',{cache:'no-store'});
        if(r.ok)moduleTexts.push(await r.text());
      }
      merged+='\n\n;(function __japanTripLoadConsolidated(){\n'+
        "if(document.documentElement.dataset.appReady==='"+VERSION+"'||document.documentElement.dataset.appReady==='error'){\n"+
        moduleTexts.join('\n\n')+
        '\nreturn;}\nsetTimeout(__japanTripLoadConsolidated,50);\n})();';
      return new Response(merged,{status:200,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}});
    })().catch(()=>caches.match(event.request)));
    return;
  }

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