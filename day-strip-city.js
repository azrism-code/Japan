/* Japan Trip 2026 · day strip city labels · v10.1.5 */
(() => {
  'use strict';

  function enhanceDayStrip(){
    const days=window.TRIP_DATA?.days;
    const strip=document.getElementById('dayStrip');
    if(!Array.isArray(days)||!strip)return;

    strip.querySelectorAll('.day-chip').forEach((chip,index)=>{
      const city=days[index]?.city;
      if(!city)return;
      let label=chip.querySelector('.day-city');
      if(!label){
        label=document.createElement('em');
        label.className='day-city';
        label.dir='auto';
        chip.append(label);
      }
      if(label.textContent!==city)label.textContent=city;
    });
  }

  const style=document.createElement('style');
  style.textContent=`
    .day-chip{min-width:78px}
    .day-chip .day-city{display:block;max-width:74px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:8.5px;line-height:1.15;font-style:normal;font-weight:850;color:#8d817a}
    .day-chip.active .day-city{color:#fff}
  `;
  document.head.append(style);

  const strip=document.getElementById('dayStrip');
  if(strip){
    const observer=new MutationObserver(()=>requestAnimationFrame(enhanceDayStrip));
    observer.observe(strip,{childList:true});
  }

  window.addEventListener('pageshow',enhanceDayStrip);
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)enhanceDayStrip();
  });

  requestAnimationFrame(enhanceDayStrip);
})();
