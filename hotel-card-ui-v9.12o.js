// Japan Trip v9.12o - itinerary hotel cards: one Guide button; map lives inside popup
(function(){'use strict';
const VERSION='v9.12o';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const HOTELS=[
 {re:/JR Kyushu Hotel Blossom Shinjuku/i,name:'JR Kyushu Hotel Blossom Shinjuku'},
 {re:/Richmond Hotel Premier Kyoto Shijo/i,name:'Richmond Hotel Premier Kyoto Shijo'},
 {re:/Hotel Royal Classic Osaka/i,name:'Hotel Royal Classic Osaka'},
 {re:/Hotel Metropolitan Tokyo Marunouchi/i,name:'Hotel Metropolitan Tokyo Marunouchi'}
];
function fix(){
 $$('.day .stop-card').forEach(c=>{
   const text=c.textContent||''; const h=HOTELS.find(x=>x.re.test(text)); if(!h)return;
   // Hotel itinerary cards should behave exactly like place cards: no exposed map link.
   c.querySelectorAll('a.map-btn,a[href*="google.com/maps"],a[href*="maps.google"]').forEach(a=>a.remove());
   let actions=c.querySelector('.stop-actions');
   if(!actions){actions=document.createElement('div');actions.className='stop-actions';c.appendChild(actions)}
   const buttons=$$('.guide-tips-btn,.info-modal-btn,.place-info-btn',actions);
   let b=buttons[0];
   buttons.slice(1).forEach(x=>x.remove());
   if(!b){b=document.createElement('button');b.type='button';b.className='info-modal-btn guide-tips-btn';actions.appendChild(b)}
   b.classList.add('info-modal-btn','guide-tips-btn'); b.dataset.place=h.name; b.textContent='ℹ️ מדריך וטיפים';
 });
 setVersion();
}
function setVersion(){const v=$('header .logo .app-version')||$('header .logo small');if(v)v.textContent='2026 · '+VERSION;document.title='Japan Trip 2026 · '+VERSION;document.documentElement.dataset.appReady=VERSION}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(fix,450),{once:true});else setTimeout(fix,450);
setTimeout(fix,1300);setTimeout(setVersion,2200);
})();