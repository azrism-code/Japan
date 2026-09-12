/* Japan Trip 2026 · day strip city labels · v10.1.4 */
(() => {
  'use strict';

  function enhanceDayStrip(){
    const days=window.TRIP_DATA?.days;
    const strip=document.getElementById('dayStrip');
    if(!Array.isArray(days)||!strip)return;

    strip.querySelectorAll('.day-chip').forEach((chip,index)=>{
      chip.querySelector('.day-city')?.remove();
      const city=days[index]?.city;
      if(!city)return;
      const label=document.createElement('em');
      label.className='day-city';
      label.dir='auto';
      label.textContent=city;
      chip.append(label);
    });
  }

  const style=document.createElement('style');
  style.textContent=`
    .day-chip{min-width:78px}
    .day-chip .day-city{display:block;max-width:74px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:8.5px;line-height:1.15;font-style:normal;font-weight:850;color:#8d817a}
    .day-chip.active .day-city{color:#fff}
  `;
  document.head.append(style);

  document.addEventListener('click',event=>{
    if(event.target.closest('[data-day],[data-nav="trip"]'))setTimeout(enhanceDayStrip,0);
  });

  setTimeout(enhanceDayStrip,0);
})();
