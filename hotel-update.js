// Japan Trip v9.13.7 — canonical Kyoto hotel override
(()=>{'use strict';
const OLD='Richmond Hotel Premier Kyoto Shijo';
const NEW='Daiwa Roynet Hotel Kyoto Shijo Karasuma';
const replacements=[
 [OLD,NEW],
 ['50 Kasaboko Town, Shimogyo Ward','678 Omandokorocho, Karasumadori, Shimogyo-ku, Kyoto 600-8413'],
 ['Moderate Double · Non-Smoking · 2 Adults · 4 nights','Moderate Double Room · Newly Renovated · Non-Smoking · 2 Adults · 4 nights'],
 ['Breakfast + Wi-Fi','Wi-Fi + coffee/tea · Room only'],
 ['¥159,420 · Pay later','¥116,856 · Pay later'],
 ['Shijo / Karasuma','Kyoto Subway Shijo Station · Exit 5 · כ־1 דקה מהיציאה']
];
function replaceText(root=document.body){if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);for(const n of nodes){let s=n.nodeValue||'',x=s;for(const [a,b] of replacements)x=x.split(a).join(b);if(x!==s)n.nodeValue=x}}
function fixLinks(){document.querySelectorAll('a[href*="google.com/maps"]').forEach(a=>{const near=a.closest('.hotel-card,.hotel-item,.booking-card,.stop-card')||a.parentElement;if(near&&near.textContent.includes(NEW))a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(NEW)})}
function fixEveningModal(){const m=document.querySelector('#eveningWalkModal');if(!m)return;replaceText(m)}
function run(){replaceText();fixLinks();fixEveningModal()}
run();setTimeout(run,250);setTimeout(run,1000);
document.addEventListener('click',e=>{if(e.target.closest('.evening-walk-btn,.reservation-doc-open,.reservation-doc-replace'))setTimeout(run,0)},true);
window.addEventListener('japanTripDriveSynced',()=>setTimeout(run,0));
})();