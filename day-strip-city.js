/* Japan Trip 2026 · day strip city labels · v10.1.6 */
(() => {
  'use strict';

  let pending=false;

  function enhanceDayStrip(){
    pending=false;
    const days=window.TRIP_DATA?.days;
    const strip=document.getElementById('dayStrip');
    if(!Array.isArray(days)||!strip)return false;

    const chips=[...strip.querySelectorAll('.day-chip')];
    if(!chips.length)return false;

    chips.forEach((chip,index)=>{
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

    return chips.every((chip,index)=>!days[index]?.city||chip.querySelector('.day-city'));
  }

  function scheduleEnhance(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(enhanceDayStrip);
  }

  const style=document.createElement('style');
  style.textContent=`
    .day-chip{min-width:78px}
    .day-chip .day-city{display:block;max-width:74px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:8.5px;line-height:1.15;font-style:normal;font-weight:850;color:#8d817a}
    .day-chip.active .day-city{color:#fff}
  `;
  document.head.append(style);

  // app.js and Firestore can rebuild the strip after this file has loaded.
  // Observe the whole document so a replaced #dayStrip is handled too.
  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.type==='childList'))scheduleEnhance();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  window.addEventListener('load',scheduleEnhance);
  window.addEventListener('pageshow',scheduleEnhance);
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)scheduleEnhance();
  });

  // Cover delayed Firebase/auth rendering on a cold refresh.
  let attempts=0;
  const retry=setInterval(()=>{
    attempts++;
    const complete=enhanceDayStrip();
    if(complete||attempts>=40)clearInterval(retry);
  },250);

  scheduleEnhance();
})();
