/* Japan Trip 2026 · station exit guides · v10.0.4
   Offline-friendly station wayfinding tied to the itinerary. */
(() => {
  'use strict';
  const T=window.TRIP_DATA;if(!T)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const STATIONS={
    shinjuku:{name:'Shinjuku Station',icon:'🚉',area:'Tokyo',note:'תחנה ענקית. לפני שיוצאים מהשער, בודקים לאיזה צד של התחנה היעד נמצא.',exits:[
      ['West / 西口','Tokyo Metropolitan Government Building, Keio Plaza ואזור גורדי השחקים במערב.'],
      ['East / 東口','Kabukicho, Isetan ואזור חיי הלילה והקניות במזרח.'],
      ['South / 南口','JR Kyushu Hotel Blossom Shinjuku והצד הדרומי של התחנה.'],
      ['New South / 新南口','NEWoMan, Busta Shinjuku ואוטובוסים בין־עירוניים/לשדה.']
    ],route:['המלון שלנו: South Exit · כ־3 דקות.','Tokyo Metropolitan Government Building: West side.','Kabukicho: East side.']},
    shibuya:{name:'Shibuya Station',icon:'🚦',area:'Tokyo',note:'התחנה עוברת שינויים ובנייה. לשלטים בזמן אמת יש עדיפות על כל מדריך שמור.',exits:[
      ['Hachiko Gate / ハチ公改札','הכיוון הקלאסי ל-Hachiko Square ול-Scramble Crossing.'],
      ['South Gate / 南改札','חלופה טובה ל-Scramble Crossing; JR East ממליצה עליה כש-Hachiko Gate עמוסה.'],
      ['Central / East side','Shibuya Scramble Square והאזור המזרחי של התחנה.'],
      ['New South / 新南改札','הצד הדרומי של Shibuya; לא לבחור בו אוטומטית ל-Crossing.']
    ],route:['Shibuya Crossing: Hachiko Gate; אם עמוס מאוד — South Gate והליכה קצרה.']},
    tokyo:{name:'Tokyo Station',icon:'🚄',area:'Tokyo',note:'הכלל החשוב: Marunouchi = מערב, Yaesu = מזרח. המעבר בתוך התחנה ארוך, לכן בוחרים צד לפני היציאה.',exits:[
      ['Marunouchi Central / South','Marunouchi, חזית התחנה והכיוון ל-Imperial Palace.'],
      ['Nihombashi Exit / 日本橋口','Hotel Metropolitan Tokyo Marunouchi / Sapia Tower — היציאה שלנו ללילה האחרון.'],
      ['Yaesu Central / South','הצד המזרחי, אוטובוסים ומרכזי קניות באזור Yaesu.'],
      ['Shinkansen','עוקבים קודם אחרי שלטי Shinkansen ורק אחר כך אחרי היציאה המתאימה.']
    ],route:['Tokyo Station / Marunouchi: צא לצד Marunouchi.','Hotel Metropolitan Tokyo Marunouchi: Nihombashi Exit · כ־1 דקה.']},
    kyoto:{name:'Kyoto Station',icon:'⛩️',area:'Kyoto',note:'התחנה מחולקת בעיקר לצד Karasuma/Central בצפון ול-Hachijo בדרום.',exits:[
      ['Central Gate / Karasuma side','Kyoto Tower, תחנות האוטובוס העירוניות, PORTA והיציאה לכיוון מרכז Kyoto.'],
      ['Hachijo Gate / Hachijo East','הצד הדרומי של התחנה; שימושי ל-Shinkansen ולחלק מאוטובוסי השדה.'],
      ['West Gate','גישה נוחה ל-JR Kyoto Isetan ולמעברים בתוך בניין התחנה.'],
      ['Shinkansen gates','בהגעה ב-Shinkansen בודקים אם היעד בצפון (Central/Karasuma) או בדרום (Hachijo) לפני היציאה.']
    ],route:['לרוב האתרים בעיר והאוטובוסים: Central / Karasuma side.']},
    osaka:{name:'Osaka / Umeda Station',icon:'🏙️',area:'Osaka',note:'JR Osaka, Hankyu/Hanshin Umeda והמטרו מחוברים במערכת גדולה. שם ה-Gate חשוב יותר מהמילה “Umeda” בלבד.',exits:[
      ['Midosuji North Gate','Hankyu Osaka-Umeda, Yodobashi Umeda והצד הצפון־מזרחי.'],
      ['South / Central side','Daimaru Umeda, Hotel Granvia Osaka והצד הדרומי/מרכזי.'],
      ['West Gate','גישה לצד המערבי ולכיוון Kitashinchi/Yotsubashi.'],
      ['Umekita Underground Gate','Grand Green Osaka והאזור החדש בצפון־מערב.']
    ],route:['ל-Umeda/Yodobashi: Midosuji North Gate הוא נקודת ייחוס טובה.']},
    odawara:{name:'Odawara Station',icon:'🚗',area:'Hakone / Fuji',note:'תחנה קטנה יותר, אבל ביום איסוף הרכב חשוב לצאת בצד הנכון עם המזוודות.',exits:[
      ['West Exit / Shinkansen side','Nippon Rent A Car — הסניף שהוזמן נמצא כדקת הליכה מה-West Exit בצד ה-Shinkansen.'],
      ['East Exit','הצד העירוני השני; לא היציאה שלנו לאיסוף הרכב.']
    ],route:['8/11 · איסוף רכב: West Exit / Shinkansen side.','10/11 · החזרת רכב: אותו סניף ואותו צד של התחנה.']}
  };

  const PLACE_HINTS={
    'Shinjuku':{station:'shinjuku',text:'Shinjuku Station: בחר יציאה לפי היעד — West לגורדי השחקים, East ל-Kabukicho, South למלון.'},
    'Tokyo Metropolitan Government Building Observatory':{station:'shinjuku',text:'Shinjuku Station · West side → Tokyo Metropolitan Government Building.'},
    'Shibuya Crossing':{station:'shibuya',text:'Shibuya Station · Hachiko Gate; אם עמוס מאוד, JR ממליצה להשתמש ב-South Gate ולהמשיך ברגל.'},
    'Tokyo Station / Marunouchi':{station:'tokyo',text:'Tokyo Station · Marunouchi side. לא לצאת בטעות לצד Yaesu.'},
    'Imperial Palace':{station:'tokyo',text:'אם מגיעים דרך Tokyo Station: בוחרים את צד Marunouchi לכיוון הארמון.'}
  };

  function stationButton(id){return `<button class="station-guide-link" data-station-guide="${id}">מדריך התחנה</button>`}
  function hintHtml(h){return `<div class="station-exit-hint"><b>🚉 איזו יציאה?</b><span>${esc(h.text)}</span>${stationButton(h.station)}</div>`}
  function rentalHint(){return {station:'odawara',text:'Odawara Station · West Exit / צד ה-Shinkansen → Nippon Rent A Car, כדקת הליכה.'}}

  function enhanceTrip(){
    document.querySelectorAll('#tripRoot .station-exit-hint').forEach(x=>x.remove());
    document.querySelectorAll('#tripRoot .stop').forEach(stop=>{
      let hint=null;
      const guide=stop.querySelector('[data-place]');
      if(guide&&PLACE_HINTS[guide.dataset.place])hint=PLACE_HINTS[guide.dataset.place];
      const title=stop.querySelector('h3')?.textContent||'';
      if(!hint&&/Nippon Rent A Car|איסוף רכב|החזרת רכב/.test(title))hint=rentalHint();
      if(!hint)return;
      const card=stop.querySelector('.stop-card');if(!card)return;
      const actions=card.querySelector('.stop-actions');
      if(actions)actions.insertAdjacentHTML('beforebegin',hintHtml(hint));else card.insertAdjacentHTML('beforeend',hintHtml(hint));
    });
  }

  function stationCard(id,s){return `<details class="station-guide-card" id="station-${id}"><summary><span>${s.icon}</span><div><b>${esc(s.name)}</b><small>${esc(s.area)}</small></div><em>פתח</em></summary><div class="station-guide-body"><p>${esc(s.note)}</p><div class="station-exits">${s.exits.map(x=>`<div><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div>`).join('')}</div>${s.route?.length?`<div class="station-route"><b>⭐ לפי המסלול שלנו</b>${s.route.map(x=>`<span>• ${esc(x)}</span>`).join('')}</div>`:''}</div></details>`}

  function enhancePocket(){
    const body=document.querySelector('#sheetPage.open .page-body');if(!body||document.getElementById('stationExitGuides'))return;
    const section=document.createElement('section');section.id='stationExitGuides';section.className='station-guides-section';
    section.innerHTML=`<div class="tool-card station-guide-intro"><h3>🚉 מדריך תחנות ויציאות</h3><p>מדריך אופליין קצר לתחנות שנפגוש בטיול. המטרה: לדעת מראש לאיזה Exit ללכת ולא לצאת בצד הלא נכון של תחנה גדולה.</p><div class="station-guide-chips">${Object.entries(STATIONS).map(([id,s])=>`<button data-station-guide="${id}">${s.icon} ${esc(s.name.replace(' Station',''))}</button>`).join('')}</div><small>⚠️ שילוט, עבודות בנייה ויציאות יכולים להשתנות. בזמן אמת נותנים עדיפות לשלטי התחנה ול-Google Maps.</small></div>${Object.entries(STATIONS).map(([id,s])=>stationCard(id,s)).join('')}`;
    const transport=[...body.querySelectorAll('.tool-card')].find(x=>/רכבות ותחבורה/.test(x.textContent));
    if(transport)transport.insertAdjacentElement('afterend',section);else body.append(section);
  }

  function enhanceInfo(key){
    const modal=document.getElementById('infoModal');if(!modal)return;
    modal.querySelector('#infoStationHint')?.remove();
    const h=PLACE_HINTS[key];if(!h)return;
    const node=document.createElement('div');node.id='infoStationHint';node.className='station-exit-hint modal-station-hint';node.innerHTML=`<b>🚉 איזו יציאה?</b><span>${esc(h.text)}</span>${stationButton(h.station)}`;
    const tip=modal.querySelector('#infoTip');tip?.before(node);
  }

  function openStation(id){
    if(!STATIONS[id])return;
    const pocket=document.querySelector('[data-page="pocket"]');
    if(!document.querySelector('#sheetPage.open #stationExitGuides'))pocket?.click();
    setTimeout(()=>{
      enhancePocket();
      const el=document.getElementById('station-'+id);if(!el)return;
      el.open=true;el.scrollIntoView({behavior:'smooth',block:'start'});
    },40);
  }

  document.addEventListener('click',e=>{
    const el=e.target.closest('button,a,label');if(!el)return;
    if(el.dataset.stationGuide){e.preventDefault();openStation(el.dataset.stationGuide);return;}
    if(el.dataset.page==='pocket'){setTimeout(enhancePocket,0);return;}
    if(el.dataset.day!==undefined||el.dataset.nav==='trip'){setTimeout(enhanceTrip,0);return;}
    if(el.dataset.place){const key=el.dataset.place;setTimeout(()=>enhanceInfo(key),0);return;}
  });

  T.version='10.0.4';
  document.documentElement.dataset.appReady='v10.0.4';
  enhanceTrip();
  if(document.querySelector('#sheetPage.open'))enhancePocket();
  window.JapanStationGuides={stations:STATIONS,open:openStation,enhanceTrip,enhancePocket};
})();