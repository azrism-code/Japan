// Japan Trip v9.12j - popup dedupe + teamLab Kyoto mandatory
(function(){'use strict';
const VERSION='v9.12j';
const norm=s=>(s||'').replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim().toLowerCase();
function words(s){return new Set(norm(s).split(' ').filter(x=>x.length>2))}
function sim(a,b){a=norm(a);b=norm(b);if(!a||!b)return 0;if(a===b||a.includes(b)||b.includes(a))return 1;const A=words(a),B=words(b);let n=0;A.forEach(x=>B.has(x)&&n++);return n/Math.max(1,Math.min(A.size,B.size))}
function cleanPopup(){const m=document.querySelector('#placeModal,.place-modal,.modal.open,.modal.show');if(!m)return;const desc=m.querySelector('#modalDesc,.modal-desc,.place-desc');if(!desc)return;const base=desc.textContent||'';
 // Remove only duplicate sentences/bullets from the expanded 'why worth it' section; preserve genuinely new facts.
 const heads=[...m.querySelectorAll('h2,h3,h4,b,strong')].filter(x=>/למה.*שווה|why.*worth/i.test(x.textContent||''));
 heads.forEach(h=>{let box=h.closest('.why-worth,.modal-section,.guide-section,.info-box,.detail-box')||h.parentElement;if(!box)return;[...box.querySelectorAll('li,p')].forEach(n=>{if(n===desc||desc.contains(n))return;if(sim(base,n.textContent||'')>.62)n.remove()});if(!box.querySelector('li,p')&&box!==h.parentElement)box.style.display='none'});
 // Also catch duplicate leaf text anywhere below the description, without deleting the short tip card.
 const leaves=[...m.querySelectorAll('li')];leaves.forEach(n=>{if(sim(base,n.textContent||'')>.72)n.remove()});
}
function makeTeamLabMandatory(){const day=document.getElementById('day-9');if(day){const cards=[...day.querySelectorAll('.stop')];let s=cards.find(x=>/teamLab Biovortex Kyoto/i.test(x.textContent||''));if(s){const h=s.querySelector('h3');if(h)h.textContent='teamLab Biovortex Kyoto · חובה';const p=s.querySelector('p');if(p)p.textContent='אחת מחוויות החובה של הטיול. נשלב אותה בערב בקיוטו ונזמין כרטיסים מראש; היא אינה אופציה לביטול מהמסלול.';let tag=s.querySelector('.trip-tag');if(!tag){tag=document.createElement('span');tag.className='trip-tag';s.querySelector('.stop-card')?.appendChild(tag)}if(tag)tag.textContent='⭐ חובה · להזמין מראש';}}
 document.querySelectorAll('[data-place="teamLab Biovortex Kyoto"],.place-card').forEach(el=>{if(!/teamLab Biovortex Kyoto/i.test((el.dataset?.place||'')+' '+(el.textContent||'')))return;el.querySelectorAll('p,.place-card-tip,.scheduled-badge').forEach(n=>{n.innerHTML=n.innerHTML.replace(/אופציה לערב בלבד|אופציה|לא חובה/g,'חובה · להזמין מראש')});});
}
function version(){const v=document.querySelector('header .logo small,header .logo .app-version');if(v)v.textContent='2026 · '+VERSION;document.title='Japan Trip 2026 · '+VERSION;document.documentElement.dataset.appReady=VERSION}
function run(){makeTeamLabMandatory();cleanPopup();version()}
let busy=false;function schedule(){if(busy)return;busy=true;setTimeout(()=>{busy=false;run()},180)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
document.addEventListener('click',e=>{if(e.target.closest('.guide-tips-btn,.info-modal-btn,.place-info-btn'))setTimeout(cleanPopup,220)},true);
window.addEventListener('pageshow',schedule);
})();