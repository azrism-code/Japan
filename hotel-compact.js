/* Japan Trip 2026 · compact hotel view · v10.1.9 */
(() => {
  'use strict';
  const T=window.TRIP_DATA;

  function enhanceHotels(openKey=''){
    const page=document.querySelector('#sheetPage.open');
    if(!page||!/מלונות/.test(page.querySelector('.page-head h2')?.textContent||''))return;

    page.querySelectorAll('.hotel-city').forEach(section=>{
      const key=(section.id||'').replace(/^hotel-/,'');
      const h=T?.hotels?.find(x=>x.key===key);
      if(!h)return;
      const heading=section.querySelector(':scope > h3');
      if(heading)heading.hidden=true;

      const card=section.querySelector(':scope > .hotel-card');
      if(card&&!card.dataset.compact){
        card.dataset.compact='1';
        card.classList.add('hotel-compact-card');
        const title=card.querySelector(':scope > .hotel-title');
        if(title){
          let anchor=title;
          if(h.provider){
            const provider=document.createElement('div');
            provider.className='hotel-compact-provider';
            provider.textContent='🏷️ הוזמן דרך '+h.provider;
            anchor.after(provider);
            anchor=provider;
          }
          const meta=document.createElement('div');
          meta.className='hotel-compact-meta';
          meta.textContent='📍 '+h.city+'   ·   📅 '+h.dates;
          anchor.after(meta);
        }
        const details=document.createElement('details');
        details.className='hotel-more-details';
        details.innerHTML='<summary>פרטים מלאים <span>⌄</span></summary>';
        ['.hotel-detail-grid','.hotel-doc-title','.doc-slot','.hotel-actions'].forEach(sel=>{
          const node=card.querySelector(':scope > '+sel);
          if(node)details.append(node);
        });
        card.append(details);
      }

      const note=section.querySelector(':scope > .hotel-note');
      if(note&&!note.dataset.compact){
        note.dataset.compact='1';
        note.classList.add('hotel-compact-card');
        const original=note.innerHTML;
        const provider=h.provider?'<div class="hotel-compact-provider">🏷️ הוזמן דרך '+h.provider+'</div>':'';
        note.innerHTML='<div class="hotel-title"><b>'+h.name+'</b><span class="status-badge pending">טרם הוזמן</span></div>'+provider+'<div class="hotel-compact-meta">📍 '+h.city+'   ·   📅 '+h.dates+'</div><details class="hotel-more-details"><summary>פרטים מלאים <span>⌄</span></summary><div class="hotel-pending-detail">'+original+'</div></details>';
      }

      if(openKey&&key===openKey)section.querySelector('.hotel-more-details')?.setAttribute('open','');
    });
  }

  const style=document.createElement('style');
  style.textContent='.hotel-city{margin-bottom:10px}.hotel-compact-card{margin:7px 0;padding:12px 13px}.hotel-compact-provider{margin-top:6px;color:#5f5148;font-size:10.5px;font-weight:850}.hotel-compact-meta{margin-top:5px;color:#776c65;font-size:10.5px;font-weight:750}.hotel-more-details{margin-top:10px;border-top:1px solid #eee5df;padding-top:2px}.hotel-more-details>summary{list-style:none;display:flex;justify-content:space-between;padding:9px 1px 6px;color:#a8560b;font-size:11px;font-weight:900;cursor:pointer}.hotel-more-details>summary::-webkit-details-marker{display:none}.hotel-more-details[open]>summary span{transform:rotate(180deg)}.hotel-more-details>summary span{transition:transform .18s}.hotel-pending-detail{padding:7px 0;color:#70655f;font-size:12px;line-height:1.55}';
  document.head.append(style);

  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-page="hotels"],[data-hotel-open]');
    if(trigger)setTimeout(()=>enhanceHotels(trigger.dataset.hotelOpen||''),0);
  });

  const sheet=document.getElementById('sheetPage');
  if(sheet)new MutationObserver(()=>requestAnimationFrame(()=>enhanceHotels())).observe(sheet,{childList:true});
})();
