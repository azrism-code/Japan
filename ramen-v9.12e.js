// Japan Trip v9.12e - Namba Ramen Ichiza guide + Places restaurant listing
(function(){'use strict';
const NAME='Namba Ramen Ichiza';
const MAP='https://www.google.com/maps/search/?api=1&query=Namba+Ramen+Ichiza+Osaka';
function guide(){
  const day=document.getElementById('day-12'); if(!day)return;
  const card=[...day.querySelectorAll('.stop-card')].find(x=>(x.textContent||'').includes(NAME)); if(!card)return;
  let p=card.querySelector('p'); if(p)p.textContent='מתחם ראמן מיוחד בקומה 9 של EDION Namba: תשע מסעדות ראמן נבחרות מאזורים שונים ביפן במקום אחד. מתאים במיוחד לערב שלנו ב-Namba / Dotonbori — פשוט מגיעים ובוחרים את הסגנון שמתחשק.';
  if(!card.querySelector('.ramen-details')){const d=document.createElement('div');d.className='ramen-details';d.innerHTML='<b>🍜 למה כדאי</b><br>אפשר לבחור בין סגנונות שונים — כולל tonkotsu, tsukemen וראמן אזורי — בלי להתחייב למסעדה אחת מראש.<br><br><b>🕚 שעות</b> 11:00–22:00 · הזמנה אחרונה 21:30<br><b>📍 מיקום</b> EDION Namba Main Store · קומה 9 · כ־2 דקות מ-Osaka Metro Namba<br><b>🎟️ הזמנה</b> אין הזמנת מקומות מראש; מגיעים ישירות.';card.appendChild(d)}
  if(!card.querySelector('.ramen-map')){const a=document.createElement('a');a.className='map-btn ramen-map';a.href=MAP;a.target='_blank';a.rel='noopener';a.textContent='📍 פתח מפה ↗';card.appendChild(a)}
}
function places(){
 const grid=document.getElementById('placesGrid');if(!grid||grid.querySelector('[data-ramen-ichiza-place]'))return;
 const a=document.createElement('article');a.className='place-card';a.dataset.ramenIchizaPlace='1';a.dataset.cat='🍽️ מסעדות';a.dataset.city='Osaka';a.dataset.scheduled='1';
 a.innerHTML='<div class="place-title"><span>🍜</span><h3>Namba Ramen Ichiza</h3></div><div class="place-location">Osaka · Namba · EDION Namba 9F</div><div class="scheduled-badge">15/11 · אופציה לארוחה</div><p>מתחם ראמן עם 9 מסעדות נבחרות מרחבי יפן בקומה אחת. בחירה טובה כשאנחנו כבר באזור Namba / Dotonbori.</p><div class="place-card-tip">💡 11:00–22:00 · הזמנה אחרונה 21:30 · אין צורך/אפשרות להזמין מקום מראש.</div><div class="place-actions"><a class="map-btn" href="'+MAP+'" target="_blank" rel="noopener">📍 פתח מפה ↗</a></div>';
 grid.appendChild(a);
}
function version(){const v=document.querySelector('header .logo small');if(v)v.textContent='2026 · v9.12e'}
function run(){guide();places();version()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0));else setTimeout(run,0);
})();