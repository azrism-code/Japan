// Japan Trip v9.9 loader
(async function bootJapanTrip(){
  try{
    const res=await fetch('./index.htm?v=99',{cache:'no-store'});
    if(!res.ok) throw new Error('legacy source '+res.status);
    const html=await res.text();
    const doc=new DOMParser().parseFromString(html,'text/html');
    const scripts=[...doc.querySelectorAll('script')]
      .map(s=>s.textContent||'')
      .filter(Boolean)
      .filter(t=>!t.includes("const TK='japanTrip_take_v1'"))
      .filter(t=>!t.includes("navigator.serviceWorker.register('./service-worker.js')"));

    for(const code of scripts){
      const s=document.createElement('script');
      s.textContent=code;
      document.body.appendChild(s);
    }

    const tripStart=new Date(2026,10,3), tripEnd=new Date(2026,10,17), now=new Date();
    const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    if(today>=tripStart&&today<=tripEnd&&typeof showDay==='function'){
      const i=Math.round((today-tripStart)/86400000);
      setTimeout(()=>{
        showDay(i);
        const chips=document.querySelectorAll('.day-chip');
        if(chips[i]&&!chips[i].querySelector('.today-mini')){
          chips[i].classList.add('today');
          const t=document.createElement('span');
          t.className='today-mini';t.textContent='היום';chips[i].appendChild(t);
        }
      },80);
    }

    installExpenses();
    document.title='Japan Trip 2026 · v9.9';
    const ver=document.querySelector('header .logo small'); if(ver) ver.textContent='2026 · v9.9';
    document.documentElement.dataset.appReady='v9.9';
  }catch(err){
    console.error('Japan Trip boot failed',err);
    document.documentElement.dataset.appReady='error';
    installExpenses();
  }

  if('serviceWorker' in navigator){
    try{
      const reg=await navigator.serviceWorker.register('./service-worker.js?v=99');
      reg.update();
    }catch(e){console.warn('SW registration failed',e);}
  }
})();

// ---------- Expenses & Budget v9.9 ----------
const EXP_KEY='japanTrip_expenses_v1';
const EXP_SETTINGS_KEY='japanTrip_expense_settings_v1';

const EXP_DEFAULTS=[
  {name:'טיסות Emirates / Flydubai',status:'שולם',payment:'אשראי',currency:'USD',amount:3166,category:'✈️ טיסות',included:true,note:''},
  {name:'מלון טוקיו',status:'מוזמן',payment:'אשראי',currency:'USD',amount:1000,category:'🏨 לינה',included:true,note:''},
  {name:'מלון האקונה',status:'הערכה',payment:'אשראי',currency:'USD',amount:600,category:'🏨 לינה',included:true,note:''},
  {name:'Richmond Hotel Premier Kyoto Shijo',status:'מוזמן',payment:'אשראי',currency:'JPY',amount:159420,category:'🏨 לינה',included:true,note:'ביטול 7/11'},
  {name:'Hotel Royal Classic Osaka',status:'מוזמן',payment:'אשראי',currency:'JPY',amount:109398,category:'🏨 לינה',included:true,note:'ביטול 5/11'},
  {name:'Cross Hotel Osaka',status:'מוזמן',payment:'אשראי',currency:'USD',amount:649,category:'🏨 לינה',included:false,note:'חלופה · ביטול 5/11'},
  {name:'מלון טוקיו · לילה אחרון',status:'מוזמן',payment:'אשראי',currency:'USD',amount:250,category:'🏨 לינה',included:true,note:''},
  {name:'ביטוח נסיעות (2×17)',status:'הערכה',payment:'אשראי',currency:'USD',amount:34,category:'🛡️ ביטוח',included:true,note:''},
  {name:'eSIM עזרי (Klook)',status:'הערכה',payment:'אשראי',currency:'USD',amount:12,category:'📱 תקשורת',included:true,note:''},
  {name:'eSIM איילי',status:'הערכה',payment:'אשראי',currency:'USD',amount:12,category:'📱 תקשורת',included:true,note:''},
  {name:'השכרת רכב',status:'הערכה',payment:'אשראי',currency:'USD',amount:150,category:'🚗 תחבורה',included:true,note:''},
  {name:'חניה בנתב״ג (16×50)',status:'הערכה',payment:'אשראי',currency:'ILS',amount:800,category:'🚗 תחבורה',included:true,note:''}
];

function expLoad(){
  let a=null;
  try{const x=JSON.parse(localStorage.getItem(EXP_KEY));if(Array.isArray(x))a=x;}catch(e){}
  if(!a)a=EXP_DEFAULTS.map((x,i)=>({...x,id:Date.now()+i}));
  // Migration: early v9.8 users may have a saved list without the paid flight row.
  if(!a.some(x=>String(x.category||'').includes('טיסות')||/טיס/.test(String(x.name||'')))){
    a.unshift({...EXP_DEFAULTS[0],id:Date.now()-1});
    try{localStorage.setItem(EXP_KEY,JSON.stringify(a));}catch(e){}
  }
  return a;
}
function expSettings(){
  try{const x=JSON.parse(localStorage.getItem(EXP_SETTINGS_KEY));if(x)return x;}catch(e){}
  return {budget:32027,rates:{USD:3,EUR:3.5,JPY:0.019,ILS:1}};
}
function expSave(items,settings){localStorage.setItem(EXP_KEY,JSON.stringify(items));localStorage.setItem(EXP_SETTINGS_KEY,JSON.stringify(settings));}
function expIls(x,s){return (Number(x.amount)||0)*(s.rates[x.currency]||1);}
function expMoney(n){return new Intl.NumberFormat('he-IL',{maximumFractionDigits:0}).format(Math.round(n||0))+' ₪';}
function expEsc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function expNative(x){return x.currency==='ILS'?`${new Intl.NumberFormat('he-IL').format(x.amount)} ₪`:`${x.currency==='JPY'?'¥':x.currency==='USD'?'$':'€'}${new Intl.NumberFormat('he-IL').format(x.amount)}`;}

function installExpenses(){
  if(document.getElementById('page-expenses')){expRender();return;}
  const style=document.createElement('style');
  style.textContent=`
  #page-expenses{padding-bottom:90px}.exp-wrap{padding:12px 14px 30px}.exp-summary{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:8px 0 14px}.exp-kpi{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:12px;box-shadow:0 2px 8px rgba(0,0,0,.04)}.exp-kpi span{display:block;font-size:11px;color:#6b7280;margin-bottom:4px}.exp-kpi b{font-size:18px}.exp-kpi.wide{grid-column:1/-1;background:#faf7f2}.exp-progress{height:8px;background:#ececec;border-radius:99px;overflow:hidden;margin-top:8px}.exp-progress i{display:block;height:100%;background:#222;border-radius:99px}.exp-rates,.exp-add,.exp-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:12px;margin:9px 0}.exp-rates{margin-top:18px}.exp-rates h3,.exp-add h3{margin:0 0 9px;font-size:15px}.exp-rate-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.exp-rate-grid label,.exp-field label{font-size:11px;color:#6b7280;display:block;margin-bottom:3px}.exp-rate-grid input,.exp-field input,.exp-field select{width:100%;box-sizing:border-box;border:1px solid #d8dce2;border-radius:10px;padding:9px;background:#fff;font-size:14px}.exp-budget-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;margin-top:9px}.exp-budget-row button,.exp-add button,.exp-card button{border:0;border-radius:10px;padding:9px 11px;font-weight:700}.exp-add-grid,.exp-edit-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.exp-field.full{grid-column:1/-1}.exp-add .primary{width:100%;margin-top:9px;background:#111;color:#fff}.exp-card{padding:11px}.exp-card.alt{opacity:.68}.exp-card-head{display:flex;align-items:flex-start;gap:8px}.exp-card-head .grow{flex:1}.exp-card h4{margin:0 0 3px;font-size:15px}.exp-meta{font-size:11px;color:#6b7280}.exp-amount{font-weight:800;white-space:nowrap}.exp-note{font-size:11px;color:#8a5a22;margin-top:5px}.exp-actions{display:flex;gap:6px;margin-top:9px;align-items:center;flex-wrap:wrap}.exp-actions button{font-size:11px;padding:7px 9px}.exp-actions .edit{background:#111;color:#fff}.exp-actions .del{margin-inline-start:auto;color:#a40000}.exp-actions label{font-size:11px;color:#555;display:flex;align-items:center;gap:4px}.exp-filter{display:flex;gap:6px;overflow:auto;padding:2px 0 6px}.exp-filter button{white-space:nowrap;border:1px solid #ddd;background:#fff;border-radius:99px;padding:7px 10px;font-size:11px}.exp-filter button.active{background:#111;color:#fff}.exp-empty{text-align:center;color:#777;padding:24px 10px}.exp-menu-btn{width:100%;display:flex;gap:10px;align-items:center;text-align:right;background:transparent;border:0;padding:12px 14px;font:inherit;color:inherit}.exp-badge{font-size:10px;background:#111;color:#fff;border-radius:99px;padding:2px 6px;margin-inline-start:auto}.exp-edit-title{font-weight:800;margin-bottom:9px}.exp-edit-buttons{display:flex;gap:8px;margin-top:10px}.exp-edit-buttons .save{background:#111;color:#fff;flex:1}.exp-edit-buttons .cancel{background:#eee;flex:1}.exp-section-title{font-size:14px;margin:14px 2px 7px;color:#555}
  `;
  document.head.appendChild(style);

  const page=document.createElement('section');page.className='sheet-page';page.id='page-expenses';
  page.innerHTML=`<div class="page-head"><button onclick="closePage()">←</button><h2>💰 הוצאות ותקציב</h2></div><div class="exp-wrap" id="expRoot"></div>`;
  document.body.appendChild(page);

  const target=document.querySelector('#menu') || document.querySelector('[onclick*="page-hotels"]')?.parentElement;
  if(target&&!target.querySelector('[data-exp-menu]')){
    const b=document.createElement('button');b.className='exp-menu-btn';b.dataset.expMenu='1';b.innerHTML='<span>💰</span><span>הוצאות ותקציב</span><span class="exp-badge">חדש</span>';
    b.onclick=()=>{if(typeof openPage==='function')openPage('page-expenses');else page.classList.add('open');expRender();};
    target.appendChild(b);
  }
  expRender();
}

let expFilter='הכול';
let expEditing=null;
function expRender(){
  const root=document.getElementById('expRoot');if(!root)return;
  const items=expLoad(),s=expSettings();
  const active=items.filter(x=>x.included!==false), expected=active.reduce((a,x)=>a+expIls(x,s),0), paid=active.filter(x=>x.status==='שולם').reduce((a,x)=>a+expIls(x,s),0), remaining=s.budget-expected;
  const pct=s.budget?Math.min(100,Math.max(0,expected/s.budget*100)):0;
  const cats=['הכול',...new Set(items.map(x=>x.category))];
  const shown=expFilter==='הכול'?items:items.filter(x=>x.category===expFilter);
  root.innerHTML=`
    <div class="exp-summary">
      <div class="exp-kpi"><span>תקציב כולל</span><b>${expMoney(s.budget)}</b></div>
      <div class="exp-kpi"><span>הוצאות צפויות</span><b>${expMoney(expected)}</b></div>
      <div class="exp-kpi"><span>שולם בפועל</span><b>${expMoney(paid)}</b></div>
      <div class="exp-kpi"><span>נותר בתקציב</span><b>${expMoney(remaining)}</b></div>
      <div class="exp-kpi wide"><span>ניצול תקציב · ${Math.round(pct)}%</span><div class="exp-progress"><i style="width:${pct}%"></i></div><div style="font-size:11px;color:#666;margin-top:6px">הזמנות חלופיות שלא מסומנות כ״כלול״ מוצגות ברשימה אך אינן נספרות.</div></div>
    </div>

    <div class="exp-add"><h3>＋ הוסף הוצאה</h3><div class="exp-add-grid">
      <div class="exp-field full"><label>תיאור</label><input id="expName" placeholder="לדוגמה: ארוחת ערב"></div>
      <div class="exp-field"><label>סכום</label><input id="expAmount" type="number" inputmode="decimal"></div>
      <div class="exp-field"><label>מטבע</label><select id="expCurrency"><option>ILS</option><option>JPY</option><option>USD</option><option>EUR</option></select></div>
      <div class="exp-field"><label>סטטוס</label><select id="expStatus"><option>שולם</option><option>מוזמן</option><option selected>הערכה</option></select></div>
      <div class="exp-field"><label>קטגוריה</label><select id="expCategory"><option>🍜 אוכל</option><option>🛍️ קניות</option><option>🎟️ אטרקציות</option><option>🚗 תחבורה</option><option>🏨 לינה</option><option>✈️ טיסות</option><option>📱 תקשורת</option><option>🛡️ ביטוח</option><option>📦 אחר</option></select></div>
      <div class="exp-field full"><label>הערה</label><input id="expNote" placeholder="אופציונלי"></div>
    </div><button class="primary" onclick="expAdd()">הוסף הוצאה</button></div>

    <div class="exp-filter">${cats.map(c=>`<button class="${c===expFilter?'active':''}" onclick='expSetFilter(${JSON.stringify(c)})'>${expEsc(c)}</button>`).join('')}</div>
    <div id="expList">${shown.length?shown.map(x=>expCard(x,s)).join(''):'<div class="exp-empty">אין הוצאות בקטגוריה הזו.</div>'}</div>

    <div class="exp-rates"><h3>⚙️ שערים ותקציב</h3><div class="exp-rate-grid">
      <div><label>1 USD = ₪</label><input id="rateUSD" type="number" step="0.001" value="${s.rates.USD}"></div>
      <div><label>1 EUR = ₪</label><input id="rateEUR" type="number" step="0.001" value="${s.rates.EUR}"></div>
      <div><label>1 JPY = ₪</label><input id="rateJPY" type="number" step="0.0001" value="${s.rates.JPY}"></div>
      <div><label>1 ILS = ₪</label><input value="1" disabled></div>
    </div><div class="exp-budget-row"><div class="exp-field"><label>תקציב כולל ₪</label><input id="expBudget" type="number" value="${s.budget}"></div><button onclick="expSaveSettings()">שמור</button></div></div>`;
}

function expCard(x,s){
  if(expEditing===x.id){
    const cats=['🍜 אוכל','🛍️ קניות','🎟️ אטרקציות','🚗 תחבורה','🏨 לינה','✈️ טיסות','📱 תקשורת','🛡️ ביטוח','📦 אחר'];
    return `<div class="exp-card"><div class="exp-edit-title">✏️ עריכת הוצאה</div><div class="exp-edit-grid">
      <div class="exp-field full"><label>תיאור</label><input id="editName" value="${expEsc(x.name)}"></div>
      <div class="exp-field"><label>סכום</label><input id="editAmount" type="number" value="${Number(x.amount)||0}"></div>
      <div class="exp-field"><label>מטבע</label><select id="editCurrency">${['ILS','JPY','USD','EUR'].map(v=>`<option ${v===x.currency?'selected':''}>${v}</option>`).join('')}</select></div>
      <div class="exp-field"><label>סטטוס</label><select id="editStatus">${['שולם','מוזמן','הערכה'].map(v=>`<option ${v===x.status?'selected':''}>${v}</option>`).join('')}</select></div>
      <div class="exp-field"><label>קטגוריה</label><select id="editCategory">${cats.map(v=>`<option ${v===x.category?'selected':''}>${v}</option>`).join('')}</select></div>
      <div class="exp-field"><label>תשלום</label><input id="editPayment" value="${expEsc(x.payment||'אשראי')}"></div>
      <div class="exp-field full"><label>הערה</label><input id="editNote" value="${expEsc(x.note||'')}"></div>
      <div class="exp-field full"><label><input id="editIncluded" type="checkbox" ${x.included!==false?'checked':''}> כלול בתקציב</label></div>
    </div><div class="exp-edit-buttons"><button class="save" onclick="expSaveEdit(${x.id})">שמור שינויים</button><button class="cancel" onclick="expCancelEdit()">ביטול</button></div></div>`;
  }
  return `<div class="exp-card ${x.included===false?'alt':''}"><div class="exp-card-head"><div class="grow"><h4>${expEsc(x.category)} · ${expEsc(x.name)}</h4><div class="exp-meta">${expEsc(x.status)} · ${expEsc(x.payment||'אשראי')} · ${expNative(x)}</div>${x.note?`<div class="exp-note">${expEsc(x.note)}</div>`:''}</div><div class="exp-amount">${expMoney(expIls(x,s))}</div></div><div class="exp-actions"><button class="edit" onclick="expStartEdit(${x.id})">✏️ ערוך</button><label><input type="checkbox" ${x.included!==false?'checked':''} onchange="expToggle(${x.id},this.checked)"> כלול בתקציב</label><button class="del" onclick="expDelete(${x.id})">מחק</button></div></div>`;
}

function expSaveSettings(){const s=expSettings();s.rates.USD=Number(document.getElementById('rateUSD').value)||3;s.rates.EUR=Number(document.getElementById('rateEUR').value)||3.5;s.rates.JPY=Number(document.getElementById('rateJPY').value)||.019;s.budget=Number(document.getElementById('expBudget').value)||0;expSave(expLoad(),s);expRender();}
function expAdd(){const name=document.getElementById('expName').value.trim(),amount=Number(document.getElementById('expAmount').value);if(!name||!amount)return alert('יש להזין תיאור וסכום');const a=expLoad();a.unshift({id:Date.now(),name,amount,currency:document.getElementById('expCurrency').value,status:document.getElementById('expStatus').value,category:document.getElementById('expCategory').value,payment:'אשראי',included:true,note:document.getElementById('expNote').value.trim()});expSave(a,expSettings());expRender();}
function expDelete(id){if(!confirm('למחוק את ההוצאה?'))return;expSave(expLoad().filter(x=>x.id!==id),expSettings());if(expEditing===id)expEditing=null;expRender();}
function expToggle(id,v){const a=expLoad(),x=a.find(x=>x.id===id);if(x)x.included=v;expSave(a,expSettings());expRender();}
function expStartEdit(id){expEditing=id;expRender();setTimeout(()=>document.getElementById('editName')?.focus(),20);}
function expCancelEdit(){expEditing=null;expRender();}
function expSaveEdit(id){
  const a=expLoad(),x=a.find(x=>x.id===id);if(!x)return;
  const name=document.getElementById('editName')?.value.trim(),amount=Number(document.getElementById('editAmount')?.value);
  if(!name||!amount)return alert('יש להזין תיאור וסכום');
  x.name=name;x.amount=amount;x.currency=document.getElementById('editCurrency').value;x.status=document.getElementById('editStatus').value;x.category=document.getElementById('editCategory').value;x.payment=document.getElementById('editPayment').value.trim()||'אשראי';x.note=document.getElementById('editNote').value.trim();x.included=document.getElementById('editIncluded').checked;
  expSave(a,expSettings());expEditing=null;expRender();
}
function expSetFilter(c){expFilter=c;expRender();}
