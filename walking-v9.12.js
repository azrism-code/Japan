// Japan Trip v9.12 - prefer walking for sensible 20-25 minute hops
(function(){
'use strict';
const WALK_PAIRS=[
 ['Kaminarimon','Nakamise'],['Nakamise','Sensoji'],['Nakamise','Sensō-ji'],
 ['Ueno','Ameyoko'],['Ameyoko','Akihabara'],['Ueno','Akihabara'],
 ['Meiji Jingu','Takeshita'],['Takeshita','Omotesando'],['Omotesando','Shibuya'],
 ['Tsukiji','Ginza'],['Ginza','Imperial Palace'],['Imperial Palace','Tokyo Station'],
 ['Kiyomizu','Higashiyama'],['Higashiyama','Gion'],['Gion','Pontocho'],
 ['Nara Park','Todai'],['Nara Park','Tōdai'],['Todai','Naramachi'],['Tōdai','Naramachi'],
 ['Shinsaibashi','Dotonbori']
];
function norm(s){return (s||'').toLowerCase().replace(/[ōō]/g,'o').replace(/[^a-z0-9\u0590-\u05ff]+/g,' ').trim();}
function hit(a,b){a=norm(a);b=norm(b);return WALK_PAIRS.some(([x,y])=>{x=norm(x);y=norm(y);return (a.includes(x)&&b.includes(y))||(a.includes(y)&&b.includes(x));});}
function decorate(){
 document.querySelectorAll('.route-map-card').forEach(card=>{
   if(card.querySelector('.walk-pref-v912'))return;
   const stops=[...card.querySelectorAll('ol li')].map(x=>x.textContent.trim()).filter(Boolean);
   const walks=[];
   for(let i=0;i<stops.length-1;i++)if(hit(stops[i],stops[i+1]))walks.push(stops[i]+' → '+stops[i+1]);
   if(!walks.length)return;
   const box=document.createElement('div');box.className='walk-pref-v912';
   box.innerHTML='<b>🚶 עדיפות להליכה</b><span>'+walks.join(' · ')+'</span><small>במעברים של עד כ־20–25 דקות נעדיף ללכת. מטרו/רכבת נשארים חלופה לעייפות או מזג אוויר.</small>';
   const anchor=card.querySelector('.osm-choice')||card.querySelector('.open-day-route');
   if(anchor)anchor.before(box);else card.appendChild(box);
 });
 addRamenIchiza();
 const v=document.querySelector('header .logo small');if(v)v.textContent='2026 · v9.12';
 document.title='Japan Trip 2026 · v9.12';document.documentElement.dataset.appReady='v9.12';
}
function addRamenIchiza(){
 const day=document.getElementById('day-12');if(!day||day.querySelector('[data-ramen-ichiza]'))return;
 const list=day.querySelector('.list-view');if(!list)return;
 const stop=document.createElement('div');stop.className='stop';stop.dataset.ramenIchiza='1';
 stop.innerHTML='<div class="time">אופציה</div><div class="rail"><i>🍜</i></div><div class="stop-card"><h3>Ramen Ichiza · Namba</h3><p>אופציה לארוחה כשאנחנו באזור Namba / Dotonbori. מתחם ראמן בקומה 9 של EDION Namba עם כמה חנויות ראמן במקום אחד.</p><div class="stop-actions"><a class="map-btn" href="https://www.google.com/maps/search/?api=1&query=Namba+Ramen+Ichiza+EDION+Namba+Osaka" rel="noopener" target="_blank">📍 פתח מפה ↗</a></div></div>';
 list.appendChild(stop);
}
function css(){if(document.getElementById('walk-v912-css'))return;const s=document.createElement('style');s.id='walk-v912-css';s.textContent='.walk-pref-v912{margin:9px 0;padding:10px 11px;border-radius:12px;background:#f4f8f2;border:1px solid #dce9d7;font-size:11px}.walk-pref-v912 b{display:block;font-size:12px;margin-bottom:4px}.walk-pref-v912 span{display:block;line-height:1.55}.walk-pref-v912 small{display:block;color:#667064;margin-top:5px;line-height:1.45}';document.head.appendChild(s);}
function run(){css();decorate();}
const mo=new MutationObserver(()=>setTimeout(run,40));mo.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
