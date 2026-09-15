/* Japan Trip 2026 · booking planner · v10.2.1
   Enhanced reservation checklist with type badges, prices, booking windows,
   provider links, filters, Drive confirmations and cloud-synced completion state. */
(() => {
  'use strict';
  const T=window.TRIP_DATA;
  if(!T)return;

  const SETTINGS_KEY='japanTrip_settings_v1';
  const FILTER_KEY='japanTrip_bookingFilter_v1';
  const TYPE_FILTER_KEY='japanTrip_bookingTypeFilter_v1';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const ITEMS=[
    {
      id:'hakone-hotel', docKey:'hotel-hakone', type:'hotel', icon:'🏨', typeLabel:'מלון',
      title:'מלון Hakone / Fuji', tripDate:'8–10/11', required:true,
      price:'הערכה: US$600 לזוג / 2 לילות (≈ ₪1,800)',
      when:'עכשיו', whenNote:'זה הפריט הדחוף ביותר שנותר פתוח.',
      provider:'Booking.com / Agoda',
      bookingUrl:'https://www.booking.com/searchresults.html?ss=Hakone%2C%20Japan&checkin=2026-11-08&checkout=2026-11-10&group_adults=2&no_rooms=1&group_children=0',
      priority:1
    },
    {
      id:'narita-transfer-shinjuku-prince', docKey:'narita-transfer-shinjuku-prince', type:'car', icon:'🚕', typeLabel:'מונית / הסעה',
      title:'הסעה · Narita → Shinjuku Prince Hotel', tripDate:'4/11 · נחיתה 13:10 · יעד משוער 14:27', required:true,
      price:'חינם · ₪0',
      when:'עכשיו', whenNote:'הטבת Booking.com להזמנה הנוכחית · Standard · עד 2 נוסעים · 3 מזוודות · כולל מעקב טיסה.',
      provider:'Booking.com · Powered by Carzen+',
      bookingUrl:'https://www.booking.com/taxi/index.html',
      priority:2
    },
    {
      id:'teamlab-kyoto', docKey:'teamlab-biovortex-kyoto', type:'attraction', icon:'🎨', typeLabel:'אטרקציה',
      title:'teamLab Biovortex Kyoto', tripDate:'12/11 · ערב', required:true,
      price:'מ־¥3,800 לאדם · כ־¥7,600 לזוג',
      when:'עכשיו', whenNote:'כרטיס כניסה לפי שעה; עלול להימכר מראש.',
      provider:'האתר הרשמי של teamLab',
      bookingUrl:'https://www.teamlab.art/e/kyoto/',
      priority:3
    },
    {
      id:'romancecar-shinjuku-odawara', docKey:'romancecar-shinjuku-odawara', type:'train', icon:'🚆', typeLabel:'רכבת',
      title:'Romancecar · Shinjuku → Odawara', tripDate:'8/11 · בוקר', required:false,
      price:'≈ ¥1,850 לאדם · ≈ ¥3,700 לזוג',
      when:'8/10 · 10:00 יפן (04:00 ישראל)', whenNote:'המכירה נפתחת חודש לפני. כל המקומות שמורים.',
      provider:'Odakyu · e-Romancecar',
      bookingUrl:'https://www.odakyu.jp/romancecar/booking/',
      priority:4
    },
    {
      id:'shinkansen-odawara-kyoto', docKey:'shinkansen-odawara-kyoto', type:'shinkansen', icon:'🚄', typeLabel:'Shinkansen',
      title:'Shinkansen · Odawara → Kyoto', tripDate:'10/11', required:true,
      price:'הערכה: ¥12,300–13,000 לאדם',
      when:'אפשר להזמין כבר עכשיו', whenNote:'ב־SmartEX ניתן להזמין מוקדם; רכבת/מושב נקבעים סופית סביב 10/10.',
      provider:'SmartEX',
      bookingUrl:'https://smart-ex.jp/en/',
      priority:5
    },
    {
      id:'aoniyoshi-kyoto-nara', docKey:'aoniyoshi-kyoto-nara', type:'train', icon:'🚆', typeLabel:'רכבת מיוחדת',
      title:'AONIYOSHI · Kyoto → Nara', tripDate:'14/11 · 10:55 → 11:31', required:true,
      price:'¥1,490 לאדם · ¥2,980 לזוג ב־Twin Seats',
      when:'14/10 · 10:30 יפן (04:30 ישראל)', whenNote:'מומלץ להזמין מיד בפתיחת המכירה כדי לקבל Twin Seats.',
      provider:'Kintetsu · Limited Express e-ticket',
      bookingUrl:'https://www.ticket.kintetsu.co.jp/vs/en/T/TZZ/TZZ10.do?op=tDisplayVisitorMenu',
      priority:6
    },
    {
      id:'shinkansen-osaka-tokyo', docKey:'shinkansen-osaka-tokyo', type:'shinkansen', icon:'🚄', typeLabel:'Shinkansen',
      title:'Shinkansen · Shin-Osaka → Tokyo', tripDate:'16/11', required:true,
      price:'הערכה: ¥14,500–15,000 לאדם',
      when:'אפשר להזמין כבר עכשיו', whenNote:'אישור רכבת/מושב סביב 16/10; אם רוצים צד Fuji כדאי לבחור מושב כשמתאפשר.',
      provider:'SmartEX',
      bookingUrl:'https://smart-ex.jp/en/',
      priority:7
    },
    {
      id:'shibuya-sky', docKey:'shibuya-sky-0611', type:'attraction', icon:'🌇', typeLabel:'תצפית',
      title:'SHIBUYA SKY', tripDate:'6/11 · אם נבחר בתצפית הזו', required:false, optional:true,
      price:'¥2,700 עד 14:59 / ¥3,400 מ־15:00 לאדם',
      when:'סביב 23/10', whenNote:'הכרטיסים נמכרים כשבועיים קדימה; ערב מבוקש יותר.',
      provider:'SHIBUYA SKY · האתר הרשמי',
      bookingUrl:'https://www.shibuya-scramble-square.com/sky/ticket/',
      priority:8
    },
    {
      id:'car-odawara', docKey:'car-nippon-odawara', type:'car', icon:'🚗', typeLabel:'רכב',
      title:'Nippon Rent A Car · Odawara', tripDate:'8–10/11', required:true, defaultDone:true,
      price:'₪521.20 · שולם',
      when:'כבר הוזמן', whenNote:'איסוף 8/11 11:00 · החזרה 10/11 11:00.',
      provider:'Klook', bookingUrl:'https://www.klook.com/',
      priority:99
    }
  ];

  const TYPE_ORDER=['all','hotel','attraction','train','shinkansen','car'];
  const TYPE_NAMES={all:'כל הסוגים',hotel:'מלון',attraction:'אטרקציות / תצפית',train:'רכבות',shinkansen:'Shinkansen',car:'רכב / מונית'};

  function readSettings(){
    try{const s=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}');return s&&typeof s==='object'&&!Array.isArray(s)?s:{}}catch(_){return {}}
  }
  function planner(){
    const p=readSettings().bookingPlanner;
    return p&&typeof p==='object'?p:{statuses:{}};
  }
  function statuses(){const s=planner().statuses;return s&&typeof s==='object'?s:{}}
  function isDone(item){const s=statuses();return Object.prototype.hasOwnProperty.call(s,item.id)?!!s[item.id]:!!item.defaultDone}
  function canWrite(){return !window.JapanCloud||window.JapanCloud.canWrite?.()!==false}

  function saveDone(id,value){
    if(!canWrite()){window.JapanCloud?.deny?.();return false}
    const settings=readSettings();
    const current=settings.bookingPlanner&&typeof settings.bookingPlanner==='object'?settings.bookingPlanner:{};
    settings.bookingPlanner={...current,statuses:{...(current.statuses||{}),[id]:!!value},updatedAt:new Date().toISOString()};
    localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));
    document.dispatchEvent(new CustomEvent('japan:stateChanged'));
    return true;
  }

  function getFilter(){return localStorage.getItem(FILTER_KEY)||'open'}
  function getTypeFilter(){return localStorage.getItem(TYPE_FILTER_KEY)||'all'}
  function setFilter(v){localStorage.setItem(FILTER_KEY,v)}
  function setTypeFilter(v){localStorage.setItem(TYPE_FILTER_KEY,v)}

  function matches(item,filter,typeFilter){
    const done=isDone(item);
    const statusOk=filter==='all'||(filter==='booked'&&done)||(filter==='open'&&!done&&!item.optional)||(filter==='optional'&&!done&&item.optional);
    const typeOk=typeFilter==='all'||item.type===typeFilter||(typeFilter==='attraction'&&item.type==='attraction');
    return statusOk&&typeOk;
  }

  function summary(){
    const booked=ITEMS.filter(isDone).length;
    const open=ITEMS.filter(x=>!isDone(x)&&!x.optional).length;
    const optional=ITEMS.filter(x=>!isDone(x)&&x.optional).length;
    return {booked,open,optional,total:ITEMS.length};
  }

  function filterButton(id,label,count,active){return `<button type="button" class="bp-filter ${active?'active':''}" data-bp-filter="${id}">${label}<em>${count}</em></button>`}

  function card(item){
    const done=isDone(item);
    const stateClass=done?'done':item.optional?'optional':'open';
    const importance=done?'הוזמן':item.optional?'אופציונלי':item.required?'צריך להזמין':'מומלץ להזמין';
    return `<article class="bp-card ${stateClass}" data-doc-key="${esc(item.docKey||'')}">
      <div class="bp-card-head">
        <span class="bp-type">${item.icon} ${esc(item.typeLabel)}</span>
        <label class="bp-check"><input type="checkbox" data-bp-done="${esc(item.id)}" ${done?'checked':''}><span>${done?'הוזמן ✅':'סמן כהוזמן'}</span></label>
      </div>
      <h3>${esc(item.title)}</h3>
      <div class="bp-trip-date">📅 ${esc(item.tripDate)} <span class="bp-state">${esc(importance)}</span></div>
      <div class="bp-grid">
        <div><small>💰 מחיר משוער</small><b>${esc(item.price)}</b></div>
        <div><small>⏰ מתי להזמין</small><b>${esc(item.when)}</b><span>${esc(item.whenNote)}</span></div>
        <div><small>🌐 מאיפה להזמין</small><b>${esc(item.provider)}</b></div>
      </div>
      <div class="bp-actions">
        <a href="${esc(item.bookingUrl)}" target="_blank" rel="noopener" class="bp-book-link">פתח אתר הזמנה ↗</a>
        ${item.docKey?'<div class="doc-slot"></div>':''}
      </div>
    </article>`;
  }

  function render(){
    const page=document.getElementById('sheetPage');
    if(!page)return;
    const h=page.querySelector('.page-head h2')?.textContent||'';
    if(!/הזמנות/.test(h)&&!page.dataset.bookingPlanner)return;
    page.dataset.bookingPlanner='1';

    const filter=getFilter(), typeFilter=getTypeFilter(), s=summary();
    const visible=ITEMS.filter(x=>matches(x,filter,typeFilter)).sort((a,b)=>a.priority-b.priority);
    page.innerHTML=`<div class="page-head"><button data-action="close-page">←</button><h2>🎟️ הזמנות</h2></div><div class="page-body bp-page">
      <div class="bp-summary">
        <div><b>${s.open}</b><span>להזמין</span></div><div><b>${s.booked}</b><span>הוזמן</span></div><div><b>${s.optional}</b><span>אופציונלי</span></div>
      </div>
      <div class="bp-filters">
        ${filterButton('open','להזמין',s.open,filter==='open')}
        ${filterButton('all','הכול',s.total,filter==='all')}
        ${filterButton('booked','הוזמן',s.booked,filter==='booked')}
        ${filterButton('optional','אופציונלי',s.optional,filter==='optional')}
      </div>
      <div class="bp-type-row"><span>סוג:</span><select id="bpTypeFilter">${TYPE_ORDER.map(x=>`<option value="${x}" ${x===typeFilter?'selected':''}>${TYPE_NAMES[x]}</option>`).join('')}</select></div>
      <div class="bp-note">המחירים הם הערכה לצורך תכנון. חלונות המכירה והמחירים נבדקו מול האתרים הרשמיים ב־15/09/2026.</div>
      <div class="bp-list">${visible.length?visible.map(card).join(''):'<div class="bp-empty">אין פריטים במסנן הזה.</div>'}</div>
    </div>`;
    page.classList.add('open');page.setAttribute('aria-hidden','false');
    setTimeout(()=>window.JapanDrive?.renderDocs?.(),0);
  }

  function openPlanner(){
    window.JapanTripApp?.openPage?.('bookings');
    render();
  }

  const style=document.createElement('style');
  style.textContent=`
    .bp-page{padding-bottom:28px}.bp-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}.bp-summary>div{background:#fff;border:1px solid #eadfd8;border-radius:14px;padding:10px;text-align:center}.bp-summary b{display:block;font-size:20px}.bp-summary span{font-size:10px;color:#766b64;font-weight:800}.bp-filters{display:flex;gap:6px;overflow:auto;padding-bottom:6px}.bp-filter{border:1px solid #e3d6ce;background:#fff;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:850;white-space:nowrap}.bp-filter.active{background:#302a27;color:#fff;border-color:#302a27}.bp-filter em{font-style:normal;margin-inline-start:5px;opacity:.72}.bp-type-row{display:flex;align-items:center;gap:8px;margin:6px 0 10px;font-size:11px;font-weight:850}.bp-type-row select{flex:1;border:1px solid #e3d6ce;border-radius:10px;background:#fff;padding:8px;font:inherit}.bp-note{font-size:10px;line-height:1.45;color:#766b64;background:#faf7f4;border-radius:10px;padding:8px 10px;margin-bottom:10px}.bp-list{display:grid;gap:10px}.bp-card{background:#fff;border:1px solid #eadfd8;border-radius:16px;padding:12px;box-shadow:0 4px 14px rgba(61,47,39,.05)}.bp-card.done{opacity:.72}.bp-card-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.bp-type{font-size:10px;font-weight:900;background:#f3eee9;border-radius:999px;padding:5px 8px}.bp-check{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:900;cursor:pointer}.bp-check input{accent-color:#2c6b45;width:17px;height:17px}.bp-card h3{font-size:15px;margin:9px 0 5px}.bp-trip-date{font-size:10.5px;color:#6e645e;font-weight:800}.bp-state{margin-inline-start:5px;background:#fff3df;border-radius:999px;padding:3px 6px;color:#9b5a12}.bp-card.done .bp-state{background:#e7f4ec;color:#2c6b45}.bp-card.optional .bp-state{background:#eef1f5;color:#59636f}.bp-grid{display:grid;gap:7px;margin-top:10px}.bp-grid>div{background:#fbf9f7;border-radius:10px;padding:8px 9px}.bp-grid small{display:block;color:#81746c;font-size:9.5px;font-weight:800;margin-bottom:2px}.bp-grid b{display:block;font-size:11.5px;line-height:1.4}.bp-grid span{display:block;color:#746861;font-size:9.5px;line-height:1.4;margin-top:2px}.bp-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px}.bp-book-link{display:inline-flex;text-decoration:none;background:#a8560b;color:#fff;border-radius:10px;padding:8px 10px;font-size:10.5px;font-weight:900}.bp-actions .doc-slot{flex:1;min-width:160px}.bp-actions .reservation-doc-actions{margin:0}.bp-empty{text-align:center;padding:28px 10px;color:#81746c;font-weight:800}
  `;
  document.head.append(style);

  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-page="bookings"]');
    if(open){e.preventDefault();e.stopImmediatePropagation();openPlanner();return}
    const filter=e.target.closest('[data-bp-filter]');
    if(filter){setFilter(filter.dataset.bpFilter);render();return}
  },true);

  document.addEventListener('change',e=>{
    if(e.target.matches('[data-bp-done]')){
      const ok=saveDone(e.target.dataset.bpDone,e.target.checked);
      if(!ok)e.target.checked=!e.target.checked;
      render();return;
    }
    if(e.target.id==='bpTypeFilter'){setTypeFilter(e.target.value);render();return}
  });

  document.addEventListener('japan:cloudApplied',()=>setTimeout(()=>{
    const page=document.getElementById('sheetPage');
    if(page?.classList.contains('open')&&(/הזמנות/.test(page.querySelector('.page-head h2')?.textContent||'')||page.dataset.bookingPlanner))render();
  },0));

  window.JapanBookingPlanner={items:ITEMS,render,open:openPlanner};
})();
