/* Japan Trip 2026 · application · v10.0.0
   Deterministic render from TRIP_DATA. No patch modules, DOM observers or runtime source rewriting. */
(() => {
  'use strict';
  const T = window.TRIP_DATA;
  if (!T) throw new Error('TRIP_DATA is missing');
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = n => new Intl.NumberFormat('he-IL',{maximumFractionDigits:2}).format(Number(n)||0);
  const moneyIls = n => new Intl.NumberFormat('he-IL',{maximumFractionDigits:0}).format(Math.round(Number(n)||0))+' ₪';
  const keys = {take:'japanTrip_take_v2',shop:'japanTrip_shop_v2',expenses:'japanTrip_expenses_v1',expSettings:'japanTrip_expense_settings_v1',docs:'japanTrip_docs_v1'};

  const state = {day:0,view:'list',placeCat:'הכול',placeCity:'הכול',placeSearch:'',placeView:'compact',page:null,expFilter:'הכול'};
  const hotelByKey = key => T.hotels.find(h=>h.key===key);

  function parseStorage(key,fallback){try{const v=JSON.parse(localStorage.getItem(key)||'');return v ?? fallback}catch(e){return fallback}}
  function setStorage(key,value){localStorage.setItem(key,JSON.stringify(value));document.dispatchEvent(new CustomEvent('japan:stateChanged'))}
  function listFromStorage(key,defaults,legacy=[]){for(const k of [key,...legacy]){const v=parseStorage(k,null);if(Array.isArray(v)&&v.length)return v.map((x,i)=>typeof x==='string'?{id:Date.now()+i,name:x,done:false}:{id:x.id||Date.now()+i,done:false,...x})}return defaults.map((x,i)=>typeof x==='string'?{id:Date.now()+i,name:x,done:false}:{id:Date.now()+i,done:false,...x})}
  let take = listFromStorage(keys.take,T.takeDefault,['japanTrip_take_v1','takeList']);
  let shop = listFromStorage(keys.shop,T.shoppingDefault,['japanTrip_shop_v1','shoppingList','shopList']);

  function defaultExpSettings(){return {budget:32027,rates:{USD:3,EUR:3.5,JPY:T.rateJpyIls,ILS:1}}}
  function normalizeExpenses(){
    let a=parseStorage(keys.expenses,null);
    if(!Array.isArray(a)||!a.length)a=T.expenseDefaults.map((x,i)=>({id:Date.now()+i,...x}));
    const stale=/Cross Hotel Osaka|remm Tokyo Kyobashi|Richmond Hotel Premier Kyoto Shijo|^מלון טוקיו$|מלון טוקיו · לילה אחרון/i;
    a=a.filter(x=>!stale.test(x.name||''));
    const up=(name,obj)=>{let x=a.find(y=>y.name===name);if(x)Object.assign(x,obj);else a.push({id:Date.now()+a.length,...obj})};
    T.expenseDefaults.filter(x=>x.category==='🏨 לינה').forEach(x=>up(x.name,x));
    localStorage.setItem(keys.expenses,JSON.stringify(a));
    const s=parseStorage(keys.expSettings,null);if(!s)localStorage.setItem(keys.expSettings,JSON.stringify(defaultExpSettings()));
    return a;
  }
  normalizeExpenses();

  function renderDayStrip(){
    const root=$('#dayStrip');root.innerHTML=T.days.map((d,i)=>`<button class="day-chip ${i===state.day?'active':''}" data-day="${i}"><span>${esc(d.dow)}</span><b>${esc(d.date.slice(0,2))}</b><small>${esc(d.date.slice(3))}/26</small></button>`).join('');
    markToday();setTimeout(()=>root.querySelector('.day-chip.active')?.scrollIntoView({inline:'center',block:'nearest'}),0);
  }
  function markToday(){const now=new Date(),iso=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;const start=new Date(T.tripStart+'T00:00:00'), end=new Date('2026-11-17T23:59:59');if(now>=start&&now<=end){const i=Math.floor((now-start)/86400000);const b=$(`[data-day="${i}"]`);if(b&&!b.querySelector('.today-pill'))b.insertAdjacentHTML('beforeend','<em class="today-pill">היום</em>')}}

  function stopHtml(s){
    const guide=s.place&&T.places[s.place]?`<button class="guide-btn" data-place="${esc(s.place)}">ℹ️ מדריך וטיפים</button>`:'';
    return `<div class="stop"><div class="time">${esc(s.time)}</div><div class="rail"><i>${esc(s.icon||'📍')}</i></div><div class="stop-card"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${s.tag?`<span class="trip-tag">${esc(s.tag)}</span>`:''}${guide?`<div class="stop-actions">${guide}</div>`:''}</div></div>`;
  }
  function hotelMiniHtml(key){
    const h=hotelByKey(key);if(!h)return'';
    if(!h.booked)return `<div class="stop"><div class="time">לינה</div><div class="rail"><i>🏨</i></div><div class="stop-card hotel-mini"><h3>${esc(h.name)}<span class="status-badge">טרם הוזמן</span></h3><p>${esc(h.arrival)}</p><div class="stop-actions"><button class="guide-btn" data-page="hotels">פרטים נוספים</button></div></div></div>`;
    return `<div class="stop"><div class="time">לינה</div><div class="rail"><i>🏨</i></div><div class="stop-card hotel-mini"><h3>${esc(h.name)}<span class="status-badge">הוזמן</span></h3><p>📍 ${esc(h.address)}<br>🚉 ${esc(h.arrival)}</p><div class="stop-actions hotel-more"><button class="guide-btn" data-hotel-open="${esc(h.key)}">פרטים נוספים</button></div></div></div>`;
  }
  function eveningHtml(key){const w=T.eveningWalks[key];if(!w)return'';return `<div class="stop evening-stop"><div class="time">19:30</div><div class="rail"><i>🌙</i></div><div class="stop-card"><h3>🌙 המלצה לטיול ערב · ${esc(w.title)}</h3><p>אופציונלי בלבד — התוכנית המקורית של היום נשארת. יציאה מהמלון ב־19:30.</p><div class="stop-actions"><button class="guide-btn" data-evening="${esc(key)}">פתח המלצת ערב</button></div></div></div>`}
  function renderTrip(){
    const d=T.days[state.day],root=$('#tripRoot');
    const map=`<div class="map-view ${state.view==='map'?'active':''}"><div class="route-card"><h3>🗺️ מסלול היום ב-Google Maps</h3>${d.route?`<p>פותח את מסלול היום לפי הסדר שתכננו.</p><a class="primary-link" href="${d.route}" target="_blank" rel="noopener">פתח את מסלול היום ↗</a>`:'<p>ליום הטיסה אין מסלול עירוני.</p>'}</div></div>`;
    root.innerHTML=`<section class="day"><div class="day-heading"><small>${esc(d.city)}</small><h2>${esc(d.title)}</h2><span>${esc(d.dow)} · ${esc(d.date)} · Day ${state.day+1}</span></div><div class="summary">${esc(d.summary)}</div><div class="view-tabs"><button data-view="list" class="${state.view==='list'?'active':''}">📋 רשימה</button><button data-view="map" class="${state.view==='map'?'active':''}">🗺️ מפה</button></div><div class="list-view ${state.view==='map'?'hidden':''}">${d.stops.map(stopHtml).join('')}${d.hotel?hotelMiniHtml(d.hotel):''}${d.evening?eveningHtml(d.evening):''}</div>${map}</section>`;
    renderDayStrip();
  }

  function pageShell(title,body){return `<div class="page-head"><button data-action="close-page">←</button><h2>${title}</h2></div><div class="page-body">${body}</div>`}
  function openPage(name){state.page=name;closeMenu();const p=$('#sheetPage');p.innerHTML=renderPage(name);p.classList.add('open');p.setAttribute('aria-hidden','false');$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===name));afterPageRender(name)}
  function closePage(){state.page=null;const p=$('#sheetPage');p.classList.remove('open');p.setAttribute('aria-hidden','true');p.innerHTML='';$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav==='trip'))}
  function renderPage(name){switch(name){case'flights':return renderFlights();case'bookings':return renderBookings();case'hotels':return renderHotels();case'car':return renderCar();case'take':return renderTake();case'shopping':return renderShopping();case'pocket':return renderPocket();case'places':return renderPlaces();case'expenses':return renderExpenses();default:return pageShell('','')}}
  function afterPageRender(name){if(name==='hotels'||name==='bookings')window.JapanDrive?.renderDocs?.();if(name==='take'||name==='shopping')window.JapanDrive?.mountSyncUI?.();if(name==='places')applyPlaceFilters()}

  function renderFlights(){const f=T.flights;return pageShell('✈️ טיסות',`<div class="ticket-summary"><b>Emirates · Booking ${esc(f.booking)} · ${esc(f.cabin)}</b><div>${esc(f.passengers)} · כבודה לבטן: ${esc(f.checked)} · תיק יד: ${esc(f.hand)}</div></div>${f.legs.map(x=>x.connection?`<div class="connection-card">⏱️ קונקשן: ${esc(x.connection)}</div>`:`<div class="flight-card"><b>${esc(x.date)} · ${esc(x.route)}</b><strong>${esc(x.time)}</strong><span>${esc(x.flight)} · ${esc(x.carrier)} · ${esc(x.terminals)} · ${esc(x.duration)}${x.seats?' · מושבים: '+esc(x.seats):''}</span></div>`).join('')}`)}

  function renderBookings(){return pageShell('🎟️ הזמנות',T.bookings.map(b=>`<div class="book-card" data-doc-key="${esc(b.docKey||'')}"><span class="priority-${b.priority}">${b.priority==='red'?'🔴':b.priority==='green'?'🟢':'🟡'}</span><b>${esc(b.title)}</b><small>${esc(b.status)} · ${esc(b.note)}</small>${b.docKey?'<div class="doc-slot" style="grid-column:2"></div>':''}</div>`).join(''))}

  function detailRow(label,value){return `<div class="detail-row"><span>${label}</span><strong>${esc(value)}</strong></div>`}
  function renderHotels(){
    let body='';T.hotels.forEach(h=>{body+=`<div class="hotel-city" id="hotel-${esc(h.key)}"><h3>${h.city==='Tokyo'?'🗼':h.city==='Kyoto'?'⛩️':h.city==='Osaka'?'🏯':'♨️'} ${esc(h.city)} · ${esc(h.dates)}</h3>`;if(!h.booked){body+=`<div class="hotel-note">⏳ <b>${esc(h.name)}</b><br>${esc(h.arrival)}</div></div>`;return}body+=`<div class="hotel-card" data-doc-key="${esc(h.key)}"><div class="hotel-title"><b>${esc(h.name)}</b><span class="status-badge">${h.payment==='שולם'?'שולם ✅':'הוזמן ✅'}</span></div><div class="hotel-detail-grid">${detailRow('📅 תאריכים',h.dates)}${detailRow('🏷️ הוזמן דרך',h.provider)}${detailRow('🔢 מספר הזמנה',h.booking)}${h.reference?detailRow('🧾 Reference',h.reference):''}${detailRow('🛏️ סוג חדר',h.room)}${detailRow('📐 גודל חדר',h.size)}${detailRow('🛌 מיטה',h.bed)}${detailRow('🍳 ארוחה',h.meal)}${detailRow('💴 מחיר ביין',(h.yenEquivalent?'≈ ':'')+'¥'+fmt(h.jpy))}${detailRow('₪ מחיר בשקלים',(h.payment==='שולם'?'':'≈ ')+'₪'+fmt(h.ils))}${detailRow('💳 מצב תשלום',h.payment)}${detailRow('🟢 ביטול חינם',h.cancellation)}${detailRow('📍 כתובת',h.address)}${detailRow('🚉 הגעה',h.arrival)}</div><div class="hotel-doc-title">📎 אסמכתה</div><div class="doc-slot"></div><div class="hotel-actions"><a class="map-btn" href="${h.map}" target="_blank" rel="noopener">📍 פתח מפה ↗</a></div></div></div>`});return pageShell('🏨 מלונות',body)
  }

  function renderCar(){return pageShell('🚗 השכרת רכב',`<div class="card"><h3>Odawara · 8–10 Nov 2026</h3><p><b>סטטוס:</b> טרם הוזמן.</p><p style="margin-top:7px">התוכנית: איסוף ליד Odawara Station ב־8/11 לאחר ההגעה מ-Shinjuku, שימוש באזור Hakone / Fuji, והחזרה ב־10/11 לפני Shinkansen ל-Kyoto.</p><div class="stop-actions"><a class="map-btn" href="${T.maps.search('Odawara Station car rental')}" target="_blank" rel="noopener">📍 חברות ליד Odawara ↗</a></div></div><div class="notice">הרכב מיועד רק לקטע Hakone / Fuji. בשאר הטיול משתמשים ברכבות ותחבורה ציבורית.</div>`)}

  function renderTake(){return pageShell('🧳 לקחת',`<div class="toolbar"><input id="newTakeItem" placeholder="הוסף פריט..."><button data-action="add-take">＋</button></div><div data-drive-sync-slot></div><div id="takeList">${take.map((x,i)=>takeRow(x,i)).join('')}</div><div class="backup-row"><button data-action="export-data">💾 גיבוי</button><label>📥 שחזור<input type="file" accept=".json" hidden id="importFile"></label></div>`)}
  function takeRow(x,i){return `<div class="take-item"><input type="checkbox" data-take-check="${i}" ${x.done?'checked':''}><span class="grow ${x.done?'done':''}">${esc(x.name||x.text||'')}</span><div class="row-actions"><button data-take-move="${i}" data-dir="-1">↑</button><button data-take-move="${i}" data-dir="1">↓</button><button data-take-delete="${i}">×</button></div></div>`}
  function saveTake(){setStorage(keys.take,take);if(state.page==='take')openPage('take')}

  function renderShopping(){return pageShell('🛍️ קניות',`<div class="toolbar"><input id="newShopItem" placeholder="הוסף פריט לקנייה..."><button data-action="add-shop">＋</button></div><div data-drive-sync-slot></div><div id="shoppingList">${shop.map((x,i)=>shopRow(x,i)).join('')}</div>`)}
  function shopRow(x,i){return `<div class="shopping-item"><div class="shopping-item-head"><input type="checkbox" data-shop-check="${i}" ${x.done?'checked':''}><div class="shopping-copy"><b class="${x.done?'done':''}">${esc(x.name||x.text||'')}</b><small>${esc(x.note||'')}</small></div><div class="row-actions"><button data-shop-move="${i}" data-dir="-1">↑</button><button data-shop-move="${i}" data-dir="1">↓</button><button data-shop-delete="${i}">×</button></div></div>${x.map?`<div class="stop-actions"><a class="map-btn" href="${x.map}" target="_blank" rel="noopener">📍 חנויות / מפה ↗</a></div>`:''}</div>`}
  function saveShop(){setStorage(keys.shop,shop);if(state.page==='shopping')openPage('shopping')}
  function move(a,i,dir){const j=i+dir;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]]}

  function allPlaces(){return Object.entries(T.places).map(([key,p])=>({key,...p}))}
  function placeCategories(){return ['הכול','במסלול','מקדשים','אתרים','מסעדות','שווקים וקניות','מוזיאונים','טבע','תצפיות']}
  function renderPlaces(){
    const cats=placeCategories(), cities=['הכול','Tokyo','Hakone / Fuji','Kyoto','Nara','Osaka'];
    const cards=allPlaces().map(p=>`<article class="place-card" data-place-key="${esc(p.key)}" data-cat="${esc(p.cat)}" data-city="${esc(p.city)}" data-scheduled="${p.schedule?'1':'0'}"><div class="place-title"><span>${esc(p.icon||'📍')}</span><h3>${esc(p.name)}</h3></div><div class="place-location">📍 ${esc(p.city)}</div>${p.rating?`<div class="restaurant-meta"><b>${esc(p.type)}</b> · ⭐ ${Number(p.rating).toFixed(1)} Google · ${fmt(p.reviews)} דירוגים</div>`:''}${p.schedule?`<div class="schedule-badge">🟢 במסלול · ${esc(p.schedule)}</div>`:''}<p>${esc(p.desc)}</p>${p.tip?`<div class="place-tip">💡 ${esc(p.tip)}</div>`:''}<div class="stop-actions"><button class="guide-btn" data-place="${esc(p.key)}">ℹ️ מדריך וטיפים</button></div></article>`).join('');
    return pageShell('📍 מקומות',`<div class="places-toolbar"><div class="filter-row">${cats.map(c=>`<button data-pf-cat="${esc(c)}" class="${state.placeCat===c?'active':''}">${c==='במסלול'?'⭐ ':''}${esc(c)}</button>`).join('')}</div><div class="filter-row">${cities.map(c=>`<button data-pf-city="${esc(c)}" class="${state.placeCity===c?'active':''}">${c==='הכול'?'כל האזורים':esc(c)}</button>`).join('')}</div><input class="search-input" id="placeSearch" type="search" value="${esc(state.placeSearch)}" placeholder="חפש מקום או מסעדה..."><div class="segmented"><button data-place-view="compact" class="${state.placeView==='compact'?'active':''}">☰ תקציר</button><button data-place-view="detail" class="${state.placeView==='detail'?'active':''}">▤ מפורט</button></div></div><div class="places-grid ${state.placeView==='compact'?'compact':''}" id="placesGrid">${cards}</div>`)
  }
  function applyPlaceFilters(){const q=state.placeSearch.trim().toLowerCase();$$('#placesGrid .place-card').forEach(c=>{const cat=c.dataset.cat||'',city=c.dataset.city||'',scheduled=c.dataset.scheduled==='1',text=c.textContent.toLowerCase();const okCat=state.placeCat==='הכול'||(state.placeCat==='במסלול'?scheduled:cat===state.placeCat),okCity=state.placeCity==='הכול'||city.includes(state.placeCity),okQ=!q||text.includes(q);c.classList.toggle('hidden',!(okCat&&okCity&&okQ))})}

  function renderPocket(){return pageShell('🧰 כלים',`<div class="tool-card"><h3>💴 המרת כסף</h3><p>JPY ⇄ ILS. שער בסיס: ¥1 = ₪${T.rateJpyIls}.</p><div class="rate-grid"><div class="field"><label>שקלים ₪</label><input id="ilsAmount" type="number" inputmode="decimal" placeholder="100"></div><div class="field"><label>ין ¥</label><input id="jpyAmount" type="number" inputmode="decimal" placeholder="5000"></div></div><div class="tool-result" id="moneyResult">הכנס סכום להמרה</div></div><div class="tool-card"><h3>🌐 תרגום מהיר</h3><p>כתוב בעברית או באנגלית ופתח תרגום ליפנית.</p><textarea id="translateText" rows="4" placeholder="לדוגמה: בלי דג נא בבקשה"></textarea><div class="stop-actions"><button class="small-btn" data-action="translate">🇯🇵 תרגם ליפנית</button><button class="small-btn" data-action="clear-translate">נקה</button></div><div class="quick-phrases">${['בלי דג נא בבקשה','בלי פירות ים בבקשה','איפה תחנת הרכבת?','אפשר לשלם בכרטיס אשראי?'].map(x=>`<button data-phrase="${esc(x)}">${esc(x)}</button>`).join('')}</div></div><div class="tool-card"><h3>🔊 הגייה יפנית</h3><p>הדבק משפט ביפנית והשמע אותו בקול יפני באמצעות מנוע הדיבור של הטלפון.</p><textarea id="jpSpeakText" rows="3" placeholder="ありがとうございます"></textarea><button class="secondary-wide" data-action="speak">▶️ השמע ביפנית</button></div><div class="tool-card"><h3>🚇 רכבות ותחבורה</h3>${T.trains.map(x=>`<div class="notice"><b>${esc(x[0])}</b><br>${esc(x[1])}</div>`).join('')}<p><b>כלל:</b> Google Maps קובע את המסלול בפועל; בודקים קו, רציף ו-Exit בזמן אמת. Suica/PASMO מתאימים לרוב הנסיעות העירוניות.</p><button class="secondary-wide" data-action="train-cheat">🗺️ פתח Tokyo Train Cheat Sheet</button></div>`)}

  function expSettings(){const s=parseStorage(keys.expSettings,null)||defaultExpSettings();s.rates={...defaultExpSettings().rates,...(s.rates||{})};return s}
  function expItems(){return parseStorage(keys.expenses,[])}
  function expIls(x,s){return (Number(x.amount)||0)*(Number(s.rates[x.currency])||1)}
  function renderExpenses(){const items=expItems(),s=expSettings(),active=items.filter(x=>x.included!==false),expected=active.reduce((a,x)=>a+expIls(x,s),0),paid=active.filter(x=>x.status==='שולם').reduce((a,x)=>a+expIls(x,s),0),remaining=s.budget-expected,pct=s.budget?Math.min(100,Math.max(0,expected/s.budget*100)):0,cats=['הכול',...new Set(items.map(x=>x.category))],shown=state.expFilter==='הכול'?items:items.filter(x=>x.category===state.expFilter);return pageShell('💰 הוצאות ותקציב',`<div class="expense-summary"><div class="kpi"><span>תקציב כולל</span><b>${moneyIls(s.budget)}</b></div><div class="kpi"><span>הוצאות צפויות</span><b>${moneyIls(expected)}</b></div><div class="kpi"><span>שולם בפועל</span><b>${moneyIls(paid)}</b></div><div class="kpi"><span>נותר בתקציב</span><b>${moneyIls(remaining)}</b></div><div class="kpi wide"><span>ניצול תקציב · ${Math.round(pct)}%</span><div class="progress"><i style="width:${pct}%"></i></div></div></div><div class="card"><h3>שערים ותקציב</h3><div class="form-grid"><div class="field"><label>תקציב ₪</label><input id="budgetValue" type="number" value="${s.budget}"></div><div class="field"><label>JPY → ILS</label><input id="rateJPY" type="number" step="0.000001" value="${s.rates.JPY}"></div><div class="field"><label>USD → ILS</label><input id="rateUSD" type="number" step="0.01" value="${s.rates.USD}"></div><div class="field"><label>EUR → ILS</label><input id="rateEUR" type="number" step="0.01" value="${s.rates.EUR}"></div></div><button class="primary-button" data-action="save-exp-settings" style="margin-top:9px">שמור</button></div><div class="card"><h3>＋ הוסף הוצאה</h3><div class="form-grid"><div class="field full"><label>תיאור</label><input id="expName"></div><div class="field"><label>סכום</label><input id="expAmount" type="number" inputmode="decimal"></div><div class="field"><label>מטבע</label><select id="expCurrency"><option>ILS</option><option>JPY</option><option>USD</option><option>EUR</option></select></div><div class="field"><label>סטטוס</label><select id="expStatus"><option>שולם</option><option>מוזמן</option><option selected>הערכה</option></select></div><div class="field"><label>קטגוריה</label><select id="expCategory">${['🍜 אוכל','🛍️ קניות','🎟️ אטרקציות','🚗 תחבורה','🏨 לינה','✈️ טיסות','📱 תקשורת','🛡️ ביטוח','📦 אחר'].map(c=>`<option>${c}</option>`).join('')}</select></div><div class="field full"><label>הערה</label><input id="expNote"></div></div><button class="primary-button" data-action="add-expense" style="margin-top:9px">הוסף</button></div><div class="filter-row">${cats.map(c=>`<button data-exp-filter="${esc(c)}" class="${state.expFilter===c?'active':''}">${esc(c)}</button>`).join('')}</div>${shown.map(x=>`<div class="expense-card ${x.included===false?'alt':''}" data-exp-id="${x.id}"><div class="expense-head"><div class="grow"><b>${esc(x.name)}</b><div class="expense-meta">${esc(x.category)} · ${esc(x.status)} · ${esc(x.payment||'')}</div></div><strong>${x.currency==='ILS'?'₪':x.currency==='JPY'?'¥':x.currency==='USD'?'$':'€'}${fmt(x.amount)}</strong></div>${x.note?`<div class="expense-note">${esc(x.note)}</div>`:''}<div class="stop-actions"><label style="font-size:10px"><input type="checkbox" data-exp-include="${x.id}" ${x.included!==false?'checked':''}> כלול בתקציב</label><button class="small-btn" data-exp-delete="${x.id}">🗑️</button></div></div>`).join('')}`)}

  function openInfo(key){const p=T.places[key];if(!p)return;$('#infoIcon').textContent=p.icon||'📍';$('#infoTitle').textContent=p.name;$('#infoMeta').textContent=[p.city,p.cat,p.schedule?'במסלול · '+p.schedule:'',p.rating?'⭐ '+Number(p.rating).toFixed(1)+' Google · '+fmt(p.reviews)+' דירוגים':''].filter(Boolean).join(' · ');$('#infoDesc').textContent=p.desc;const tip=$('#infoTip');tip.textContent=p.tip?'💡 '+p.tip:'';tip.classList.toggle('hidden',!p.tip);$('#infoMap').href=p.map;showModal('#infoModal')}
  function openEvening(key){const w=T.eveningWalks[key];if(!w)return;$('#eveningTitle').textContent='🌙 '+w.title;$('#eveningDuration').textContent='יציאה מהמלון 19:30 · '+w.duration;$('#eveningOut').textContent=w.out;$('#eveningStops').innerHTML=w.stops.map((s,i)=>`<div class="evening-point"><b>${i+1}</b><div><strong>${esc(s[0])}</strong><div style="font-size:12px;color:#555">${esc(s[1])}</div></div></div>`).join('');$('#eveningDinner').textContent=w.dinner;$('#eveningBack').textContent=w.back;$('#eveningMap').href=w.map;const ib=$('#eveningImageButton');ib.hidden=!w.image;ib.dataset.image=w.image||'';showModal('#eveningModal')}
  function showModal(sel){const m=$(sel);m.classList.add('open');m.setAttribute('aria-hidden','false')}
  function closeModal(sel){const m=$(sel);m.classList.remove('open');m.setAttribute('aria-hidden','true')}
  function showImage(src){$('#overlayImage').src=src;$('#imageOverlay').classList.add('open');$('#imageOverlay').setAttribute('aria-hidden','false')}
  function closeImage(){$('#imageOverlay').classList.remove('open');$('#imageOverlay').setAttribute('aria-hidden','true');$('#overlayImage').src=''}

  function openMenu(){$('#sideMenu').classList.add('open');$('#sideMenu').setAttribute('aria-hidden','false');$('#overlay').classList.add('open')}
  function closeMenu(){$('#sideMenu').classList.remove('open');$('#sideMenu').setAttribute('aria-hidden','true');$('#overlay').classList.remove('open')}
  function openHotel(key){openPage('hotels');setTimeout(()=>document.getElementById('hotel-'+key)?.scrollIntoView({behavior:'smooth',block:'start'}),60)}

  function exportData(){const payload={schema:10,exportedAt:new Date().toISOString(),take,shop,docs:parseStorage(keys.docs,{}),expenses:expItems(),expenseSettings:expSettings()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='JapanTrip-Backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
  async function importData(file){if(!file)return;try{const j=JSON.parse(await file.text());if(Array.isArray(j.take)){take=j.take;setStorage(keys.take,take)}if(Array.isArray(j.shop)){shop=j.shop;setStorage(keys.shop,shop)}if(j.docs&&typeof j.docs==='object')setStorage(keys.docs,j.docs);if(Array.isArray(j.expenses))setStorage(keys.expenses,j.expenses);if(j.expenseSettings)setStorage(keys.expSettings,j.expenseSettings);alert('השחזור הושלם');openPage('take')}catch(e){alert('קובץ הגיבוי אינו תקין')}}

  function currentTripDay(){const now=new Date(),start=new Date(T.tripStart+'T00:00:00'),last=new Date('2026-11-17T23:59:59');if(now<start||now>last)return 0;return Math.max(0,Math.min(T.days.length-1,Math.floor((now-start)/86400000)))}

  document.addEventListener('click',e=>{
    const b=e.target.closest('button,a,label');if(!b)return;
    if(b.dataset.day!==undefined){state.day=Number(b.dataset.day);state.view='list';renderTrip();scrollTo({top:0,behavior:'smooth'});return}
    if(b.dataset.view){state.view=b.dataset.view;renderTrip();return}
    if(b.dataset.page){openPage(b.dataset.page);return}
    if(b.dataset.nav==='trip'){closePage();renderTrip();return}
    if(b.dataset.action==='menu'){openMenu();return}
    if(b.dataset.action==='close-menu'){closeMenu();return}
    if(b.dataset.action==='close-page'){closePage();return}
    if(b.dataset.place){openInfo(b.dataset.place);return}
    if(b.dataset.evening){openEvening(b.dataset.evening);return}
    if(b.dataset.hotelOpen){openHotel(b.dataset.hotelOpen);return}
    if(b.dataset.action==='close-info'){closeModal('#infoModal');return}
    if(b.dataset.action==='close-evening'){closeModal('#eveningModal');return}
    if(b.dataset.action==='close-image'){closeImage();return}
    if(b.id==='eveningImageButton'&&b.dataset.image){showImage(b.dataset.image);return}
    if(b.dataset.pfCat!==undefined){state.placeCat=b.dataset.pfCat;openPage('places');return}
    if(b.dataset.pfCity!==undefined){state.placeCity=b.dataset.pfCity;openPage('places');return}
    if(b.dataset.placeView){state.placeView=b.dataset.placeView;openPage('places');return}
    if(b.dataset.action==='add-take'){const v=$('#newTakeItem')?.value.trim();if(v){take.push({id:Date.now(),name:v,done:false});saveTake()}return}
    if(b.dataset.takeMove!==undefined){const i=Number(b.dataset.takeMove);move(take,i,Number(b.dataset.dir));saveTake();return}
    if(b.dataset.takeDelete!==undefined){take.splice(Number(b.dataset.takeDelete),1);saveTake();return}
    if(b.dataset.action==='add-shop'){const v=$('#newShopItem')?.value.trim();if(v){shop.push({id:Date.now(),name:v,done:false,note:'',map:''});saveShop()}return}
    if(b.dataset.shopMove!==undefined){const i=Number(b.dataset.shopMove);move(shop,i,Number(b.dataset.dir));saveShop();return}
    if(b.dataset.shopDelete!==undefined){shop.splice(Number(b.dataset.shopDelete),1);saveShop();return}
    if(b.dataset.action==='export-data'){exportData();return}
    if(b.matches('label')&&b.querySelector('#importFile'))setTimeout(()=>$('#importFile')?.click(),0);
    if(b.dataset.phrase){$('#translateText').value=b.dataset.phrase;return}
    if(b.dataset.action==='translate'){const v=$('#translateText')?.value.trim();if(v)window.open('https://translate.google.com/?sl=auto&tl=ja&text='+encodeURIComponent(v),'_blank','noopener');return}
    if(b.dataset.action==='clear-translate'){$('#translateText').value='';return}
    if(b.dataset.action==='speak'){const v=$('#jpSpeakText')?.value.trim();if(v&&'speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(v);u.lang='ja-JP';speechSynthesis.speak(u)}return}
    if(b.dataset.action==='train-cheat'){showImage('assets/train-infographic.svg');return}
    if(b.dataset.action==='save-exp-settings'){const s=expSettings();s.budget=Number($('#budgetValue').value)||0;s.rates.JPY=Number($('#rateJPY').value)||T.rateJpyIls;s.rates.USD=Number($('#rateUSD').value)||3;s.rates.EUR=Number($('#rateEUR').value)||3.5;setStorage(keys.expSettings,s);openPage('expenses');return}
    if(b.dataset.action==='add-expense'){const name=$('#expName').value.trim(),amount=Number($('#expAmount').value);if(!name||!amount)return;const a=expItems();a.push({id:Date.now(),name,status:$('#expStatus').value,payment:'אשראי',currency:$('#expCurrency').value,amount,category:$('#expCategory').value,included:true,note:$('#expNote').value.trim()});setStorage(keys.expenses,a);openPage('expenses');return}
    if(b.dataset.expFilter!==undefined){state.expFilter=b.dataset.expFilter;openPage('expenses');return}
    if(b.dataset.expDelete!==undefined){const a=expItems().filter(x=>String(x.id)!==String(b.dataset.expDelete));setStorage(keys.expenses,a);openPage('expenses');return}
  });

  document.addEventListener('change',e=>{
    if(e.target.matches('[data-take-check]')){take[Number(e.target.dataset.takeCheck)].done=e.target.checked;saveTake();return}
    if(e.target.matches('[data-shop-check]')){shop[Number(e.target.dataset.shopCheck)].done=e.target.checked;saveShop();return}
    if(e.target.matches('[data-exp-include]')){const a=expItems(),x=a.find(v=>String(v.id)===String(e.target.dataset.expInclude));if(x)x.included=e.target.checked;setStorage(keys.expenses,a);openPage('expenses');return}
    if(e.target.id==='importFile'){importData(e.target.files?.[0]);return}
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='placeSearch'){state.placeSearch=e.target.value;applyPlaceFilters();return}
    if(e.target.id==='ilsAmount'){const v=Number(e.target.value);$('#jpyAmount').value=v?Math.round(v/T.rateJpyIls):'';$('#moneyResult').textContent=v?`₪${fmt(v)} ≈ ¥${fmt(v/T.rateJpyIls)}`:'הכנס סכום להמרה';return}
    if(e.target.id==='jpyAmount'){const v=Number(e.target.value);$('#ilsAmount').value=v?(v*T.rateJpyIls).toFixed(2):'';$('#moneyResult').textContent=v?`¥${fmt(v)} ≈ ₪${fmt(v*T.rateJpyIls)}`:'הכנס סכום להמרה';return}
  });
  $('#overlay').addEventListener('click',closeMenu);
  $('#infoModal').addEventListener('click',e=>{if(e.target.id==='infoModal')closeModal('#infoModal')});
  $('#eveningModal').addEventListener('click',e=>{if(e.target.id==='eveningModal')closeModal('#eveningModal')});
  $('#imageOverlay').addEventListener('click',e=>{if(e.target.id==='imageOverlay')closeImage()});
  $('#menuButton').addEventListener('click',openMenu);

  state.day=currentTripDay();renderTrip();document.documentElement.dataset.appReady='v10.0.0';
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').then(r=>r.update()).catch(console.warn));

  window.JapanTripApp={openPage,closePage,renderTrip,renderHotels,renderBookings,keys};
})();
