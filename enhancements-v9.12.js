// Japan Trip v9.12 — shopping update
(function(){
  'use strict';
  const VERSION='v9.12';
  function addOnitsukaToShoes(){
    const els=[...document.querySelectorAll('h1,h2,h3,h4,p,span,div,li')];
    const shoe=els.find(el=>/נעלי ריצה/.test(el.textContent||'') && el.children.length<8);
    if(!shoe) return;
    const card=shoe.closest('.shop-card,.shopping-card,.card,.check-item,li') || shoe.parentElement;
    if(!card || card.dataset.onitsukaAdded) return;
    card.dataset.onitsukaAdded='1';
    const box=document.createElement('div');
    box.className='onitsuka-shopping-option';
    box.style.cssText='margin-top:9px;padding:9px 10px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;font-size:12px;line-height:1.55';
    box.innerHTML='<b>👟 Onitsuka Tiger</b><br><span>עדיפות: Omotesando ביום 6/11 — ממש על המסלול. חלופות: Ginza / Shinjuku / Namba.</span><br><a href="https://www.google.com/maps/search/?api=1&query=Onitsuka+Tiger+Omotesando+Tokyo" target="_blank" rel="noopener" style="font-weight:800;text-decoration:none">📍 פתח מפה ↗</a>';
    card.appendChild(box);
  }
  function run(){
    addOnitsukaToShoes();
    const v=document.querySelector('header .logo small');if(v)v.textContent='2026 · '+VERSION;
    document.title='Japan Trip 2026 · '+VERSION;
    document.documentElement.dataset.appReady=VERSION;
  }
  let busy=false;const schedule=()=>{if(busy)return;busy=true;setTimeout(()=>{busy=false;run();},100)};
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();
