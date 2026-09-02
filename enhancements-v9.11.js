// Japan Trip v9.11 enhancements
(function(){
  'use strict';
  const VERSION='v9.11';

  function addStyles(){
    if(document.getElementById('v911-css')) return;
    const s=document.createElement('style');s.id='v911-css';s.textContent=`
      .exp-card.exp-paid{background:#eefaf5!important;border-color:#b9e6d3!important;box-shadow:0 2px 10px rgba(16,185,129,.08)!important}
      .exp-card.exp-paid h4:before{content:'✓ ';color:#059669;font-weight:900}
      .exp-actions .del{display:none!important}
      .exp-edit-buttons .exp-delete-inside{background:#fff1f1;color:#b42318;border:1px solid #ffd0d0;flex:0 0 auto}
      .exp-hero{background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:15px;margin:8px 0 12px;box-shadow:0 3px 12px rgba(0,0,0,.04)}
      .exp-hero-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-end}.exp-hero-main small,.exp-hero-remain small{display:block;color:#6b7280;font-size:11px;margin-bottom:3px}.exp-hero-main b{font-size:25px}.exp-hero-remain{text-align:left}.exp-hero-remain b{font-size:17px;color:#087f5b}.exp-hero .exp-progress{height:10px;margin:12px 0 7px}.exp-hero .exp-progress i{background:linear-gradient(90deg,#6d5ce7,#14b8a6)}
      .exp-hero-sub{display:flex;justify-content:space-between;color:#6b7280;font-size:11px}.exp-mini-kpis{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}.exp-mini{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:10px}.exp-mini span{display:block;color:#6b7280;font-size:10px}.exp-mini b{font-size:15px}
      .exp-cat-summary{background:#fff;border:1px solid #e5e7eb;border-radius:16px;margin:10px 0;padding:5px 12px}.exp-cat-summary summary{cursor:pointer;padding:9px 0;font-weight:800;font-size:13px}.exp-cat-row{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid #f0f0f0;font-size:12px}.exp-cat-row b{white-space:nowrap}
      .osm-choice{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}.osm-choice button,.osm-choice a{border:1px solid #dedede;border-radius:10px;padding:10px 7px;text-align:center;text-decoration:none;font-size:11px;font-weight:850;background:#fff;color:#4b5563}.osm-choice .google-choice{background:#e98824;color:#fff;border-color:#e98824}.osm-choice .osm-choice-btn{background:#eef8f0;color:#226b35;border-color:#cce6d2}.osm-map-wrap{display:none;margin-top:10px}.osm-map-wrap.open{display:block}.osm-map{height:330px;border-radius:13px;overflow:hidden;background:#eef1ed;position:relative}.osm-loading{height:100%;display:grid;place-items:center;text-align:center;padding:20px;color:#68736a;font-size:12px}.osm-note{font-size:10px;color:#7b817c;margin-top:6px;text-align:center}.osm-number{background:#226b35;color:#fff;border:2px solid #fff;border-radius:50%;width:25px;height:25px;display:grid;place-items:center;font-size:11px;font-weight:900;box-shadow:0 1px 4px #0005}
    `;document.head.appendChild(s);
  }

  function money(n){return new Intl.NumberFormat('he-IL',{maximumFractionDigits:0}).format(Math.round(n||0))+' ₪';}
  function decorateExpenses(){
    const root=document.getElementById('expRoot');if(!root)return;
    root.querySelectorAll('.exp-card').forEach(card=>{
      const meta=card.querySelector('.exp-meta');
      card.classList.toggle('exp-paid',!!meta&&meta.textContent.includes('שולם'));
    });
    if(typeof expEditing!=='undefined'&&expEditing!=null){
      const btns=root.querySelector('.exp-edit-buttons');
      if(btns&&!btns.querySelector('.exp-delete-inside')){
        const b=document.createElement('button');b.className='exp-delete-inside';b.textContent='🗑️ מחק';
        b.onclick=()=>{if(confirm('למחוק את ההוצאה?')) expDelete(expEditing);};btns.appendChild(b);
      }
    }
    const old=root.querySelector('.exp-summary');
    if(old&&!root.querySelector('.exp-hero')&&typeof expLoad==='function'&&typeof expSettings==='function'&&typeof expIls==='function'){
      const items=expLoad(),st=expSettings(),active=items.filter(x=>x.included!==false);
      const expected=active.reduce((a,x)=>a+expIls(x,st),0),paid=active.filter(x=>x.status==='שולם').reduce((a,x)=>a+expIls(x,st),0),remain=st.budget-expected,pct=st.budget?Math.min(100,Math.max(0,expected/st.budget*100)):0;
      const hero=document.createElement('div');hero.innerHTML=`<div class="exp-hero"><div class="exp-hero-top"><div class="exp-hero-main"><small>הוצאות צפויות</small><b>${money(expected)}</b><small>מתוך ${money(st.budget)}</small></div><div class="exp-hero-remain"><small>נותר בתקציב</small><b>${money(remain)}</b></div></div><div class="exp-progress"><i style="width:${pct}%"></i></div><div class="exp-hero-sub"><b>${Math.round(pct)}% מהתקציב</b><span>${money(st.budget)}</span></div></div><div class="exp-mini-kpis"><div class="exp-mini"><span>✓ שולם בפועל</span><b>${money(paid)}</b></div><div class="exp-mini"><span>עוד צפוי לתשלום</span><b>${money(Math.max(0,expected-paid))}</b></div></div>`;
      old.replaceWith(...hero.children);
      const cats={};active.forEach(x=>{cats[x.category]=(cats[x.category]||0)+expIls(x,st)});
      const add=root.querySelector('.exp-add');
      if(add){const d=document.createElement('details');d.className='exp-cat-summary';d.innerHTML='<summary>סיכום לפי קטגוריות</summary>'+Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([c,v])=>`<div class="exp-cat-row"><span>${c}</span><b>${money(v)}</b></div>`).join('');add.before(d);}
    }
  }

  function loadLeaflet(){return new Promise((resolve,reject)=>{
    if(window.L)return resolve();
    if(!document.querySelector('link[data-leaflet]')){const l=document.createElement('link');l.rel='stylesheet';l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';l.dataset.leaflet='1';document.head.appendChild(l);}
    const old=document.querySelector('script[data-leaflet]');if(old){old.addEventListener('load',resolve,{once:true});return;}
    const s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';s.dataset.leaflet='1';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
  });}
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function geocode(q){
    const key='osmgeo:'+q;try{const c=JSON.parse(localStorage.getItem(key));if(c&&c.lat)return c;}catch(e){}
    const u='https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=en&q='+encodeURIComponent(q+', Japan');
    const r=await fetch(u,{headers:{'Accept':'application/json'}});if(!r.ok)throw new Error('geocode');const a=await r.json();if(!a[0])return null;
    const p={lat:+a[0].lat,lon:+a[0].lon,name:a[0].display_name};try{localStorage.setItem(key,JSON.stringify(p));}catch(e){}await sleep(1050);return p;
  }
  async function showOsm(card){
    const wrap=card.querySelector('.osm-map-wrap');if(!wrap)return;wrap.classList.toggle('open');if(!wrap.classList.contains('open')||wrap.dataset.ready)return;
    const mapEl=wrap.querySelector('.osm-map'),names=[...card.querySelectorAll('ol li')].map(x=>x.textContent.trim()).filter(Boolean);mapEl.innerHTML='<div class="osm-loading">טוען OpenStreetMap באנגלית…</div>';
    try{await loadLeaflet();const pts=[];for(const n of names){const p=await geocode(n);if(p)pts.push({...p,label:n});}
      if(!pts.length)throw new Error('no points');mapEl.innerHTML='';const map=L.map(mapEl,{zoomControl:true});L.tileLayer('https://tile.openstreetmap.jp/styles/osm-bright-en/512/{z}/{x}/{y}.png',{maxZoom:20,tileSize:512,zoomOffset:-1,attribution:'© OpenStreetMap contributors · OpenStreetMap Japan'}).addTo(map);
      pts.forEach((p,i)=>L.marker([p.lat,p.lon],{icon:L.divIcon({className:'',html:`<div class="osm-number">${i+1}</div>`,iconSize:[25,25],iconAnchor:[12,12]})}).addTo(map).bindPopup(`<b>${i+1}. ${p.label}</b>`));
      const line=L.polyline(pts.map(p=>[p.lat,p.lon]),{weight:4,opacity:.75}).addTo(map);map.fitBounds(line.getBounds(),{padding:[25,25]});wrap.dataset.ready='1';setTimeout(()=>map.invalidateSize(),100);
    }catch(e){mapEl.innerHTML='<div class="osm-loading">לא הצלחתי לטעון את מפת OSM כרגע.<br>Google Maps נשאר זמין.</div>';}
  }
  function decorateMaps(){
    document.querySelectorAll('.route-map-card').forEach(card=>{
      if(card.dataset.osmAdded)return;card.dataset.osmAdded='1';
      const google=card.querySelector('.open-day-route');if(!google)return;
      const choice=document.createElement('div');choice.className='osm-choice';
      const ga=google.cloneNode(true);ga.className='google-choice';ga.textContent='Google Maps';
      const ob=document.createElement('button');ob.type='button';ob.className='osm-choice-btn';ob.textContent='OpenStreetMap · English';ob.onclick=()=>showOsm(card);
      choice.append(ga,ob);google.style.display='none';google.after(choice);
      const wrap=document.createElement('div');wrap.className='osm-map-wrap';wrap.innerHTML='<div class="osm-map"></div><div class="osm-note">תצוגת המסלול היומי לפי סדר התחנות · שמות המפה באנגלית</div>';choice.after(wrap);
    });
  }
  function run(){addStyles();decorateExpenses();decorateMaps();const v=document.querySelector('header .logo small');if(v)v.textContent='2026 · '+VERSION;document.title='Japan Trip 2026 · '+VERSION;document.documentElement.dataset.appReady=VERSION;}
  let busy=false;const schedule=()=>{if(busy)return;busy=true;setTimeout(()=>{busy=false;run();},60)};
  const mo=new MutationObserver(schedule);mo.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();
