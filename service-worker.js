const CACHE='japan-trip-v9-12i-r2';
const PATCHES=['./enhancements-v9.11.js','./ramen-v9.12e.js','./stabilizer-v9.12i.js'];
const CORE=['./','./index.html','./manifest.json','./icon.svg','./styles.css','./app.js','./index.htm',...PATCHES];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of clients){try{const u=new URL(client.url);if(u.origin===self.location.origin&&!u.searchParams.has('v912i2')){u.searchParams.set('v912i2',Date.now().toString());await client.navigate(u.href)}}catch(e){}}})())});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;const url=new URL(event.request.url);
 if(url.origin===self.location.origin&&/\/app\.js$/.test(url.pathname)){event.respondWith(fetch(event.request,{cache:'no-store'}).then(async response=>{if(!response.ok)return response;const base=await response.text();const parts=[];for(const f of PATCHES){try{const r=await fetch(f+'?v=912i-r2',{cache:'no-store'});if(r.ok)parts.push(await r.text())}catch(e){}}return new Response(base+'\n\n'+parts.join('\n\n'),{status:200,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}})}).catch(()=>caches.match(event.request)));return}
 if(url.origin===self.location.origin){event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));return}
 event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});