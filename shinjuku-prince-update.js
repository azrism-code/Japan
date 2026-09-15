/* Japan Trip 2026 · Shinjuku Prince hotel migration · v10.1.8
   Keeps the existing private booking slot intact until Firestore private data is verified.
   Updates only non-sensitive hotel facts, itinerary routing, station guidance and the matching expense. */
(() => {
  'use strict';
  const T=window.TRIP_DATA;
  if(!T)return;

  const HOTEL_KEY='hotel-jr-kyushu-shinjuku';
  const OLD_NAME='JR Kyushu Hotel Blossom Shinjuku';
  const NEW_NAME='Shinjuku Prince Hotel';
  const EXP_KEY='japanTrip_expenses_v1';

  function applyHotelData(){
    const h=T.hotels?.find(x=>x.key===HOTEL_KEY);
    if(!h)return;

    // Intentionally do not touch booking/reference here. They remain in the existing
    // private slot until the new booking details are written to and verified in Firestore private.
    Object.assign(h,{
      city:'Tokyo',
      dates:'4–8 Nov 2026',
      booked:true,
      name:NEW_NAME,
      provider:'Booking.com',
      room:'Deluxe King Room · Non-Smoking',
      size:'30.6 m²',
      bed:'1 Queen · 151–180 cm',
      meal:'כולל ארוחת בוקר + Wi-Fi',
      jpy:257395,
      ils:5079.19,
      payment:'טרם שולם',
      cancellation:'ביטול חינם עד 14 יום לפני ההגעה · לאחר מכן 50% · No-show 100%',
      address:'1-30-1 Kabuki-cho, Shinjuku-ku, Tokyo 160-8487',
      arrival:'JR Shinjuku · כ־5 דקות הליכה · Seibu-Shinjuku מחובר למלון',
      map:T.maps.search('Shinjuku Prince Hotel Tokyo')
    });

    const day=T.days?.find(d=>d.date==='04/11');
    if(day){
      const checkin=day.stops?.find(s=>/^Check-in/.test(s.title||''));
      if(checkin){
        checkin.title='Check-in · Shinjuku Prince Hotel';
        checkin.text='Kabukicho · כ־5 דקות הליכה מ-JR Shinjuku; תחנת Seibu-Shinjuku מחוברת למלון. התארגנות ומנוחה קצרה לפני הערב הראשון.';
      }
      if(!day.stops?.some(s=>s.title==='Narita → Shinjuku Prince Hotel')){
        const landingIndex=day.stops?.findIndex(s=>/נחיתה Narita/.test(s.title||''))??-1;
        day.stops?.splice(Math.max(0,landingIndex+1),0,{
          time:'אחרי המכס',icon:'🚆',title:'Narita → Shinjuku Prince Hotel',
          text:'אפשרות נוחה: N’EX ישיר ל-Shinjuku (כ־80 דקות) ואז כ־5 דקות הליכה. חלופה עם מזוודות: Limousine Bus ל-TOKYU KABUKICHO TOWER ומשם כ־2 דקות הליכה למלון.'
        });
      }
      day.route=T.maps.directions('Narita International Airport Terminal 2','Shinjuku Prince Hotel Tokyo');
    }

    const shinjuku=T.places?.Shinjuku;
    if(shinjuku){
      shinjuku.tip='המלון שלנו נמצא בצד Kabukicho: מ-JR Shinjuku הולכים לכיוון East/Kabukicho; Seibu-Shinjuku מחובר ישירות למלון.';
    }

    const e=T.expenseDefaults?.find(x=>x.name===OLD_NAME||x.name===NEW_NAME);
    if(e)Object.assign(e,{name:NEW_NAME,status:'מוזמן',payment:'אשראי',currency:'JPY',amount:257395,category:'🏨 לינה',included:true,note:'4–8/11 · Booking.com · כולל ארוחת בוקר'});
  }

  function migrateExpenseStorage(notifyCloud=false){
    let a;
    try{a=JSON.parse(localStorage.getItem(EXP_KEY)||'null')}catch(_){a=null}
    if(!Array.isArray(a))return false;

    let changed=false;
    let current=a.find(x=>x?.name===NEW_NAME);
    const old=a.find(x=>x?.name===OLD_NAME);
    if(old&&!current){old.name=NEW_NAME;current=old;changed=true}
    else if(old&&current){a=a.filter(x=>x!==old);changed=true}

    if(current){
      const next={status:'מוזמן',payment:'אשראי',currency:'JPY',amount:257395,category:'🏨 לינה',included:true,note:'4–8/11 · Booking.com · כולל ארוחת בוקר'};
      for(const [k,v] of Object.entries(next))if(current[k]!==v){current[k]=v;changed=true}
    }

    if(changed){
      localStorage.setItem(EXP_KEY,JSON.stringify(a));
      if(notifyCloud&&window.JapanCloud?.canWrite?.())document.dispatchEvent(new CustomEvent('japan:stateChanged'));
    }
    return changed;
  }

  function enhanceRenderedUi(){
    // Do not display the superseded booking/reference under the new hotel name.
    // The values stay untouched in the private slot until the new private booking is verified.
    const hotelSection=document.getElementById('hotel-'+HOTEL_KEY);
    hotelSection?.querySelectorAll('.detail-row').forEach(row=>{
      const label=row.querySelector('span')?.textContent||'';
      if(/מספר הזמנה|Reference/i.test(label))row.hidden=true;
    });

    const station=document.getElementById('station-shinjuku');
    station?.querySelectorAll('.station-exits>div').forEach(row=>{
      const title=row.querySelector('b')?.textContent||'';
      const text=row.querySelector('span');
      if(!text)return;
      if(/^East \/ 東口/.test(title)){
        const wanted='Shinjuku Prince Hotel, Kabukicho, Isetan ואזור חיי הלילה והקניות במזרח.';
        if(text.textContent!==wanted)text.textContent=wanted;
      }
      if(/^South \/ 南口/.test(title)&&/JR Kyushu|מלון/.test(text.textContent||''))text.textContent='NEWoMan, Takashimaya והצד הדרומי של התחנה.';
    });
    station?.querySelectorAll('.station-route span').forEach(line=>{
      if(/המלון שלנו|South Exit/.test(line.textContent||'')){
        const wanted='• המלון שלנו: East / Kabukicho · כ־5 דקות; Seibu-Shinjuku מחובר למלון.';
        if(line.textContent!==wanted)line.textContent=wanted;
      }
    });

    document.querySelectorAll('.station-exit-hint span').forEach(span=>{
      const t=span.textContent||'';
      if(/South למלון|South Exit.*מלון|South.*למלון/.test(t))span.textContent='Shinjuku Station: West לגורדי השחקים, East / Kabukicho למלון ולחיי הלילה.';
    });
  }

  let uiPending=false;
  function scheduleUi(){
    if(uiPending)return;
    uiPending=true;
    requestAnimationFrame(()=>{uiPending=false;enhanceRenderedUi()});
  }

  applyHotelData();
  migrateExpenseStorage(false);

  document.addEventListener('japan:cloudApplied',()=>{
    applyHotelData();
    migrateExpenseStorage(true);
    scheduleUi();
  });

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-page="hotels"],[data-page="pocket"],[data-station-guide],[data-place="Shinjuku"],[data-hotel-open]'))setTimeout(scheduleUi,0);
  });

  const observer=new MutationObserver(scheduleUi);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',scheduleUi);
  scheduleUi();
})();
