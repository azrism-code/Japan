// Japan Trip v9.14.1 — compact itinerary hotel cards; full details stay in Hotels
(()=>{'use strict';
const H=[
 {re:/JR Kyushu Hotel Blossom Shinjuku/i,name:'JR Kyushu Hotel Blossom Shinjuku',dates:'4–8 Nov',address:'2-6-2 Yoyogi, Shibuya-ku, Tokyo',arrival:'JR Shinjuku · South Exit · כ־3 דקות הליכה',meal:'כולל ארוחת בוקר'},
 {re:/Daiwa Roynet Hotel Kyoto Shijo Karasuma|Richmond Hotel Premier Kyoto Shijo/i,name:'Daiwa Roynet Hotel Kyoto Shijo Karasuma',dates:'10–14 Nov',address:'678 Omandokorocho, Karasumadori, Shimogyo-ku, Kyoto',arrival:'Kyoto Subway Shijo · Exit 5 · כ־1 דקה מהיציאה',meal:'ללא ארוחת בוקר'},
 {re:/Hotel Royal Classic Osaka|Cross Hotel Osaka/i,name:'Hotel Royal Classic Osaka',dates:'14–16 Nov',address:'4-3-3 Namba, Chuo-ku, Osaka',arrival:'Osaka Metro Namba · Exit 12 · מחובר למלון',meal:'כולל ארוחת בוקר'},
 {re:/Hotel Metropolitan Tokyo Marunouchi|remm Tokyo Kyobashi/i,name:'Hotel Metropolitan Tokyo Marunouchi',dates:'16–17 Nov',address:'Sapia Tower · 1-7-12 Marunouchi, Chiyoda-ku, Tokyo',arrival:'Tokyo Station · Nihombashi Exit · כ־1 דקה',meal:'ללא ארוחת בוקר'}
];
function openHotels(name){if(typeof window.openPage==='function')window.openPage('page-hotels');else document.querySelector('#page-hotels')?.classList.add('open');setTimeout(()=>{const c=[...document.querySelectorAll('#page-hotels .hotel-card')].find(x=>(x.textContent||'').includes(name));c?.scrollIntoView({behavior:'smooth',block:'center'})},120)}
function compact(){document.querySelectorAll('.day .stop-card').forEach(card=>{const h=H.find(x=>x.re.test(card.textContent||''));if(!h)return;card.querySelectorAll('.reservation-doc-actions,.hotel-booking-details,.hotel-map-actions').forEach(x=>x.remove());card.classList.add('hotel-route-compact');card.innerHTML=`<h3>🏨 ${h.name}</h3><p>📅 ${h.dates}<br>📍 ${h.address}<br>🚉 ${h.arrival}<br>🍽️ ${h.meal}</p><div class="stop-actions"><button type="button" class="hotel-full-details">🏨 פרטי המלון</button></div>`;card.querySelector('.hotel-full-details').onclick=()=>openHotels(h.name)})}
function style(){if(document.getElementById('hotelRouteCompactStyle'))return;const s=document.createElement('style');s.id='hotelRouteCompactStyle';s.textContent='.hotel-route-compact p{line-height:1.65}.hotel-full-details{border:0;border-radius:10px;padding:8px 11px;font-weight:700;background:#eef2f7;color:#1f2937}';document.head.appendChild(s)}
function run(){style();compact()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{setTimeout(run,1250);setTimeout(run,2200)},{once:true});else{setTimeout(run,1250);setTimeout(run,2200)}
window.addEventListener('japanTripDriveSynced',()=>setTimeout(run,180));
})();