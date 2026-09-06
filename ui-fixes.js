// Japan Trip v9.13.2 — focused UI normalization
(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();

function fixOsakaHotelRoute(){
  const day=$('#day-11'), list=$('.list-view',day);
  if(!day||!list)return;
  const hotels=$$(':scope > .stop',list).filter(s=>/Hotel Royal Classic Osaka|Cross Hotel Osaka/i.test(s.textContent||''));
  hotels.slice(1).forEach(s=>s.remove());
  let hotel=hotels[0];
  if(!hotel){
    hotel=document.createElement('div');
    hotel.className='stop hotel-itinerary-stop';
    hotel.innerHTML='<div class="time">אחה״צ</div><div class="rail"><i>🏨</i></div><div class="stop-card"><h3>Check-in · Hotel Royal Classic Osaka</h3><p>הגעה מ-Nara, צ׳ק-אין והתארגנות. המלון מחובר ישירות ל-Osaka Metro Namba דרך Exit 12.</p><div class="stop-actions"><button class="info-modal-btn guide-tips-btn" data-place="Hotel Royal Classic Osaka" type="button">ℹ️ מדריך וטיפים</button></div></div>';
    const evening=$$(':scope > .stop',list).find(s=>/Hozenji Temple|Dotonbori · ערב ראשון|ארוחת ערב · Namba/i.test(s.textContent||''));
    if(evening)evening.before(hotel); else list.appendChild(hotel);
  }
  const h=$('h3',hotel); if(h)h.textContent='Check-in · Hotel Royal Classic Osaka';
}

function fixPlaces(){
  const grid=$('#placesGrid'); if(!grid)return;
  const junk=/^(?:החזרת רכב|החזר(?:ת)? רכב|לקיחת רכב|קבלת רכב|איסוף רכב|המשך לפי מקום לינה|המשך לפי המלון|לפי מקום לינה|check[ -]?in|check[ -]?out)$/i;
  $$('.place-card',grid).forEach(card=>{
    const title=norm($('h3',card)?.textContent);
    if(junk.test(title)){card.remove();return;}
    // Keep the compact green route badge; remove the older brown duplicate line.
    const routeEls=$$('*',card).filter(el=>el.children.length===0&&/מתוכנן\s*במסלול|מתוכנן:\s*במסלול/i.test(norm(el.textContent)));
    routeEls.forEach(el=>el.remove());
    const badges=$$('.scheduled-badge,.planned-badge,.route-badge',card).filter(el=>/במסלול/i.test(el.textContent||''));
    badges.slice(1).forEach(el=>el.remove());
  });

  // Deduplicate category/filter controls such as the Hotels filter.
  const scopes=[grid.previousElementSibling,grid.parentElement].filter(Boolean);
  scopes.forEach(scope=>{
    const seen=new Set();
    $$('button',scope).forEach(b=>{
      const t=norm(b.textContent).replace(/[🏨🍽️📍⛩️🛍️🌃]/g,'').trim();
      if(!t)return;
      const key=t.toLowerCase();
      if(key==='מלונות'||key==='hotel'||key==='hotels'){
        if(seen.has('hotels'))b.remove(); else seen.add('hotels');
      }
    });
  });
}

function run(){fixOsakaHotelRoute();fixPlaces();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,350),{once:true});else setTimeout(run,350);
setTimeout(run,1300);
window.addEventListener('japanTripDriveSynced',()=>setTimeout(run,100));
window.JapanTripUiFixes={refresh:run};
})();