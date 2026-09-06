(()=>{
'use strict';
const VER='v9.12w';
function apply(){
  const h=document.querySelector('#day-0 .day-heading h2');
  if(h) h.textContent='עזרי ואיילי יוצאים לדרך ✈️';
  document.querySelectorAll('[id*=version],.version,.version-label').forEach(e=>{if(/v?9\.12|version|גרסה/i.test(e.textContent||''))e.textContent=VER});
}
setTimeout(apply,1200);
setTimeout(apply,2200);
})();