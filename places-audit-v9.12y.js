(()=>{
'use strict';
const VER='v9.12y';
const norm=s=>(s||'').replace(/^[^\p{L}\p{N}]+/u,'').replace(/[·⭐✓✔️]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const RESTAURANTS=[
 {name:'66tantan (Rokuroku Tantan)',city:'Kyoto',desc:'Tantanmen בגיון · 13/11 בשעה 13:45.',place:'66tantan'},
 {name:'Gyukatsu Motomura Shinjuku',city:'Tokyo',desc:'Gyukatsu בשינג׳וקו.',place:'Gyukatsu Motomura Shinjuku'},
 {name:'AFURI',city:'Tokyo',desc:'ראמן בסגנון Yuzu Shio.',place:'AFURI'},
 {name:'Katsukura Kyoto Porta',city:'Kyoto',desc:'Tonkatsu ליד Kyoto Station.',place:'Katsukura Kyoto Porta'},
 {name:'Mizuno Dotonbori',city:'Osaka',desc:'Okonomiyaki בדוטונבורי.',place:'Mizuno Dotonbori'},
 {name:'551 HORAI',city:'Osaka',desc:'Butaman ו-Shumai, עם סניפים רבים באזור Namba.',place:'551 HORAI'}
];
const restaurantRe=/66tantan|Rokuroku Tantan|Gyukatsu Motomura|Uobei|AFURI|Katsukura|Musashi Sushi|Mizuno|551\s*HORAI|Namba Ramen Ichiza/i;
const nonPlaceRe=/^(?:check[ -]?in|check[ -]?out|בוקר חופשי|בוקר רגוע|יום חופשי|זמן חופשי|קניות\s*[\/.+-]?\s*השלמות|השלמות|קניות|ארוחת בוקר|ארוחת צהריים|ארוחת ערב|מנוחה|התארגנות|איסוף מזוודות|שמירת מזוודות|שליחת מזוודות|נסיעה|מעבר|חזרה למלון|יציאה מהמלון|טיסה|קונקשן|נחיתה|המראה|רכבת|שינקנסן|אוטובוס|מונית|לינה)(?:\b|\s|$)/i;
const hotelRe=/hotel|מלון|JR Kyushu|Richmond|Royal Classic|Metropolitan|Cross Hotel|remm Tokyo/i;
function title(card){return (card.querySelector('h3')?.textContent||'').trim()}
function removeOldBadges(){document.querySelectorAll('.planned-badge-v912x,.restaurant-badge-v912x').forEach(x=>x.remove())}
function cleanCards(){
 const grid=document.querySelector('#placesGrid'); if(!grid)return null;
 removeOldBadges();
 const seen=new Set();
 [...grid.querySelectorAll('.place-card')].forEach(card=>{
   const raw=title(card), n=norm(raw); if(!n){card.remove();return}
   if(hotelRe.test(raw)||nonPlaceRe.test(raw)){card.remove();return}
   if(seen.has(n)){card.remove();return} seen.add(n);
   if(restaurantRe.test(raw)){card.dataset.cat='🍽️ מסעדות';card.dataset.type='restaurant'}
   // The itinerary date/time already communicates that an item is planned; do not add a redundant badge.
 });
 return grid;
}
function ensureRestaurants(grid){
 if(!grid)return;
 const existing=()=>new Set([...grid.querySelectorAll('.place-card')].map(c=>norm(title(c))));
 for(const r of RESTAURANTS){
   const ex=existing(); if([...ex].some(n=>n===norm(r.name)||n.includes(norm(r.name))||norm(r.name).includes(n)))continue;
   const c=document.createElement('div'); c.className='place-card'; c.dataset.city=r.city; c.dataset.cat='🍽️ מסעדות'; c.dataset.type='restaurant';
   c.innerHTML=`<h3>🍽️ ${r.name}</h3><p>${r.desc}</p><div class="stop-actions"><button type="button" class="guide-tips-btn info-modal-btn" data-place="${r.place}">ℹ️ מדריך וטיפים</button></div>`;
   grid.appendChild(c);
 }
}
function addRestaurantFilter(grid){
 if(!grid||document.getElementById('placesRestaurantFilterY'))return;
 const bar=document.createElement('div');bar.id='placesRestaurantFilterY';bar.style.cssText='display:flex;gap:8px;margin:8px 0 12px;overflow:auto';
 const all=document.createElement('button'),rest=document.createElement('button');
 [all,rest].forEach(b=>{b.type='button';b.style.cssText='border:1px solid #ddd;background:#fff;border-radius:999px;padding:7px 11px;font-weight:700;white-space:nowrap'});
 all.textContent='כל המקומות';rest.textContent='🍽️ מסעדות';
 all.onclick=()=>grid.querySelectorAll('.place-card').forEach(c=>c.style.display='');
 rest.onclick=()=>grid.querySelectorAll('.place-card').forEach(c=>c.style.display=(c.dataset.cat==='🍽️ מסעדות'||c.dataset.type==='restaurant')?'':'none');
 bar.append(all,rest);grid.before(bar);
}
function run(){const grid=cleanCards();ensureRestaurants(grid);addRestaurantFilter(grid)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,500),{once:true});else setTimeout(run,500);
setTimeout(run,1400);
})();