(()=>{
'use strict';
const VER='v9.12x';
const norm=s=>(s||'').replace(/^[^\p{L}\p{N}]+/u,'').replace(/check-?in/ig,'').replace(/[·⭐✓✔️]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const restaurantRe=/Gyukatsu Motomura|Uobei|AFURI|Afuri|Katsukura|Musashi Sushi|Mizuno|551\s*Horai|Namba Ramen Ichiza|66tantan|Rokuroku Tantan/i;
function itineraryNames(){
 const set=new Set();
 document.querySelectorAll('.day .stop-card h3').forEach(h=>{const n=norm(h.textContent);if(n)set.add(n)});
 return set;
}
function addBadge(card,text,cls){
 if(card.querySelector('.'+cls))return;
 const b=document.createElement('span');b.className=cls;b.textContent=text;b.style.cssText='display:inline-block;margin:6px 0 0 6px;padding:3px 8px;border-radius:999px;background:#eef7ee;font-size:11px;font-weight:700;color:#245b2a';
 const h=card.querySelector('h3');if(h)h.insertAdjacentElement('afterend',b);else card.prepend(b);
}
function cleanup(){
 const grid=document.querySelector('#placesGrid');if(!grid)return;
 const planned=itineraryNames(), seen=new Map();
 [...grid.querySelectorAll('.place-card')].forEach(card=>{
   const h=card.querySelector('h3');if(!h)return;
   const raw=(h.textContent||'').trim(), n=norm(raw);
   // Places is for visitable destinations/food only, not operational booking steps.
   if(/\bcheck-?in\b/i.test(raw)||/^check\s*in/i.test(raw)){card.remove();return}
   // Hotels belong in Hotels, not Places.
   if(/JR Kyushu Hotel|Richmond Hotel|Hotel Royal Classic|Hotel Metropolitan|Cross Hotel|remm Tokyo/i.test(raw)){card.remove();return}
   if(seen.has(n)){card.remove();return} seen.set(n,card);
   const isRestaurant=restaurantRe.test(raw);
   if(isRestaurant){card.dataset.cat='🍽️ מסעדות';addBadge(card,'🍽️ מסעדה','restaurant-badge-v912x')}
   // Match exact normalized name or a meaningful containment alias.
   const isPlanned=[...planned].some(p=>p===n||(n.length>5&&p.includes(n))||(p.length>5&&n.includes(p)));
   if(isPlanned)addBadge(card,'✓ כבר במסלול','planned-badge-v912x');
 });
 // Make sure 66tantan is represented in Places after adding it to the itinerary.
 if(![...grid.querySelectorAll('.place-card h3')].some(h=>/66tantan|Rokuroku Tantan/i.test(h.textContent||''))){
   const c=document.createElement('div');c.className='place-card';c.dataset.city='Kyoto';c.dataset.cat='🍽️ מסעדות';
   c.innerHTML='<h3>🍜 66tantan (Rokuroku Tantan)</h3><p>מסעדת Tantanmen בגיון · מתוכננת ל-13/11 בשעה 13:45.</p><div class="stop-actions"><button type="button" class="guide-tips-btn info-modal-btn" data-place="66tantan">ℹ️ מדריך וטיפים</button></div>';
   grid.appendChild(c);addBadge(c,'🍽️ מסעדה','restaurant-badge-v912x');addBadge(c,'✓ כבר במסלול','planned-badge-v912x');
 }
 // If restaurant filter buttons are generated from cards by old code, refresh common label/button if missing.
 const filterHost=document.querySelector('#page-places .place-filters,#page-places .filters,#placesFilters');
 if(filterHost&&!filterHost.querySelector('[data-cat="🍽️ מסעדות"],button[value="🍽️ מסעדות"]')){
   const b=document.createElement('button');b.type='button';b.textContent='🍽️ מסעדות';b.dataset.cat='🍽️ מסעדות';
   b.onclick=()=>{grid.querySelectorAll('.place-card').forEach(c=>c.style.display=c.dataset.cat==='🍽️ מסעדות'?'':'none')};filterHost.appendChild(b);
 }
}
function setVersion(){document.querySelectorAll('header .logo small,.version,.version-label,[id*=version]').forEach(e=>{if(/9\.12|2026/.test(e.textContent||''))e.textContent='2026 · '+VER});document.title='Japan Trip 2026 · '+VER;document.documentElement.dataset.appReady=VER}
setTimeout(()=>{cleanup();setVersion()},1300);setTimeout(cleanup,2300);
})();