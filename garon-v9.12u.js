(()=>{
'use strict';
const VER='v9.12u';
const TARGET_DATE='05/11';
function norm(s){return (s||'').replace(/\s+/g,' ').trim()}
function addGaron(){
  const days=[...document.querySelectorAll('.day')];
  let day=days.find(d=>/05\/11|5\/11/.test(norm(d.textContent)));
  if(!day) day=days.find(d=>/Shinjuku|שינג['׳]?וקו/i.test(norm(d.textContent)));
  if(!day||day.querySelector('[data-garon-v912u]')) return;
  const card=document.createElement('div');
  card.className='stop-card';
  card.dataset.garonV912u='1';
  card.innerHTML=`<div class="stop-time">14:00</div><div class="stop-main"><div class="stop-title">🍜 Menya Garon — ארוחת צהריים מאוחרת</div><div class="stop-desc">Tantanmen / ramen בשינג'וקו גולדן גאי. כ־7 דקות הליכה מהיציאה המזרחית של Shinjuku Station. חלון הצהריים הרשמי: 11:30–15:00.</div><div class="stop-tip">💡 להגיע סביב 14:00 כדי להשאיר מרווח לפני סגירת הצהריים. סגור בימי ראשון (פתוח בחגים).</div><button type="button" class="guide-btn" onclick="window.open('https://www.google.com/maps/search/?api=1&query=Menya+Garon+Shinjuku','_blank')">🗺️ פתח במפה</button></div>`;
  const stops=[...day.querySelectorAll('.stop-card')];
  let inserted=false;
  for(const s of stops){const m=norm(s.textContent).match(/\b(\d{1,2}):(\d{2})\b/);if(m&&(+m[1]>14||(+m[1]===14&&+m[2]>0))){s.before(card);inserted=true;break}}
  if(!inserted) day.appendChild(card);
}
function setVersion(){
  document.querySelectorAll('[id*=version],.version,.version-label').forEach(e=>{if(/v?9\.12|version|גרסה/i.test(e.textContent||''))e.textContent=VER});
}
setTimeout(()=>{addGaron();setVersion()},1200);
setTimeout(addGaron,2200);
})();