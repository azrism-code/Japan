// Japan Trip v9.12g - dedupe place explanations and tidy Nov 12
(function(){'use strict';
function norm(s){return(s||'').replace(/\s+/g,' ').trim().toLowerCase()}
function dedupeGuides(){
  document.querySelectorAll('.modal,.place-modal,.guide-modal,.place-detail,.guide-content').forEach(root=>{
    const nodes=[...root.querySelectorAll('p,div,li')].filter(x=>x.children.length===0&&norm(x.textContent).length>25);
    const seen=new Map();
    nodes.forEach(n=>{const t=norm(n.textContent);if(seen.has(t)){const prev=seen.get(t);const ctx=norm((n.parentElement&&n.parentElement.textContent)||'');if(/למה.*שווה|why.*worth/.test(ctx)||/למה.*שווה|why.*worth/.test(norm((prev.parentElement&&prev.parentElement.textContent)||'')))n.remove()}else seen.set(t,n)});
  });
  document.querySelectorAll('h3,h4,b,strong').forEach(h=>{
    if(!/למה.*שווה|why.*worth/i.test(h.textContent||''))return;
    const section=h.parentElement;if(!section)return;
    const desc=section.parentElement&&section.parentElement.querySelector('p');
    const worth=section.querySelector('p');
    if(desc&&worth&&norm(desc.textContent)===norm(worth.textContent))section.remove();
  });
}
function tidy12(){
  const day=document.getElementById('day-9');if(!day)return;const list=day.querySelector('.list-view');if(!list)return;
  [...day.querySelectorAll('p,.note,.day-note,.tip,.summary')].forEach(n=>{if(/יום נוסף|יום פנוי נוסף|extra day|יום גמיש נוסף/i.test(n.textContent||''))n.remove()});
  const hotels=[...list.querySelectorAll('.stop')].filter(s=>/Richmond Hotel Premier Kyoto Shijo|לינה.*Richmond|מלון.*Richmond/i.test(s.textContent||''));
  hotels.forEach(h=>list.appendChild(h));
}
function version(){const v=document.querySelector('header .logo small');if(v)v.textContent='2026 · v9.12g'}
function run(){dedupeGuides();tidy12();version()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,100));else setTimeout(run,100);
window.addEventListener('pageshow',()=>setTimeout(run,100));
})();