// Japan Trip v9.12h - Kyoto cleanup, guide dedupe, shopping + packing resilience
(function(){'use strict';
const VERSION='v9.12h';
function norm(s){return(s||'').replace(/למה\s+המקום\s+שווה\??/gi,'').replace(/why\s+it'?s\s+worth\s+it\??/gi,'').replace(/\s+/g,' ').trim().toLowerCase()}
function similarity(a,b){a=norm(a);b=norm(b);if(!a||!b)return 0;if(a===b||a.includes(b)||b.includes(a))return 1;const A=new Set(a.split(/\s+/).filter(x=>x.length>2)),B=new Set(b.split(/\s+/).filter(x=>x.length>2));if(!A.size||!B.size)return 0;let hit=0;A.forEach(x=>{if(B.has(x))hit++});return hit/Math.min(A.size,B.size)}
function dedupeGuides(){
  const modal=document.getElementById('placeModal');
  if(modal){
    const desc=modal.querySelector('#modalDesc');
    const tip=modal.querySelector('#modalTip');
    if(desc&&tip&&similarity(desc.textContent,tip.textContent)>.72){tip.innerHTML='';tip.style.display='none'}
    else if(tip){tip.style.display=''}
  }
  document.querySelectorAll('.modal,.place-modal,.guide-modal,.place-detail,.guide-content').forEach(root=>{
    const nodes=[...root.querySelectorAll('p,div,li')].filter(x=>x.children.length===0&&norm(x.textContent).length>25);
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j];if(!a.isConnected||!b.isConnected)continue;
      const ctx=norm((a.parentElement?.textContent||'')+' '+(b.parentElement?.textContent||''));
      if((/למה.*שווה|why.*worth/.test(ctx))&&similarity(a.textContent,b.textContent)>.82)b.remove();
    }
  });
}
function tidy12(){
  const day=document.getElementById('day-9');if(!day)return;
  const h=day.querySelector('.day-heading h2');if(h&&/יום נוסף|extra day/i.test(h.textContent||''))h.textContent='Fushimi Inari · Nishiki · Pontocho';
  const sum=day.querySelector('.summary');if(sum)sum.textContent='Fushimi Inari → ארוחת צהריים → Nishiki Market → Teramachi / Shinkyogoku → Kamo River / Pontocho';
  [...day.querySelectorAll('.list-view .stop')].forEach(s=>{if(/Kyoto\s*·?\s*יום נוסף|יום Kyoto נוסף|התוכן הסופי ייקבע|Nara הועברה ל-14\/11/i.test(s.textContent||''))s.remove()});
  [...day.querySelectorAll('p,.note,.day-note,.tip')].forEach(n=>{if(/יום נוסף|יום פנוי נוסף|extra day|יום גמיש נוסף|טרם נסגר|נעדכן לאחר סגירת/i.test(n.textContent||''))n.remove()});
  const map=day.querySelector('.map-view .route-map-card');
  if(map&&/טרם נסגר|נעדכן לאחר סגירת/i.test(map.textContent||''))map.innerHTML='<div class="route-map-icon">🗺️</div><h3>מסלול 12/11</h3><ol><li>Fushimi Inari Taisha</li><li>Nishiki Market Kyoto</li><li>Teramachi Kyoto</li><li>Pontocho Kyoto</li></ol><a class="open-day-route" href="https://www.google.com/maps/dir/?api=1&origin=Fushimi+Inari+Taisha&destination=Pontocho+Kyoto&travelmode=transit&waypoints=Nishiki+Market+Kyoto|Teramachi+Kyoto" rel="noopener" target="_blank">פתח את מסלול היום ↗</a>';
  const list=day.querySelector('.list-view');if(list){const hotels=[...list.querySelectorAll('.stop')].filter(s=>/Richmond Hotel Premier Kyoto Shijo|לינה.*Richmond|מלון.*Richmond/i.test(s.textContent||''));hotels.forEach(x=>list.appendChild(x))}
}
const TAKE_KEY='japanTrip_take_v2',SHOP_KEY='japanTrip_shop_v2';
const TAKE_DEFAULT=['דרכונים','ארנק + כרטיסי אשראי','ביטוח נסיעות','תרופות קבועות','מטענים לטלפונים','Power Bank','מתאם חשמל ליפן','eSIM / פרטי חיבור','משקפי שמש','נעלי הליכה נוחות','מעיל קל / שכבות','מטרייה מתקפלת','תיק יום קטן','צילום/עותק של מסמכי הנסיעה'];
const SHOP_DEFAULT=[
 {name:'משקפיים · JINS',done:false,note:'להזמין בתחילת הטיול כדי להשאיר זמן לאיסוף',maps:'https://www.google.com/maps/search/?api=1&query=JINS+Shinjuku+Tokyo'},
 {name:'נעלי ריצה',done:false,note:'Onitsuka Tiger / חנויות ספורט לפי התאמה',maps:'https://www.google.com/maps/search/?api=1&query=Onitsuka+Tiger+Omotesando+Tokyo'},
 {name:'מכונת גילוח',done:false,note:'Bic Camera / Yodobashi Camera',maps:'https://www.google.com/maps/search/?api=1&query=Bic+Camera+Shinjuku+Tokyo'},
 {name:'מכנסי ספורט',done:false,note:'Uniqlo / חנויות ספורט',maps:'https://www.google.com/maps/search/?api=1&query=Uniqlo+Tokyo'}
];
function readArray(keys,defaults){for(const k of keys){try{const a=JSON.parse(localStorage.getItem(k));if(Array.isArray(a)&&a.length)return a}catch(e){}}return defaults.map((x,i)=>typeof x==='string'?{id:Date.now()+i,name:x,done:false}:{id:Date.now()+i,...x})}
function save(k,a){try{localStorage.setItem(k,JSON.stringify(a))}catch(e){}}
let takeItems=readArray([TAKE_KEY,'japanTrip_take_v1','takeList'],TAKE_DEFAULT);
function renderTake(){const root=document.getElementById('takeList');if(!root)return;root.innerHTML='';takeItems.forEach((x,i)=>{if(typeof x==='string')x={id:Date.now()+i,name:x,done:false};const row=document.createElement('div');row.className='take-item';row.style.cssText='display:flex;align-items:center;gap:10px;padding:11px 4px;border-bottom:1px solid #eee';row.innerHTML='<input type="checkbox" '+(x.done?'checked':'')+' style="width:20px;height:20px"><span style="flex:1;'+(x.done?'text-decoration:line-through;opacity:.55':'')+'"></span><button type="button" style="border:0;background:transparent;font-size:18px">×</button>';row.querySelector('span').textContent=x.name||x.text||'';row.querySelector('input').onchange=e=>{takeItems[i]={...x,done:e.target.checked};save(TAKE_KEY,takeItems);renderTake()};row.querySelector('button').onclick=()=>{takeItems.splice(i,1);save(TAKE_KEY,takeItems);renderTake()};root.appendChild(row)});save(TAKE_KEY,takeItems)}
window.addTake=function(){const input=document.getElementById('newTakeItem');const name=(input?.value||'').trim();if(!name)return;takeItems.push({id:Date.now(),name,done:false});save(TAKE_KEY,takeItems);input.value='';renderTake()};
let shopItems=readArray([SHOP_KEY,'japanTrip_shop_v1','japanTrip_shopping_v1','shoppingList'],SHOP_DEFAULT);
function renderShopping(){const root=document.getElementById('shoppingList');if(!root)return;root.innerHTML='';shopItems.forEach((x,i)=>{if(typeof x==='string')x={id:Date.now()+i,name:x,done:false};const card=document.createElement('div');card.className='shop-card';card.style.cssText='background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:11px;margin:9px 12px';card.innerHTML='<div style="display:flex;align-items:center;gap:9px"><input type="checkbox" '+(x.done?'checked':'')+' style="width:20px;height:20px"><b style="flex:1"></b><button type="button" style="border:0;background:transparent;font-size:18px">×</button></div>'+(x.note?'<div class="shop-note" style="font-size:12px;color:#666;margin:7px 29px 0 0"></div>':'')+(x.maps?'<a target="_blank" rel="noopener" style="display:inline-block;margin:8px 29px 0 0;font-size:12px;font-weight:800;text-decoration:none">📍 פתח מפה ↗</a>':'');card.querySelector('b').textContent=x.name||x.text||'';const note=card.querySelector('.shop-note');if(note)note.textContent=x.note;const a=card.querySelector('a');if(a)a.href=x.maps;card.querySelector('input').onchange=e=>{shopItems[i]={...x,done:e.target.checked};save(SHOP_KEY,shopItems);renderShopping()};card.querySelector('button').onclick=()=>{shopItems.splice(i,1);save(SHOP_KEY,shopItems);renderShopping()};root.appendChild(card)});save(SHOP_KEY,shopItems)}
window.addShopItem=function(){const input=document.getElementById('newShopItem');const name=(input?.value||'').trim();if(!name)return;shopItems.push({id:Date.now(),name,done:false,note:'',maps:''});save(SHOP_KEY,shopItems);input.value='';renderShopping()};
function ensureLists(){renderTake();renderShopping();const ti=document.getElementById('newTakeItem');if(ti&&!ti.dataset.enter){ti.dataset.enter='1';ti.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();window.addTake()}})}const si=document.getElementById('newShopItem');if(si&&!si.dataset.enter){si.dataset.enter='1';si.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();window.addShopItem()}})}}
function version(){let v=document.querySelector('header .logo .app-version')||document.querySelector('header .logo small');if(v)v.textContent='2026 · '+VERSION;document.title='Japan Trip 2026 · '+VERSION;document.documentElement.dataset.appReady=VERSION}
function run(){tidy12();dedupeGuides();ensureLists();version()}
let pending=false;function schedule(){if(pending)return;pending=true;setTimeout(()=>{pending=false;run()},120)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('pageshow',schedule);
document.addEventListener('click',e=>{if(e.target.closest('.guide-tips-btn,.place-info-btn,.info-modal-btn'))setTimeout(dedupeGuides,80)},true);
})();