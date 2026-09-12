/* Japan Trip 2026 · expense delete safety · v10.0.7 */
(() => {
  'use strict';
  const EXP_KEY='japanTrip_expenses_v1';
  const TRASH_KEY='japanTrip_expenses_trash_v1';
  let undoTimer=null;

  function read(key,fallback){
    try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch(e){return fallback}
  }
  function write(key,value){localStorage.setItem(key,JSON.stringify(value))}
  function expensesButton(){return document.querySelector('[data-page="expenses"]')}
  function refreshExpenses(){setTimeout(()=>expensesButton()?.click(),0)}

  function getTrash(){
    const t=read(TRASH_KEY,null);
    return t&&t.item?t:null;
  }

  function addRestoreButton(){
    const page=document.querySelector('#sheetPage.open');
    if(!/הוצאות/.test(page?.querySelector('.page-head h2')?.textContent||''))return;
    const body=page.querySelector('.page-body');
    const bar=body?.querySelector('.expense-actions-bar');
    if(!body||!bar)return;
    body.querySelector('.expense-restore-row')?.remove();
    const trash=getTrash();
    if(!trash)return;
    const row=document.createElement('div');
    row.className='expense-restore-row';
    const btn=document.createElement('button');
    btn.type='button';
    btn.dataset.expUndo='1';
    btn.textContent='↩️ שחזר מחיקה אחרונה: '+(trash.item.name||'הוצאה');
    row.append(btn);
    bar.insertAdjacentElement('afterend',row);
  }

  function showUndoToast(trash){
    document.querySelector('.expense-undo-toast')?.remove();
    if(undoTimer)clearTimeout(undoTimer);
    const toast=document.createElement('div');
    toast.className='expense-undo-toast';
    const label=document.createElement('span');
    label.textContent='נמחק: '+(trash.item.name||'הוצאה');
    const button=document.createElement('button');
    button.type='button';
    button.dataset.expUndo='1';
    button.textContent='בטל מחיקה';
    toast.append(label,button);
    document.body.append(toast);
    undoTimer=setTimeout(()=>toast.remove(),10000);
  }

  function restore(){
    const trash=getTrash();
    if(!trash)return;
    const items=read(EXP_KEY,[]);
    if(!Array.isArray(items))return;
    if(!items.some(x=>String(x.id)===String(trash.item.id))){
      const index=Math.max(0,Math.min(Number(trash.index)||0,items.length));
      items.splice(index,0,trash.item);
      write(EXP_KEY,items);
    }
    localStorage.removeItem(TRASH_KEY);
    document.querySelector('.expense-undo-toast')?.remove();
    if(undoTimer)clearTimeout(undoTimer);
    refreshExpenses();
  }

  function removeWithConfirmation(del,event){
    event.preventDefault();
    event.stopImmediatePropagation();
    const items=read(EXP_KEY,[]);
    if(!Array.isArray(items))return;
    const index=items.findIndex(x=>String(x.id)===String(del.dataset.expDelete));
    if(index<0)return;
    const item=items[index];
    const name=item.name||'ההוצאה הזו';
    if(!window.confirm('למחוק את "'+name+'"?'))return;
    const trash={item,index,deletedAt:new Date().toISOString()};
    write(TRASH_KEY,trash);
    items.splice(index,1);
    write(EXP_KEY,items);
    refreshExpenses();
    setTimeout(()=>{addRestoreButton();showUndoToast(trash)},40);
  }

  document.addEventListener('click',event=>{
    const del=event.target.closest('[data-exp-delete]');
    if(del){removeWithConfirmation(del,event);return;}
    const undo=event.target.closest('[data-exp-undo]');
    if(undo){event.preventDefault();event.stopImmediatePropagation();restore();}
  },true);

  document.addEventListener('click',event=>{
    if(event.target.closest('[data-page="expenses"],[data-exp-filter],[data-action="save-exp-settings"],[data-action="add-expense"]')){
      setTimeout(addRestoreButton,0);
    }
  });
  document.addEventListener('change',event=>{
    if(event.target.matches('[data-exp-include]'))setTimeout(addRestoreButton,0);
  });

  const style=document.createElement('style');
  style.textContent='.expense-restore-row{margin:-2px 0 10px}.expense-restore-row button{width:100%;border:1px solid #d7e8db;background:#f4fbf5;color:#2f6d3d;border-radius:11px;padding:8px 10px;font-size:10.5px;font-weight:900}.expense-undo-toast{position:fixed;z-index:120;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom,0px));max-width:520px;margin:auto;background:#2f2926;color:#fff;border-radius:13px;padding:10px 12px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 28px #0004;font-size:12px}.expense-undo-toast span{flex:1}.expense-undo-toast button{border:0;border-radius:9px;background:#fff0df;color:#9a4d08;padding:7px 10px;font-weight:900;white-space:nowrap}';
  document.head.append(style);
})();
