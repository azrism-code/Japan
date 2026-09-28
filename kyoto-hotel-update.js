/* Japan Trip 2026 · Kyoto hotel replacement · v10.2.5 */
(() => {
  'use strict';
  const T=window.TRIP_DATA;
  if(!T)return;

  const OLD_KEY='hotel-daiwa-kyoto-shijo';
  const NEW_KEY='hotel-sakura-terrace-gallery-kyoto';
  const OLD_NAME='Daiwa Roynet Hotel Kyoto Shijo Karasuma';
  const NEW_NAME='SAKURA TERRACE THE GALLERY';
  const EXP_KEY='japanTrip_expenses_v1';

  function applyHotelData(){
    const h=T.hotels?.find(x=>x.key===NEW_KEY||x.key===OLD_KEY);
    if(!h)return;

    Object.assign(h,{
      key:NEW_KEY,
      city:'Kyoto',
      dates:'10–14 Nov 2026',
      booked:true,
      name:NEW_NAME,
      provider:'Official website · Tripla',
      booking:'',
      reference:'',
      room:'Deluxe King with balcony · North · Non-Smoking',
      size:'25 m²',
      bed:'King · 180×195 cm',
      meal:'Room only · ללא ארוחת בוקר',
      usd:840.91,
      jpy:0,
      ils:0,
      payment:'שולם',
      cancellation:'ביטול חינם עד 4/11/2026 · 23:59',
      address:'39 Kamitonoda-cho, Higashi-kujo, Minami-ku, Kyoto 601-8002, Japan',
      arrival:'Kyoto Station · צד Hachijo (דרום) · כ־2 דקות הליכה',
      map:T.maps.search('SAKURA TERRACE THE GALLERY Kyoto')
    });

    for(const d of T.days||[])if(d.hotel===OLD_KEY)d.hotel=NEW_KEY;

    const day10=T.days?.find(d=>d.date==='10/11');
    if(day10){
      const checkin=day10.stops?.find(s=>/^Check-in/.test(s.title||''));
      if(checkin){
        checkin.title='Check-in · SAKURA TERRACE THE GALLERY';
        checkin.text='המלון נמצא בצד Hachijo הדרומי של Kyoto Station, כ־2 דקות הליכה מהתחנה. חדר Deluxe King עם מרפסת, 25 מ״ר.';
      }
    }

    const day14=T.days?.find(d=>d.date==='14/11');
    if(day14){
      const luggage=day14.stops?.find(s=>/טיפול במזוודות/.test(s.title||''));
      if(luggage)luggage.text='נבדוק עם SAKURA TERRACE THE GALLERY אפשרות לשליחת המזוודות ל-Hotel Royal Classic Osaka. אם השירות לא מאושר בפועל, ניקח אותן איתנו או נשתמש בפתרון חלופי.';
    }

    const gion=T.eveningWalks?.gion;
    if(gion){
      gion.out='🚉 יציאה 19:30 מהמלון · כ־2 דקות הליכה ל-Kyoto Station, ומשם תחבורה לכיוון Gion / Shijo-Kawaramachi. כ־15–25 דקות לפי הקו וההמתנה.';
      gion.back='🚉 חזרה · Gion-Shijo / Shijo-Kawaramachi → Kyoto Station, ואז כ־2 דקות הליכה ל-SAKURA TERRACE THE GALLERY.';
    }
    const pontocho=T.eveningWalks?.pontocho;
    if(pontocho){
      pontocho.out='🚉 יציאה 19:30 מהמלון · כ־2 דקות הליכה ל-Kyoto Station, ומשם תחבורה ל-Shijo-Kawaramachi / Pontocho. כ־15–25 דקות לפי הקו וההמתנה.';
      pontocho.back='🚉 חזרה · Kawaramachi / Pontocho → Kyoto Station, ואז כ־2 דקות הליכה ל-SAKURA TERRACE THE GALLERY.';
    }

    const e=T.expenseDefaults?.find(x=>x.name===OLD_NAME||x.name===NEW_NAME);
    if(e)Object.assign(e,{
      name:NEW_NAME,
      status:'שולם',
      payment:'אשראי',
      currency:'USD',
      amount:840.91,
      category:'🏨 לינה',
      included:true,
      note:'10–14/11 · Official website · Room only · prepaid'
    });
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
      const next={status:'שולם',payment:'אשראי',currency:'USD',amount:840.91,category:'🏨 לינה',included:true,note:'10–14/11 · Official website · Room only · prepaid'};
      for(const [k,v] of Object.entries(next))if(current[k]!==v){current[k]=v;changed=true}
    }

    if(changed){
      localStorage.setItem(EXP_KEY,JSON.stringify(a));
      if(notifyCloud&&window.JapanCloud?.canWrite?.())document.dispatchEvent(new CustomEvent('japan:stateChanged'));
    }
    return changed;
  }

  function enhanceRenderedUi(){
    const hotelSection=document.getElementById('hotel-'+NEW_KEY);
    if(hotelSection){
      hotelSection.querySelectorAll('.detail-row').forEach(row=>{
        const label=row.querySelector('span');
        const value=row.querySelector('strong');
        if(!label||!value)return;
        const t=label.textContent||'';
        if(/מספר הזמנה|Reference/i.test(t)&&!value.textContent.trim())row.hidden=true;
        if(/מחיר ביין/.test(t)){
          label.textContent='💵 מחיר';
          value.textContent='$840.91';
        }
        if(/מחיר בשקלים/.test(t))row.hidden=true;
        if(/מצב תשלום/.test(t))value.textContent='שולם מראש (Prepaid)';
      });
    }

    const kyotoStation=document.getElementById('station-kyoto');
    if(kyotoStation){
      const route=kyotoStation.querySelector('.station-route');
      if(route){
        route.innerHTML='<b>⭐ לפי המסלול שלנו</b><span>• המלון שלנו: Hachijo / הצד הדרומי · כ־2 דקות הליכה מ-Kyoto Station.</span><span>• בהגעה ב-Shinkansen: נוח לצאת לכיוון Hachijo.</span><span>• ל-AONIYOSHI ב-14/11: Kintetsu Kyoto נמצאת בתוך מתחם התחנה.</span>';
      }
    }
  }

  let pending=false;
  function scheduleUi(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(()=>{pending=false;enhanceRenderedUi()});
  }

  applyHotelData();
  migrateExpenseStorage(false);

  document.addEventListener('japan:cloudApplied',()=>{
    applyHotelData();
    migrateExpenseStorage(true);
    scheduleUi();
  });

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-page="hotels"],[data-page="expenses"],[data-page="pocket"],[data-station-guide],[data-hotel-open]'))setTimeout(scheduleUi,0);
  });

  const observer=new MutationObserver(scheduleUi);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',scheduleUi);
  scheduleUi();
})();
