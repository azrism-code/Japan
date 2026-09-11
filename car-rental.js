/* Japan Trip 2026 · car rental feature · v10.0.3
   Booked Klook / Nippon Rent A Car reservation, route integration and detailed rental page. */
(() => {
  'use strict';
  const T = window.TRIP_DATA;
  if (!T) return;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const G = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);

  const rental = {
    key:'car-nippon-odawara',
    docKey:'car-nippon-odawara',
    status:'שולם',
    provider:'Klook',
    supplier:'Nippon Rent A Car',
    booking:'CSW878325',
    vehicle:'Nissan Note e-POWER או רכב דומה · Compact',
    seats:'5', luggage:'2', transmission:'אוטומטי', ac:'כן',
    pickupDate:'8 Nov 2026', pickupTime:'11:00',
    dropoffDate:'10 Nov 2026', dropoffTime:'11:00',
    location:'Odawara Station Shinkansen Exit',
    address:'1-14-2 Shiroyama, Odawara-shi, Kanagawa, Japan',
    arrival:'דקת הליכה מ-Odawara Station West Exit · צד ה-Shinkansen',
    phone:'050-1712-2727', hours:'08:00–20:00',
    priceIls:521.20, payAtPickup:'¥0',
    fuel:'Full to Full', mileage:'ללא הגבלה', gps:'כלול ללא תשלום',
    insurance:'Enhanced Plus · CDW השתתפות עצמית ¥0 · צד ג׳ השתתפות עצמית ¥0 · Loss of Use Cover השתתפות עצמית ¥0',
    insuranceNote:'לפי השובר, כיסוי ה-CDW אינו כולל נזק לזכוכיות, תחתית/שלדה, צמיגים או גג. במקרה אירוע יש לדווח לחברת ההשכרה ולמשטרה.',
    cancellation:'ביטול חינם עד 6/11/2026 בשעה 11:00. 6/11 11:00–7/11 11:00: ₪104.24; 7/11 11:00–8/11 11:00: ₪260.60; לאחר 8/11 11:00 אין החזר.',
    documents:'דרכון · רישיון נהיגה ישראלי פיזי · רישיון בינלאומי פיזי לפי אמנת Geneva 1949 · כרטיס אשראי פיזי על שם הנהג · Voucher מודפס',
    map:G('Nippon Rent A Car Odawara Station Shinkansen Exit 1-14-2 Shiroyama Odawara')
  };
  T.carRental = rental;

  // Route: exact booked pickup / return details.
  const pickupDay = T.days.find(d => d.date === '08/11');
  if (pickupDay) {
    const s = pickupDay.stops.find(x => /איסוף רכב/.test(x.title || ''));
    if (s) Object.assign(s, {
      time:'11:00', icon:'🚗', title:'איסוף רכב · Nippon Rent A Car',
      text:'Odawara Station Shinkansen Exit · 1-14-2 Shiroyama · דקת הליכה מה-West Exit בצד ה-Shinkansen. Nissan Note e-POWER או דומה · Booking CSW878325.'
    });
  }
  const returnDay = T.days.find(d => d.date === '10/11');
  if (returnDay) {
    const s = returnDay.stops.find(x => /החזרת רכב/.test(x.title || ''));
    if (s) Object.assign(s, {
      time:'11:00', icon:'🚗', title:'החזרת רכב · Nippon Rent A Car',
      text:'החזרה באותו סניף: Odawara Station Shinkansen Exit · 1-14-2 Shiroyama. להחזיר מיכל מלא ולשמור קבלה/צילום מד הדלק.'
    });
  }

  // Booking list: replace the old placeholder with the confirmed reservation.
  const oldIndex = T.bookings.findIndex(b => b.title === 'רכב · Odawara');
  T.bookings = T.bookings.filter(b => b.title !== 'רכב · Odawara' && b.docKey !== rental.docKey);
  const bookingItem = {
    priority:'green', title:'רכב · Nippon Rent A Car · Odawara', status:'שולם',
    note:'איסוף 8/11 11:00 · החזרה 10/11 11:00 · Klook CSW878325', docKey:rental.docKey
  };
  T.bookings.splice(oldIndex >= 0 ? Math.min(oldIndex, T.bookings.length) : T.bookings.length, 0, bookingItem);

  // Budget: replace the old estimate with the actual paid amount.
  T.expenseDefaults = T.expenseDefaults.filter(x => x.name !== 'השכרת רכב · Odawara' && x.name !== 'השכרת רכב · Nippon Rent A Car');
  const rentalExpense = {name:'השכרת רכב · Nippon Rent A Car',status:'שולם',payment:'אשראי',currency:'ILS',amount:521.20,category:'🚗 תחבורה',included:true,note:'8–10/11 · Klook CSW878325 · שולם אונליין'};
  T.expenseDefaults.push(rentalExpense);
  try {
    const key='japanTrip_expenses_v1';
    let items=JSON.parse(localStorage.getItem(key)||'[]');
    if (!Array.isArray(items)) items=[];
    const previous=items.find(x => x.name==='השכרת רכב · Nippon Rent A Car');
    items=items.filter(x => x.name!=='השכרת רכב · Odawara' && x.name!=='השכרת רכב · Nippon Rent A Car');
    items.push({id:previous?.id||Date.now(),...rentalExpense});
    localStorage.setItem(key,JSON.stringify(items));
  } catch(e) {}

  function row(label,value){return `<div class="detail-row"><span>${label}</span><strong>${esc(value)}</strong></div>`}
  function renderRentalPage(){
    const r=T.carRental, page=document.querySelector('#sheetPage');
    if(!page)return;
    document.querySelector('#sideMenu')?.classList.remove('open');
    document.querySelector('#sideMenu')?.setAttribute('aria-hidden','true');
    document.querySelector('#overlay')?.classList.remove('open');
    page.innerHTML=`<div class="page-head"><button data-action="close-page">←</button><h2>🚗 השכרת רכב</h2></div><div class="page-body">
      <div class="hotel-city"><h3>🚗 Odawara · 8–10 Nov 2026</h3>
        <div class="hotel-card" data-doc-key="${esc(r.docKey)}">
          <div class="hotel-title"><b>${esc(r.supplier)}</b><span class="status-badge paid">שולם ✅</span></div>
          <div class="hotel-detail-grid">
            ${row('🏷️ הוזמן דרך',r.provider)}
            ${row('🔢 מספר הזמנה',r.booking)}
            ${row('🚘 רכב',r.vehicle)}
            ${row('👥 מקומות',r.seats)}
            ${row('🧳 מזוודות',r.luggage)}
            ${row('⚙️ גיר',r.transmission)}
            ${row('📅 איסוף',r.pickupDate+' · '+r.pickupTime)}
            ${row('📅 החזרה',r.dropoffDate+' · '+r.dropoffTime)}
            ${row('📍 סניף',r.location)}
            ${row('🏠 כתובת',r.address)}
            ${row('🚉 הגעה',r.arrival)}
            ${row('☎️ טלפון',r.phone)}
            ${row('🕗 שעות',r.hours)}
            ${row('💰 מחיר', '₪'+r.priceIls.toFixed(2))}
            ${row('💳 תשלום באיסוף',r.payAtPickup)}
            ${row('⛽ דלק',r.fuel)}
            ${row('🛣️ קילומטרים',r.mileage)}
            ${row('🧭 GPS',r.gps)}
            ${row('🛡️ ביטוח',r.insurance)}
            ${row('🟢 ביטול',r.cancellation)}
          </div>
          <div class="notice"><b>⚠️ ביטוח</b><br>${esc(r.insuranceNote)}</div>
          <div class="notice"><b>📋 להביא לאיסוף</b><br>${esc(r.documents)}</div>
          <div class="hotel-doc-title">📎 אסמכתה / Voucher</div><div class="doc-slot"></div>
          <div class="hotel-actions"><a class="map-btn" href="${r.map}" target="_blank" rel="noopener">📍 פתח מפה ↗</a></div>
        </div>
      </div>
      <div class="notice">הרכב מיועד לקטע Hakone / Fuji בלבד. איסוף והחזרה באותו סניף ליד Odawara Station.</div>
    </div>`;
    page.classList.add('open'); page.setAttribute('aria-hidden','false');
    window.JapanDrive?.renderDocs?.();
  }

  // First-class Car Rental menu page, while keeping the rest of app.js unchanged.
  document.addEventListener('click', e => {
    const trigger=e.target.closest('[data-page="car"]');
    if(!trigger)return;
    e.preventDefault(); e.stopImmediatePropagation();
    renderRentalPage();
  }, true);

  T.version='10.0.3';
  document.documentElement.dataset.appReady='v10.0.3';
  window.JapanTripApp?.renderTrip?.();
  window.JapanCarRental={rental,renderRentalPage};
})();