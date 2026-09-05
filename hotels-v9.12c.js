// Japan Trip v9.12c - hotel cards normalization
(function(){
'use strict';
function normalizeHotelsPage(){
  const page=document.getElementById('page-hotels');
  if(!page)return;
  const cities=[...page.querySelectorAll('.hotel-city')];
  cities.forEach(city=>{
    const h=city.querySelector('h3');
    const title=(h?.textContent||'').trim();
    if(/Osaka/i.test(title)){
      city.innerHTML=`
        <h3>🏯 Osaka · 14–16 Nov 2026</h3>
        <div class="hotel-note">✅ <b>Hotel Royal Classic Osaka — הוזמן</b></div>
        <div class="hotel-card booked">
          <b>Hotel Royal Classic Osaka — הוזמן ✅</b>
          <p>📍 4-3-3 Namba, Chuo-ku, Osaka</p>
          <p>🛏️ Standard Queen · Non-Smoking · 2 Adults · 2 nights</p>
          <p>🍳 Breakfast + Wi-Fi included</p>
          <p>💴 ¥109,398 · Pay later</p>
          <p>🚉 Osaka Metro Namba · Exit 12 · מחובר ישירות למלון</p>
          <div class="hotel-map-actions"><a class="map-btn" href="https://www.google.com/maps/search/?api=1&query=Hotel+Royal+Classic+Osaka" rel="noopener" target="_blank">📍 פתח מפה ↗</a></div>
        </div>`;
    }
    if(/Tokyo/i.test(title)&&/16.?17/i.test(title)){
      city.innerHTML=`
        <h3>🗼 Tokyo · 16–17 Nov 2026</h3>
        <div class="hotel-note">✅ <b>Hotel Metropolitan Tokyo Marunouchi — הוזמן ושולם</b></div>
        <div class="hotel-card booked">
          <b>Hotel Metropolitan Tokyo Marunouchi — הוזמן ✅</b>
          <p>📍 Sapia Tower · 1-7-12 Marunouchi, Chiyoda-ku, Tokyo</p>
          <p>🛏️ UTSUROI (Renovated) · Queen · 18 m² · Non-Smoking · 2 Adults · 1 night</p>
          <p>💳 שולם ₪676.61</p>
          <p>🔖 Booking QXU287073</p>
          <p>🟢 ביטול חינם עד 15/11 21:59 שעון יפן</p>
          <p>🚄 Tokyo Station · Nihombashi Exit · Sapia Tower · כ־1 דק׳ מ-Shinkansen Nihombashi Gate</p>
          <div class="hotel-map-actions"><a class="map-btn" href="https://www.google.com/maps/search/?api=1&query=Hotel+Metropolitan+Tokyo+Marunouchi" rel="noopener" target="_blank">📍 פתח מפה ↗</a></div>
        </div>`;
    }
  });
  page.querySelectorAll('.hotel-decision').forEach(x=>x.remove());
}
function run(){normalizeHotelsPage()}
new MutationObserver(()=>setTimeout(run,80)).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();