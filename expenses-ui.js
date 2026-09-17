/* Japan Trip 2026 · compact expense controls + budget summary · v10.2.7 */
(() => {
  'use strict';
  const VERSION='10.2.7';
  const EXP_KEY='japanTrip_expenses_v1';
  const SETTINGS_KEY='japanTrip_expense_settings_v1';
  let openPanel=null, uiPending=false;

  function isExpensesPage(page){
    return /הוצאות/.test(page?.querySelector('.page-head h2')?.textContent||'');
  }

  function read(key,fallback){
    try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch(_){return fallback}
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

  function enhanceExpenses(){
    const page=document.querySelector('#sheetPage.open');
    if(!page||!isExpensesPage(page))return;
    const body=page.querySelector('.page-body');
    if(!body)return;

    enhanceSummary(body);

    const cards=[...body.querySelectorAll(':scope > .card')];
    const settings=cards.find(c=>/שערים ותקציב/.test(c.querySelector('h3')?.textContent||''));
    const add=cards.find(c=>/הוסף הוצאה/.test(c.querySelector('h3')?.textContent||''));
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
  }

  function scheduleEnhance(){
    if(uiPending)return;
    uiPending=true;
    requestAnimationFrame(()=>{uiPending=false;enhanceExpenses()});
  }

  function togglePanel(which){
    openPanel=openPanel===which?null:which;
    enhanceExpenses();
    if(openPanel){
      const target=document.querySelector(openPanel==='settings'?'.expense-settings-panel':'.expense-add-panel');
      target?.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }

  // Capture before app.js handles the delete, so accidental taps can be cancelled safely.
  document.addEventListener('click',e=>{
    const del=e.target.closest('[data-exp-delete]');
    if(!del)return;
    const name=del.closest('.expense-card')?.querySelector('.expense-head b')?.textContent?.trim()||'ההוצאה הזו';
    if(!window.confirm(`למחוק את "${name}"?`)){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);

  document.addEventListener('click',e=>{
    const panelButton=e.target.closest('[data-exp-panel]');
    if(panelButton){
      e.preventDefault();
      togglePanel(panelButton.dataset.expPanel);
      return;
    }

    const trigger=e.target.closest('[data-page="expenses"],[data-exp-filter],[data-exp-delete],[data-action="save-exp-settings"],[data-action="add-expense"]');
    if(!trigger)return;
    if(trigger.dataset.action==='save-exp-settings'||trigger.dataset.action==='add-expense')openPanel=null;
    setTimeout(scheduleEnhance,0);
  });

  document.addEventListener('change',e=>{
    if(e.target.matches('[data-exp-include]'))setTimeout(scheduleEnhance,0);
  });
  document.addEventListener('japan:cloudApplied',()=>setTimeout(scheduleEnhance,0));

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
    @media(min-width:520px){.expense-summary-v2{grid-template-columns:repeat(5,minmax(0,1fr))}.expense-summary-v2 .remaining-kpi{grid-column:auto}.budget-chart{grid-column:1/-1}}
  `;
  document.head.append(style);

  if(window.TRIP_DATA)window.TRIP_DATA.version=VERSION;
  document.documentElement.dataset.appReady='v'+VERSION;
  scheduleEnhance();
})();