(()=>{
'use strict';
const VER='v9.12v';
function norm(s){return (s||'').replace(/\s+/g,' ').trim()}
function removeGaron(){document.querySelectorAll('[data-garon-v912u]').forEach(e=>e.remove())}
function add66(){
  const days=[...document.querySelectorAll('.day')];
  // 13/11 is Friday and keeps 66tantan naturally in the Gion/Kyoto part of the trip.
  let day=days.find(d=>/13\/11|13\.11/.test(norm(d.textContent)));
  if(!day) day=days.find(d=>/Gion|גיון|Kyoto|קיוטו/i.test(norm(d.textContent)));
  if(!day||day.querySelector('[data-tantan66-v912v]')) return;
  const card=document.createElement('div');
  card.className='stop-card';
  card.dataset.tantan66V912v='1';
  card.innerHTML=`<div class="stop-time">13:45</div><div class="stop-main"><div class="stop-title">🍜 66tantan (Rokuroku Tantan) — ארוחת צהריים</div><div class="stop-desc">Tantanmen קטן ומיוחד בגיון. כתובת: 286-6 Gionmachi Kitagawa, Higashiyama, Kyoto. כ־450 מ׳ מתחנת Gion-Shijo.</div><div class="stop-tip">💡 ביום שישי חלון הצהריים 11:30–14:30; להגיע סביב 13:45 ולא לדחות לסוף החלון. המסעדה קטנה מאוד.</div><button type="button" class="guide-btn" onclick="window.open('https://www.google.com/maps/search/?api=1&query=66tantan+Rokuroku+Tantan+Kyoto','_blank')">🗺️ פתח במפה</button></div>`;
  const stops=[...day.querySelectorAll('.stop-card')];
  let inserted=false;
  for(const s of stops){const m=norm(s.textContent).match(/\b(\d{1,2}):(\d{2})\b/);if(m&&(+m[1]>13||(+m[1]===13&&+m[2]>45))){s.before(card);inserted=true;break}}
  if(!inserted) day.appendChild(card);
}
function setVersion(){document.querySelectorAll('[id*=version],.version,.version-label').forEach(e=>{if(/v?9\.12|version|גרסה/i.test(e.textContent||''))e.textContent=VER})}
setTimeout(()=>{removeGaron();add66();setVersion()},1200);
setTimeout(()=>{removeGaron();add66()},2200);
})();