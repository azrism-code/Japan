const VERSION='v9.13.3';
const CACHE='japan-trip-v9-13-3';
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
        if(u.origin===self.location.origin&&!u.searchParams.has('v9133')){
          u.searchParams.set('v9133',Date.now().toString());
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
        const r=await fetch(file+'?v=9133',{cache:'no-store'});
        if(r.ok){
          let text=await r.text();
          text=text.replace(/v9\.13\.1/g,VERSION).replace(/v9\.13\.2/g,VERSION);
          moduleTexts.push(text);
        }
      }
      const finalizer=`\n;(function JapanTripFinalUi(){\n'use strict';\nconst V='${VERSION}';\nconst $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];\nconst clean=s=>String(s||'').replace(/\\s+/g,' ').trim();\nfunction version(){const v=$('header .logo .app-version')||$('header .logo small');if(v)v.textContent='2026 · '+V;document.title='Japan Trip 2026 · '+V;document.documentElement.dataset.appReady=V;}\nfunction osakaHotel(){const day=$('#day-11'),list=$('.list-view',day);if(!day||!list)return;let hotels=$$(':scope > .stop',list).filter(s=>/Hotel Royal Classic Osaka|Cross Hotel Osaka/i.test(s.textContent||''));hotels.slice(1).forEach(s=>s.remove());let hotel=hotels[0];if(!hotel){hotel=document.createElement('div');hotel.className='stop hotel-itinerary-stop';hotel.innerHTML='<div class="time">אחה״צ</div><div class="rail"><i>🏨</i></div><div class="stop-card"><h3>Check-in · Hotel Royal Classic Osaka</h3><p>הגעה מ-Nara, צ׳ק-אין והתארגנות. המלון מחובר ישירות ל-Osaka Metro Namba דרך Exit 12.</p><div class="stop-actions"><button class="info-modal-btn guide-tips-btn" data-place="Hotel Royal Classic Osaka" type="button">ℹ️ מדריך וטיפים</button></div></div>';const evening=$$(':scope > .stop',list).find(s=>/Hozenji Temple|Dotonbori · ערב ראשון|ארוחת ערב · Namba/i.test(s.textContent||''));if(evening)evening.before(hotel);else list.appendChild(hotel);}}\nfunction places(){const page=$('#page-places'),grid=$('#placesGrid');if(!page||!grid)return;const junk=/^(?:החזרת רכב|החזר(?:ת)? רכב|לקיחת רכב|קבלת רכב|איסוף רכב|המשך לפי מקום לינה|המשך לפי המלון|לפי מקום לינה|check[ -]?in|check[ -]?out)$/i;$$('.place-card',grid).forEach(card=>{const h=$('h3',card),title=clean(h?.textContent);if(junk.test(title)){card.remove();return;}$$('.place-card-meta,.place-meta,.place-category',card).forEach(el=>{let t=clean(el.textContent);if(!/במסלול/i.test(t))return;t=t.replace(/\\s*[·•-]?\\s*במסלול\\s*[:·]?\\s*.*$/i,'').trim();if(t)el.textContent=t;else el.remove();});const badges=$$('.scheduled-badge,.planned-badge,.route-badge',card).filter(el=>/במסלול/i.test(el.textContent||''));badges.slice(1).forEach(el=>el.remove());});const custom=$('#placesRestaurantFilter');if(custom)custom.remove();const seen=new Set();$$('button',page).forEach(b=>{const raw=clean(b.textContent).replace(/[🏨🍽️📍⛩️🛍️🌃⭐]/g,'').trim().toLowerCase();if(!raw)return;const key=raw==='hotel'||raw==='hotels'?'מלונות':raw;if(seen.has(key)&&(key==='מלונות'||key==='מסעדות'))b.remove();else seen.add(key);});}\nfunction run(){version();osakaHotel();places();}\nrun();setTimeout(run,300);setTimeout(run,1200);\n})();`;
      merged+='\n\n;(function __japanTripLoadConsolidated(){\n'+
        "if(document.documentElement.dataset.appReady==='"+VERSION+"'||document.documentElement.dataset.appReady==='error'){\n"+
        moduleTexts.join('\n\n')+finalizer+
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