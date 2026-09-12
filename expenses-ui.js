/* Japan Trip 2026 · compact expense controls · v10.0.5 */
(() => {
  'use strict';
  const VERSION='10.0.5';
  let openPanel=null;

  function isExpensesPage(page){
    return /הוצאות/.test(page?.querySelector('.page-head h2')?.textContent||'');
  }

  function enhanceExpenses(){
    const page=document.querySelector('#sheetPage.open');
    if(!page||!isExpensesPage(page))return;
    const body=page.querySelector('.page-body');
    if(!body)return;

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
  }

  function togglePanel(which){
    openPanel=openPanel===which?null:which;
    enhanceExpenses();
    if(openPanel){
      const target=document.querySelector(openPanel==='settings'?'.expense-settings-panel':'.expense-add-panel');
      target?.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }

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
    setTimeout(enhanceExpenses,0);
  });

  document.addEventListener('change',e=>{
    if(e.target.matches('[data-exp-include]'))setTimeout(enhanceExpenses,0);
  });

  if(window.TRIP_DATA)window.TRIP_DATA.version=VERSION;
  document.documentElement.dataset.appReady='v'+VERSION;
})();
