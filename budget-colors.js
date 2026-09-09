// Japan Trip — budget card status colors
(()=>{'use strict';
function install(){
  if(document.getElementById('budgetStatusColors'))return;
  const s=document.createElement('style');s.id='budgetStatusColors';
  s.textContent='#page-expenses .exp-card.status-paid{background:#eaf6ff;border-color:#b9ddf5}#page-expenses .exp-card.status-booked{background:#eef8ef;border-color:#c8e6cb}';
  document.head.appendChild(s);
  if(typeof window.expCard==='function'&&!window.__budgetStatusWrapped){
    window.__budgetStatusWrapped=1;const old=window.expCard;
    window.expCard=function(x,settings){let html=old(x,settings);if(x&&x.status==='שולם')html=html.replace('class="exp-card','class="exp-card status-paid');else if(x&&x.status==='מוזמן')html=html.replace('class="exp-card','class="exp-card status-booked');return html;};
    if(typeof window.expRender==='function')window.expRender();
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();