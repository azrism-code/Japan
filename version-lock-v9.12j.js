// Japan Trip v9.12j — visible version lock
(function(){'use strict';
const VERSION='v9.12j';
function lockVersion(){
  const logo=document.querySelector('header .logo');
  if(!logo)return;
  let v=logo.querySelector('.app-version');
  if(!v){
    const old=logo.querySelector('small');
    if(old){v=document.createElement('span');v.className='app-version';v.style.cssText=old.getAttribute('style')||'';old.replaceWith(v)}
  }
  if(v)v.textContent='2026 · '+VERSION;
  document.title='Japan Trip 2026 · '+VERSION;
  document.documentElement.dataset.appReady=VERSION;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lockVersion);else lockVersion();
window.addEventListener('pageshow',lockVersion);
setTimeout(lockVersion,100);setTimeout(lockVersion,500);setTimeout(lockVersion,1500);
})();