/* Japan Trip 2026 · compact expense controls + budget summary · v10.3.12 */
(() => {
  'use strict';
  const VERSION='10.3.12';
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

  function enhanceSummary(body){
    const summary=body.querySelector(':scope > .expense-summary');
    if(!summary)return;

    const t=budgetData();
    const denom=Math.max(t.budget,t.used,1);
    const paidW=t.paid/denom*100, bookedW=t.booked/denom*100, estimateW=t.estimate/denom*100;
    const pct=t.budget?Math.round(t.used/t.budget*100):0;

    summary.classList.add('expense-summary-v2');
    summary.innerHTML=`
      <div class="kpi budget-total"><span>תקציב כולל</span><b>${money(t.budget)}</b></div>
      <div class="kpi paid-kpi"><span>שולם בפועל</span><b>${money(t.paid)}</b></div>
      <div class="kpi booked-kpi"><span>הוזמן</span><b>${money(t.booked)}</b></div>
      <div class="kpi estimate-kpi"><span>הערכה</span><b>${money(t.estimate)}</b></div>
      <div class="kpi remaining-kpi"><span>נותר בתקציב</span><b>${money(t.remaining)}</b></div>
      <div class="budget-chart">
        <div class="budget-chart-head"><span>ניצול תקציב</span><b>${pct}%</b></div>
        <div class="budget-stack" aria-label="ניצול תקציב: שולם, הוזמן והערכה">
          <i class="budget-seg budget-paid" style="width:${paidW}%" title="שולם בפועל ${money(t.paid)}"></i>
          <i class="budget-seg budget-booked" style="width:${bookedW}%" title="הוזמן ${money(t.booked)}"></i>
          <i class="budget-seg budget-estimate" style="width:${estimateW}%" title="הערכה ${money(t.estimate)}"></i>
        </div>
        <div class="budget-legend">
          <span><i class="legend-dot budget-paid"></i><b>שולם</b><small>${money(t.paid)}</small></span>
          <span><i class="legend-dot budget-booked"></i><b>הוזמן</b><small>${money(t.booked)}</small></span>
          <span><i class="legend-dot budget-estimate"></i><b>הערכה</b><small>${money(t.estimate)}</small></span>
        </div>
      </div>`;
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

    const hotelFilter=body.querySelector('.filter-row [data-exp-filter="🏨 לינה"]');
    if(hotelFilter)hotelFilter.textContent='🏨 מלונות';
    enhanceExpenseCards(body);
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
    .budget-chart-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;font-size:12px;font-weight:900}
    .budget-chart-head b{font-size:16px}
    .budget-stack{height:14px;display:flex;direction:ltr;overflow:hidden;border-radius:999px;background:#eee9e5}
    .budget-seg{display:block;height:100%;flex:0 0 auto}
    .budget-paid{background:#2f855a}.budget-booked{background:#d97706}.budget-estimate{background:#6b7280}
    .budget-legend{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:9px}
    .budget-legend span{display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:5px;row-gap:1px;font-size:10px;min-width:0}
    .budget-legend small{grid-column:2;color:#776c65;font-size:9.5px;white-space:nowrap}
    .legend-dot{width:8px;height:8px;border-radius:50%;display:inline-block}
    .compact-expense-card{padding:9px 10px!important;margin:7px 0!important}
    .compact-expense-card .expense-head{gap:7px;align-items:center}
    .compact-expense-card .expense-meta{margin-top:2px;line-height:1.25}
    .compact-expense-card .expense-note{margin-top:4px;line-height:1.35}
    .expense-edit-icon{width:28px;height:28px;min-width:28px;border:1px solid #e2d8d1;background:#fff;border-radius:9px;display:inline-grid;place-items:center;padding:0;font-size:13px;cursor:pointer}
    .expense-budget-mark{display:inline-block;font-weight:1000;font-size:10px;line-height:1}.expense-budget-mark.included{color:#2f855a}.expense-budget-mark.excluded{color:#9ca3af}
    .expense-edit-options{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:4px;padding:9px 10px;background:#faf7f4;border:1px solid #eadfd8;border-radius:11px}
    .expense-edit-include{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:900}.expense-edit-include input{width:18px;height:18px;accent-color:#2f855a}
    .expense-edit-delete{border:1px solid #e7b7b7;background:#fff5f5;color:#a12b2b;border-radius:9px;padding:7px 9px;font-size:10.5px;font-weight:900}
    .expense-edit-cancel{margin-top:7px}
    @media(min-width:520px){.expense-summary-v2{grid-template-columns:repeat(5,minmax(0,1fr))}.expense-summary-v2 .remaining-kpi{grid-column:auto}.budget-chart{grid-column:1/-1}}
  `;
  document.head.append(style);

  seedTrainEstimates();
  if(window.TRIP_DATA)window.TRIP_DATA.version=VERSION;
  document.documentElement.dataset.appReady='v'+VERSION;
  scheduleEnhance();
})();