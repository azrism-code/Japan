// Japan Trip v9.14.0 — structured hotel booking details
(()=>{'use strict';
const RATE=0.0196773; // JPY→ILS snapshot 10/09/2026
const H=[
 {match:'JR Kyushu Hotel Blossom Shinjuku',provider:'Agoda',booking:'696266027',ref:'6870831053',dates:'4–8 Nov 2026',room:'Standard Double Room with Queen Bed · Non-Smoking',size:'19 m²',bed:'Queen · 160×200 cm',meal:'🍳 כולל ארוחת בוקר',jpy:311616,ils:Math.round(311616*RATE),pay:'תשלום מאוחר'},
 {match:'Daiwa Roynet Hotel Kyoto Shijo Karasuma',provider:'Agoda',booking:'2048972834',ref:'—',dates:'10–14 Nov 2026',room:'Moderate Double Room · Newly Renovated · Non-Smoking',size:'21.1 m²',bed:'Double רחבה · 168×203 cm',meal:'☕ ללא ארוחת בוקר · Wi-Fi + קפה/תה',jpy:116856,ils:Math.round(116856*RATE),pay:'תשלום מאוחר'},
 {match:'Hotel Royal Classic Osaka',provider:'Agoda',booking:'693085383',ref:'GHT261114349164',dates:'14–16 Nov 2026',room:'Standard Queen Room · Non-Smoking',size:'25.6–31 m²',bed:'מיטה זוגית אחת',meal:'🍳 כולל ארוחת בוקר + Wi-Fi',jpy:109398,ils:Math.round(109398*RATE),pay:'תשלום מאוחר'},
 {match:'Hotel Metropolitan Tokyo Marunouchi',provider:'Klook',booking:'QXU287073',ref:'—',dates:'16–17 Nov 2026',room:'UTSUROI (Renovated) · Queen · Non-Smoking',size:'18 m²',bed:'Queen',meal:'☕ ללא ארוחת בוקר',jpy:Math.round(676.61/RATE),ils:677,pay:'שולם'}
];
const money=n=>new Intl.NumberFormat('en-US').format(n);
function docActions(card){return card.querySelector('.reservation-doc-actions,.booking-doc-actions,.doc-actions')}
function render(){
 const page=document.querySelector('#page-hotels');if(!page)return;
 H.forEach(h=>{
  const card=[...page.querySelectorAll('.hotel-card')].find(c=>(c.textContent||'').includes(h.match));if(!card)return;
  const actions=docActions(card);if(actions)actions.remove();
  const map=card.querySelector('.hotel-map-actions');if(map)map.remove();
  card.querySelectorAll('p,.hotel-booking-details').forEach(x=>x.remove());
  let title=card.querySelector('b');if(!title){title=document.createElement('b');card.prepend(title)}
  title.textContent=h.match+' — הוזמן ✅';
  const d=document.createElement('div');d.className='hotel-booking-details';
  d.innerHTML=`<div class="hotel-detail-row"><span>📅 תאריכים</span><strong>${h.dates}</strong></div>
  <div class="hotel-detail-row"><span>🏷️ הוזמן דרך</span><strong>${h.provider}</strong></div>
  <div class="hotel-detail-row"><span>🔢 מספר הזמנה</span><strong>${h.booking}</strong></div>
  ${h.ref!=='—'?`<div class="hotel-detail-row"><span>🧾 אסמכתה</span><strong>${h.ref}</strong></div>`:''}
  <div class="hotel-detail-row"><span>🛏️ סוג חדר</span><strong>${h.room}</strong></div>
  <div class="hotel-detail-row"><span>📐 גודל חדר</span><strong>${h.size}</strong></div>
  <div class="hotel-detail-row"><span>🛌 מיטה</span><strong>${h.bed}</strong></div>
  <div class="hotel-detail-row"><span>🍽️ ארוחה</span><strong>${h.meal}</strong></div>
  <div class="hotel-detail-row hotel-price"><span>💴 מחיר</span><strong>¥${money(h.jpy)} · ≈ ₪${money(h.ils)}</strong></div>
  <div class="hotel-detail-row"><span>💳 מצב תשלום</span><strong>${h.pay}</strong></div>
  <div class="hotel-detail-row hotel-doc-placeholder"><span>📎 אסמכתה</span><strong>צפייה / עריכה</strong></div>`;
  card.appendChild(d);if(actions)card.appendChild(actions);if(map)card.appendChild(map);
 });
 document.querySelectorAll('.reservation-doc-open').forEach(b=>{if(/הצג אסמכתא/.test(b.textContent))b.textContent='📄 צפייה באסמכתא'});
 document.querySelectorAll('.reservation-doc-replace').forEach(b=>b.textContent='✏️ עריכת אסמכתא');
}
function style(){if(document.getElementById('hotelDetailsStyle'))return;const s=document.createElement('style');s.id='hotelDetailsStyle';s.textContent=`#page-hotels .hotel-card{padding:14px 14px 12px}#page-hotels .hotel-booking-details{margin-top:10px;border-top:1px solid #e5e7eb}#page-hotels .hotel-detail-row{display:grid;grid-template-columns:105px 1fr;gap:9px;padding:7px 0;border-bottom:1px solid #f0f1f3;font-size:13px;align-items:start}#page-hotels .hotel-detail-row span{color:#667085}#page-hotels .hotel-detail-row strong{font-weight:600;color:#1f2937}#page-hotels .hotel-price strong{font-size:15px;color:#111827}#page-hotels .hotel-doc-placeholder{background:#f8fafc;margin:6px -4px 0;padding:9px 4px;border-radius:8px;border-bottom:0}@media(max-width:390px){#page-hotels .hotel-detail-row{grid-template-columns:92px 1fr;font-size:12px}}`;document.head.appendChild(s)}
function run(){style();render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,1100),{once:true});else setTimeout(run,1100);
window.addEventListener('japanTripDriveSynced',()=>setTimeout(run,80));
})();