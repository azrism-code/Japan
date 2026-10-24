/* Japan Trip 2026 · compact expense controls + dual budget filters · v10.3.26 */
(() => {
  'use strict';
  const VERSION='10.3.26';
  const EXP_KEY='japanTrip_expenses_v1';
  const SETTINGS_KEY='japanTrip_expense_settings_v1';
  const TRASH_KEY='japanTrip_expenses_trash_v1';
  const TRAIN_SEED_VERSION=1;
  let openPanel=null, uiPending=false, editingId=null;

  const TRAIN_ESTIMATES=[
    {bookingId:'romancecar-shinjuku-odawara',amount:3700,note:'8/11 · הערכה לזוג לפי תפריט הזמנות · ≈ ¥3,700'},
    {bookingId:'shinkansen-odawara-kyoto',amount:25300,note:'10/11 · הערכה לזוג · טווח בתפריט הזמנות ¥24,600–26,000 · בתקציב נלקח אמצע הטווח'},
    {bookingId:'aoniyoshi-kyoto-nara',amount:2980,note:'14/11 · הערכה לזוג ב-Twin Seats · ¥2,980'},
    {bookingId:'shinkansen-osaka-tokyo',amount:29500,note:'16/11 · הערכה לזוג · טווח בתפריט הזמנות ¥29,000–30,000 · בתקציב נלקח אמצע הטווח'}
  ];

  const HAKONE_EXPENSE={
    name:'Hakone Kowakien TEN-YU',status:'מוזמן',payment:'אשראי',currency:'USD',amount:1036.91,
    category:'🏨 לינה',included:true,note:'8–10/11 · תשלום מאוחר · כולל ארוחת בוקר'
  };
  function migrateHakoneExpense(notifyCloud=false){
    let items;
    try{items=JSON.parse(localStorage.getItem(EXP_KEY)||'null')}catch(_){items=null}
    if(!Array.isArray(items))return false;
    let changed=false;
    let current=items.find(x=>x?.name===HAKONE_EXPENSE.name);
    const old=items.find(x=>x?.name==='מלון Hakone / Fuji'||x?.name==='Hakone / Fuji · טרם הוזמן');
    if(old&&!current){current=old;changed=true}
    else if(old&&current){items=items.filter(x=>x!==old);changed=true}
    if(!current){current={id:Date.now()+items.length,...HAKONE_EXPENSE};items.push(current);changed=true}
    for(const [k,v] of Object.entries(HAKONE_EXPENSE))if(current[k]!==v){current[k]=v;changed=true}
    if(changed){
      localStorage.setItem(EXP_KEY,JSON.stringify(items));
      if(notifyCloud&&window.JapanCloud?.canWrite?.())document.dispatchEvent(new CustomEvent('japan:stateChanged'));
    }
    return changed;
  }

  function isExpensesPage(page){
    return /הוצאות/.test(page?.querySelector('.page-head h2')?.textContent||'');
  }

  function read(key,fallback){
    try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch(_){return fallback}
  }

  function canWrite(){
    return !window.JapanCloud||window.JapanCloud.canWrite?.()!==false;
  }

  function writeExpenses(items){
    if(!canWrite()){window.JapanCloud?.deny?.();return false}
    localStorage.setItem(EXP_KEY,JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('japan:stateChanged'));
    return true;
  }

  function seedTrainEstimates(){
    if(!canWrite())return false;
    const T=window.TRIP_DATA||{};
    const rawSettings=read(SETTINGS_KEY,null);
    const settings=rawSettings&&typeof rawSettings==='object'&&!Array.isArray(rawSettings)
      ? rawSettings
      : {budget:32027,rates:{USD:3,EUR:3.5,JPY:Number(T.rateJpyIls)||0.0196773,ILS:1}};
    if(Number(settings.trainBookingEstimatesVersion||0)>=TRAIN_SEED_VERSION)return false;

    const items=read(EXP_KEY,[]);
    if(!Array.isArray(items))return false;
    const bookingItems=window.JapanBookingPlanner?.items||[];
    let changed=false;

    for(const spec of TRAIN_ESTIMATES){
      const booking=bookingItems.find(x=>x.id===spec.bookingId);
      const name=booking?.title||spec.bookingId;
      const exists=items.some(x=>x?.sourceBookingId===spec.bookingId||x?.id==='budget-'+spec.bookingId||x?.name===name);
      if(exists)continue;
      items.push({
        id:'budget-'+spec.bookingId,
        sourceBookingId:spec.bookingId,
        name,
        status:'הערכה',
        payment:'טרם שולם',
        currency:'JPY',
        amount:spec.amount,
        category:'🚗 תחבורה',
        included:true,
        note:spec.note
      });
      changed=true;
    }

    settings.trainBookingEstimatesVersion=TRAIN_SEED_VERSION;
    localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));
    if(changed)localStorage.setItem(EXP_KEY,JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('japan:stateChanged'));
    return changed;
  }

  function budgetData(){
    const T=window.TRIP_DATA||{};
    const stored=read(SETTINGS_KEY,{});
    const rates={USD:3,EUR:3.5,JPY:Number(T.rateJpyIls)||0.0196773,ILS:1,...(stored.rates||{})};
    const budget=Number(stored.budget ?? 32027)||0;
    const items=read(EXP_KEY,[]);
    const totals={paid:0,booked:0,estimate:0};

    if(Array.isArray(items))for(const item of items){
      if(item?.included===false)continue;
      const ils=(Number(item?.amount)||0)*(Number(rates[item?.currency])||1);
      if(item?.status==='שולם')totals.paid+=ils;
      else if(item?.status==='מוזמן')totals.booked+=ils;
      else totals.estimate+=ils;
    }

    const used=totals.paid+totals.booked+totals.estimate;
    return {...totals,budget,used,remaining:budget-used};
  }

  function money(value){
    return new Intl.NumberFormat('he-IL',{maximumFractionDigits:0}).format(Math.round(Number(value)||0))+' ₪';
  }


  const STATUS_CHOICES=[
    {key:'paid',label:'שולם',colorClass:'budget-paid'},
    {key:'booked',label:'הוזמן',colorClass:'budget-booked'},
    {key:'estimate',label:'הערכה',colorClass:'budget-estimate'}
  ];
  const CATEGORY_COLORS={
    '🏨 לינה':'#5478bf','🚗 תחבורה':'#2f9c8d','✈️ טיסות':'#e7a347',
    '🍜 אוכל':'#9875cd','🛍️ קניות':'#d77888','🎟️ אטרקציות':'#408eab',
    '📱 תקשורת':'#8c95a3','🛡️ ביטוח':'#af7a4b','📦 אחר':'#9a8a7a'
  };
  const FALLBACK_CATEGORY_COLORS=['#5478bf','#2f9c8d','#e7a347','#9875cd','#d77888','#408eab','#8c95a3','#af7a4b','#9a8a7a'];
  let statusFilter=null,categoryFilter=null;

  function expenseStatus(status){
    return status==='שולם'?'paid':status==='מוזמן'?'booked':'estimate';
  }
  function htmlSafe(value){
    return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function categoryColor(category){
    if(CATEGORY_COLORS[category])return CATEGORY_COLORS[category];
    let hash=0;
    for(const ch of category)hash=(hash*31+ch.codePointAt(0))>>>0;
    return FALLBACK_CATEGORY_COLORS[hash%FALLBACK_CATEGORY_COLORS.length];
  }
  function expenseCategories(){
    const T=window.TRIP_DATA||{};
    const settings=read(SETTINGS_KEY,{});
    const rates={USD:3,EUR:3.5,JPY:Number(T.rateJpyIls)||0.0196773,ILS:1,...(settings.rates||{})};
    const items=read(EXP_KEY,[]);
    const amounts=new Map();
    if(Array.isArray(items))for(const item of items){
      const name=String(item?.category||'📦 אחר');
      if(!amounts.has(name))amounts.set(name,0);
      if(item?.included===false)continue;
      const amount=(Number(item?.amount)||0)*(Number(rates[item?.currency])||1);
      amounts.set(name,amounts.get(name)+amount);
    }
    return [...amounts].map(([name,amount])=>({name,amount,color:categoryColor(name)}))
      .sort((a,b)=>b.amount-a.amount||a.name.localeCompare(b.name,'he'));
  }

  function enhanceSummary(body){
    const summary=body.querySelector(':scope > .expense-summary');
    if(!summary)return;

    const t=budgetData();
    const categories=expenseCategories();
    if(categoryFilter&&!categories.some(c=>c.name===categoryFilter))categoryFilter=null;
    const denom=Math.max(t.budget,t.used,1);
    const pct=t.budget?Math.round(t.used/t.budget*100):0;
    const statusItems=STATUS_CHOICES.map(s=>({...s,amount:t[s.key]}));

    const statusBar=statusItems.filter(s=>s.amount>0).map(s=>
      `<button type="button" class="budget-seg budget-seg-button ${s.colorClass} ${statusFilter&&statusFilter!==s.key?'is-muted':''}" data-exp-status="${s.key}" aria-pressed="${statusFilter===s.key}" aria-label="${s.label}: ${money(s.amount)}" style="width:${s.amount/denom*100}%" title="${s.label}: ${money(s.amount)}"></button>`
    ).join('');
    const statusLegend=statusItems.map(s=>
      `<button type="button" class="expense-legend-choice ${statusFilter===s.key?'is-active':''}" data-exp-status="${s.key}" aria-pressed="${statusFilter===s.key}"><i class="legend-dot ${s.colorClass}"></i><b>${s.label}</b><small>${money(s.amount)}</small></button>`
    ).join('');
    const categoryBar=categories.filter(c=>c.amount>0&&t.used>0).map(c=>
      `<button type="button" class="budget-seg budget-seg-button expense-category-seg ${categoryFilter&&categoryFilter!==c.name?'is-muted':''}" data-exp-category="${htmlSafe(c.name)}" aria-pressed="${categoryFilter===c.name}" aria-label="${htmlSafe(c.name)}: ${money(c.amount)}" style="width:${c.amount/t.used*100}%;background:${c.color}" title="${htmlSafe(c.name)}: ${money(c.amount)}"></button>`
    ).join('');
    const categoryLegend=categories.map(c=>
      `<button type="button" class="expense-legend-choice ${categoryFilter===c.name?'is-active':''}" data-exp-category="${htmlSafe(c.name)}" aria-pressed="${categoryFilter===c.name}"><i class="legend-dot" style="background:${c.color}"></i><b>${htmlSafe(c.name)}</b><small>${money(c.amount)} · ${t.used?Math.round(c.amount/t.used*100):0}%</small></button>`
    ).join('');

    summary.classList.add('expense-summary-v2');
    summary.innerHTML=`
      <div class="kpi budget-total"><span>תקציב כולל</span><b>${money(t.budget)}</b></div>
      <div class="kpi paid-kpi"><span>שולם בפועל</span><b>${money(t.paid)}</b></div>
      <div class="kpi booked-kpi"><span>הוזמן</span><b>${money(t.booked)}</b></div>
      <div class="kpi estimate-kpi"><span>הערכה</span><b>${money(t.estimate)}</b></div>
      <div class="kpi remaining-kpi"><span>נותר בתקציב</span><b>${money(t.remaining)}</b></div>
      <div class="budget-chart">
        <div class="budget-chart-head"><span>ניצול תקציב · סינון לפי מצב</span><b>${pct}%</b></div>
        <div class="budget-stack" role="group" aria-label="סינון הוצאות לפי מצב התשלום">${statusBar}</div>
        <div class="budget-legend">${statusLegend}</div>
      </div>
      <div class="budget-chart expense-category-chart">
        <div class="budget-chart-head"><span>חלוקת הוצאות · סינון לפי סוג</span>${statusFilter||categoryFilter?'<button type="button" class="expense-clear-filters" data-exp-clear-filters>נקה סינון ✕</button>':''}</div>
        <div class="budget-stack" role="group" aria-label="סינון הוצאות לפי קטגוריה">${categoryBar}</div>
        <div class="expense-category-legend">${categoryLegend||'<span class="expense-filter-empty-label">אין הוצאות להצגה</span>'}</div>
      </div>`;
  }

  function applyExpenseFilters(body){
    const oldFilters=body.querySelector('.filter-row');
    if(oldFilters)oldFilters.hidden=true;
    const items=read(EXP_KEY,[]);
    const byId=new Map(Array.isArray(items)?items.map(item=>[String(item.id),item]):[]);
    let visible=0;
    const cards=[...body.querySelectorAll('.expense-card')];
    for(const card of cards){
      const item=byId.get(String(card.dataset.expId));
      const show=!!item&&(!statusFilter||expenseStatus(item.status)===statusFilter)
        &&(!categoryFilter||String(item.category||'📦 אחר')===categoryFilter);
      card.hidden=!show;
      if(show)visible++;
    }
    let note=body.querySelector('.expense-filter-result');
    if(!note){
      note=document.createElement('div');
      note.className='expense-filter-result';
      note.setAttribute('role','status');
      if(oldFilters)oldFilters.after(note);
      else body.querySelector('.expense-card')?.before(note);
    }
    const filtered=!!(statusFilter||categoryFilter);
    note.hidden=!filtered;
    if(filtered)note.textContent=visible
      ?`מציג ${visible} הוצאות · ${[STATUS_CHOICES.find(s=>s.key===statusFilter)?.label,categoryFilter].filter(Boolean).join(' + ')}`
      :'אין הוצאות המתאימות לסינון. לחיצה נוספת על הבחירה תבטל אותה.';
  }

  function enhanceExpenseCards(body){
    const items=read(EXP_KEY,[]);
    body.querySelectorAll('.expense-card').forEach(card=>{
      const id=card.dataset.expId;
      if(!id)return;
      const item=Array.isArray(items)?items.find(x=>String(x.id)===String(id)):null;
      card.classList.add('compact-expense-card');

      const meta=card.querySelector('.expense-meta');
      let mark=meta?.querySelector('.expense-budget-mark');
      if(meta&&!mark){
        mark=document.createElement('span');
        mark.className='expense-budget-mark';
        meta.append(' · ',mark);
      }
      if(mark){
        const included=item?.included!==false;
        mark.className='expense-budget-mark '+(included?'included':'excluded');
        mark.textContent=included?'✓':'⊘';
        mark.title=included?'כלול בתקציב':'לא כלול בתקציב';
        mark.setAttribute('aria-label',mark.title);
      }

      card.querySelector('.stop-actions')?.remove();

      const head=card.querySelector('.expense-head');
      let edit=card.querySelector('[data-exp-edit]');
      if(!canWrite()){
        edit?.remove();
        return;
      }
      if(!edit&&head){
        edit=document.createElement('button');
        edit.type='button';
        edit.className='expense-edit-icon';
        edit.dataset.expEdit=id;
        edit.textContent='✏️';
        edit.title='ערוך הוצאה';
        edit.setAttribute('aria-label','ערוך הוצאה');
        head.append(edit);
      }
    });
  }

  function addOptionIfMissing(select,value){
    if(!select||!value)return;
    if(![...select.options].some(o=>o.value===value))select.add(new Option(value,value));
    select.value=value;
  }

  function renderEditForm(id){
    const items=read(EXP_KEY,[]);
    const item=Array.isArray(items)?items.find(x=>String(x.id)===String(id)):null;
    if(!item)return;
    editingId=String(id);
    openPanel='add';
    enhanceExpenses();

    const panel=document.querySelector('#sheetPage.open .expense-add-panel');
    if(!panel)return;
    const title=panel.querySelector('h3');
    if(title)title.textContent='✏️ עריכת הוצאה';

    const name=panel.querySelector('#expName'), amount=panel.querySelector('#expAmount');
    const currency=panel.querySelector('#expCurrency'), status=panel.querySelector('#expStatus');
    const category=panel.querySelector('#expCategory'), note=panel.querySelector('#expNote');
    if(name)name.value=item.name||'';
    if(amount)amount.value=Number(item.amount)||0;
    addOptionIfMissing(currency,item.currency||'ILS');
    addOptionIfMissing(status,item.status||'הערכה');
    addOptionIfMissing(category,item.category||'📦 אחר');
    if(note)note.value=item.note||'';

    let payment=panel.querySelector('#expPayment');
    if(!payment){
      const field=document.createElement('div');
      field.className='field';
      field.innerHTML='<label>אמצעי / מצב תשלום</label><input id="expPayment">';
      category?.closest('.field')?.after(field);
      payment=field.querySelector('#expPayment');
    }
    if(payment)payment.value=item.payment||'';

    let editOptions=panel.querySelector('.expense-edit-options');
    if(!editOptions){
      editOptions=document.createElement('div');
      editOptions.className='expense-edit-options';
      editOptions.innerHTML=`
        <label class="expense-edit-include"><input type="checkbox" id="expIncludedEdit"> <span>כלול בתקציב</span></label>
        <button type="button" class="expense-edit-delete" data-exp-edit-delete="">🗑️ מחק הוצאה</button>`;
      note?.closest('.field')?.after(editOptions);
    }
    const include=editOptions.querySelector('#expIncludedEdit');
    if(include)include.checked=item.included!==false;
    const deleteButton=editOptions.querySelector('[data-exp-edit-delete]');
    if(deleteButton)deleteButton.dataset.expEditDelete=editingId;

    const save=panel.querySelector('[data-action="add-expense"]');
    if(save){
      delete save.dataset.action;
      save.dataset.expEditSave=editingId;
      save.textContent='שמור שינויים';
    }
    if(!panel.querySelector('[data-exp-edit-cancel]')){
      const cancel=document.createElement('button');
      cancel.type='button';
      cancel.className='secondary-wide expense-edit-cancel';
      cancel.dataset.expEditCancel='1';
      cancel.textContent='ביטול';
      save?.after(cancel);
    }
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function saveEdit(id){
    if(!canWrite()){window.JapanCloud?.deny?.();return}
    const panel=document.querySelector('#sheetPage.open .expense-add-panel');
    if(!panel)return;
    const name=panel.querySelector('#expName')?.value.trim();
    const amount=Number(panel.querySelector('#expAmount')?.value);
    if(!name||!amount)return;

    const items=read(EXP_KEY,[]);
    if(!Array.isArray(items))return;
    const item=items.find(x=>String(x.id)===String(id));
    if(!item)return;
    const include=panel.querySelector('#expIncludedEdit');
    Object.assign(item,{
      name,
      amount,
      currency:panel.querySelector('#expCurrency')?.value||item.currency,
      status:panel.querySelector('#expStatus')?.value||item.status,
      category:panel.querySelector('#expCategory')?.value||item.category,
      payment:panel.querySelector('#expPayment')?.value.trim()||'',
      note:panel.querySelector('#expNote')?.value.trim()||'',
      included:include?include.checked:item.included!==false
    });
    if(!writeExpenses(items))return;
    editingId=null;openPanel=null;
    window.JapanTripApp?.openPage?.('expenses');
    setTimeout(scheduleEnhance,0);
  }

  function deleteEdit(id){
    if(!canWrite()){window.JapanCloud?.deny?.();return}
    const items=read(EXP_KEY,[]);
    if(!Array.isArray(items))return;
    const index=items.findIndex(x=>String(x.id)===String(id));
    if(index<0)return;
    const item=items[index];
    if(!window.confirm(`למחוק את "${item.name||'ההוצאה הזו'}"?`))return;
    localStorage.setItem(TRASH_KEY,JSON.stringify({item,index,deletedAt:new Date().toISOString()}));
    items.splice(index,1);
    if(!writeExpenses(items))return;
    editingId=null;openPanel=null;
    window.JapanTripApp?.openPage?.('expenses');
    setTimeout(scheduleEnhance,0);
  }

  function enhanceExpenses(){
    const page=document.querySelector('#sheetPage.open');
    if(!page||!isExpensesPage(page))return;
    const body=page.querySelector('.page-body');
    if(!body)return;

    enhanceSummary(body);

    const cards=[...body.querySelectorAll(':scope > .card')];
    const settings=cards.find(c=>/שערים ותקציב/.test(c.querySelector('h3')?.textContent||''));
    const add=cards.find(c=>/הוסף הוצאה|עריכת הוצאה/.test(c.querySelector('h3')?.textContent||''));
    if(!settings||!add)return;

    settings.classList.add('expense-panel','expense-settings-panel');
    add.classList.add('expense-panel','expense-add-panel');

    let bar=body.querySelector('.expense-actions-bar');
    if(!bar){
      bar=document.createElement('div');
      bar.className='expense-actions-bar';
      bar.innerHTML=`
        <button type="button" data-exp-panel="add" aria-expanded="false">＋ הוסף הוצאה</button>
        <button type="button" data-exp-panel="settings" aria-expanded="false">⚙️ שערים ותקציב</button>`;
      settings.before(bar);
    }

    settings.hidden=openPanel!=='settings';
    add.hidden=openPanel!=='add';
    bar.querySelectorAll('[data-exp-panel]').forEach(btn=>{
      const active=btn.dataset.expPanel===openPanel;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-expanded',String(active));
    });

    enhanceExpenseCards(body);
    applyExpenseFilters(body);
  }

  function scheduleEnhance(){
    if(uiPending)return;
    uiPending=true;
    requestAnimationFrame(()=>{uiPending=false;enhanceExpenses()});
  }

  function togglePanel(which){
    if(which==='add')editingId=null;
    openPanel=openPanel===which?null:which;
    enhanceExpenses();
    if(openPanel){
      const target=document.querySelector(openPanel==='settings'?'.expense-settings-panel':'.expense-add-panel');
      target?.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }

  document.addEventListener('click',e=>{
    const edit=e.target.closest('[data-exp-edit]');
    if(edit){
      e.preventDefault();e.stopImmediatePropagation();
      if(!canWrite()){window.JapanCloud?.deny?.();return}
      renderEditForm(edit.dataset.expEdit);return;
    }
    const save=e.target.closest('[data-exp-edit-save]');
    if(save){
      e.preventDefault();e.stopImmediatePropagation();
      saveEdit(save.dataset.expEditSave);return;
    }
    const remove=e.target.closest('[data-exp-edit-delete]');
    if(remove){
      e.preventDefault();e.stopImmediatePropagation();
      deleteEdit(remove.dataset.expEditDelete);return;
    }
    const cancel=e.target.closest('[data-exp-edit-cancel]');
    if(cancel){
      e.preventDefault();e.stopImmediatePropagation();
      editingId=null;openPanel=null;
      window.JapanTripApp?.openPage?.('expenses');
      setTimeout(scheduleEnhance,0);return;
    }
  },true);


  document.addEventListener('click',e=>{
    const status=e.target.closest('[data-exp-status]');
    const category=e.target.closest('[data-exp-category]');
    const clear=e.target.closest('[data-exp-clear-filters]');
    if(!status&&!category&&!clear)return;
    if(!isExpensesPage(document.querySelector('#sheetPage.open')))return;
    e.preventDefault();
    if(clear){statusFilter=null;categoryFilter=null}
    else if(status){statusFilter=statusFilter===status.dataset.expStatus?null:status.dataset.expStatus}
    else if(category){categoryFilter=categoryFilter===category.dataset.expCategory?null:category.dataset.expCategory}
    enhanceExpenses();
  });

  document.addEventListener('click',e=>{
    const panelButton=e.target.closest('[data-exp-panel]');
    if(panelButton){
      e.preventDefault();
      togglePanel(panelButton.dataset.expPanel);
      return;
    }

    const trigger=e.target.closest('[data-page="expenses"],[data-exp-filter],[data-action="save-exp-settings"],[data-action="add-expense"]');
    if(!trigger)return;
    if(trigger.dataset.action==='save-exp-settings'||trigger.dataset.action==='add-expense'){openPanel=null;editingId=null}
    setTimeout(scheduleEnhance,0);
  });

  document.addEventListener('japan:cloudApplied',()=>setTimeout(()=>{
    seedTrainEstimates();
    scheduleEnhance();
  },0));

  const style=document.createElement('style');
  style.textContent=`
    .expense-summary-v2{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px!important}
    .expense-summary-v2 .kpi{min-width:0}
    .expense-summary-v2 .remaining-kpi{grid-column:1/-1}
    .budget-chart{grid-column:1/-1;background:#fff;border:1px solid #eadfd8;border-radius:14px;padding:11px 12px;box-shadow:0 2px 10px #0000000a}
    .budget-chart-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:4px 8px;margin-bottom:8px;font-size:clamp(13px,3.5vw,15px);font-weight:900;line-height:1.3}
    .budget-chart-head b{font-size:16px}
    .budget-stack{height:18px;display:flex;direction:ltr;overflow:hidden;border-radius:999px;background:#eee9e5}
    .budget-seg-button{appearance:none;border:0;padding:0;cursor:pointer;min-width:0;transition:opacity .15s}
    .budget-seg-button.is-muted{opacity:.26}
    .budget-seg-button:focus-visible,.expense-legend-choice:focus-visible,.expense-clear-filters:focus-visible{outline:2px solid #2563eb;outline-offset:2px}
    .expense-category-chart{margin-top:0}
    .expense-legend-choice{display:grid;grid-template-columns:10px minmax(0,1fr);align-items:center;column-gap:6px;row-gap:3px;padding:7px 4px;min-height:44px;border:1px solid transparent;border-radius:8px;background:transparent;cursor:pointer;text-align:right;min-width:0;color:inherit;font:inherit;font-size:clamp(13px,3.5vw,14px)}
    .expense-legend-choice b{font-size:clamp(13px,3.5vw,14px);line-height:1.25;white-space:normal;overflow-wrap:anywhere}
    .expense-legend-choice small{grid-column:2;color:#776c65;font-size:clamp(11px,3vw,12px);line-height:1.35;white-space:normal;overflow-wrap:anywhere}
    .expense-legend-choice.is-active{border-color:#cfbda9;background:#fff4e7}
    .expense-category-legend{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 6px;margin-top:8px}
    .expense-clear-filters{border:0;background:transparent;color:#9b4e0e;font:inherit;font-size:12px;font-weight:800;cursor:pointer;min-height:32px}
    .expense-filter-result{margin:6px 0;color:#67574c;font-size:13px;font-weight:700}
    .expense-card[hidden],.filter-row[hidden],.expense-filter-result[hidden]{display:none!important}
    .expense-filter-empty-label{font-size:13px;color:#776c65}
    .budget-seg{display:block;height:100%;flex:0 0 auto}
    .budget-paid{background:#2f855a}.budget-booked{background:#d97706}.budget-estimate{background:#6b7280}
    .budget-legend{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:9px}
    .budget-legend .expense-legend-choice{min-width:0}
    .legend-dot{width:10px;height:10px;border-radius:50%;display:inline-block}
    .compact-expense-card{padding:9px 10px!important;margin:7px 0!important}
    .compact-expense-card .expense-head{gap:7px;align-items:center}
    .compact-expense-card .expense-meta{margin-top:2px;line-height:1.25}
    .compact-expense-card .expense-note{margin-top:4px;line-height:1.35}
    .expense-edit-icon{width:28px;height:28px;min-width:28px;border:1px solid #e2d8d1;background:#fff;border-radius:9px;display:inline-grid;place-items:center;padding:0;font-size:13px;cursor:pointer}
    .expense-budget-mark{display:inline-block;font-weight:1000;font-size:10px;line-height:1}.expense-budget-mark.included{color:#2f855a}.expense-budget-mark.excluded{color:#9ca3af}
    .expense-edit-options{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:4px;padding:9px 10px;background:#faf7f4;border:1px solid #eadfd8;border-radius:11px}
    .expense-edit-include{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:900}.expense-edit-include input{width:18px;height:18px;accent-color:#2f855a}
    .expense-edit-delete{border:1px solid #e7b7b7;background:#fff5f5;color:#a12b2b;border-radius:9px;padding:7px 9px;font-size:10.5px;font-weight:900}
    /* Readable typography on phones and tablets, scoped to the expense page. */
    .expense-summary-v2 .kpi span{font-size:clamp(12px,3.1vw,13px);line-height:1.3}
    .compact-expense-card .expense-meta,.compact-expense-card .expense-note{font-size:clamp(13px,3.5vw,14px);line-height:1.45;overflow-wrap:anywhere}
    .compact-expense-card .expense-status{line-height:1.3}
    .expense-actions-bar button{font-size:clamp(12px,3.2vw,14px)}
    @media(max-width:360px){.expense-legend-choice{padding:6px 2px;column-gap:4px}.budget-legend{gap:2px}}
    .expense-edit-cancel{margin-top:7px}
    @media(min-width:520px){.expense-summary-v2{grid-template-columns:repeat(5,minmax(0,1fr))}.expense-summary-v2 .remaining-kpi{grid-column:auto}.budget-chart{grid-column:1/-1}}
  `;
  document.head.append(style);

  seedTrainEstimates();
  migrateHakoneExpense(false);
  document.addEventListener('japan:cloudApplied',()=>migrateHakoneExpense(true));
  if(window.TRIP_DATA)window.TRIP_DATA.version=VERSION;
  document.documentElement.dataset.appReady='v'+VERSION;
  scheduleEnhance();
})();