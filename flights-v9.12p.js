// Japan Trip v9.12p - flight tickets verified against both Emirates e-tickets
(function(){'use strict';
const VERSION='v9.12p';
function $(s,r=document){return r.querySelector(s)}
function setFlightPage(){const page=$('#page-flights');if(!page)return;const head=page.querySelector('.page-head');page.querySelectorAll('.flight-card,.connection-card,.ticket-summary-v912p').forEach(x=>x.remove());const wrap=document.createElement('div');wrap.className='ticket-summary-v912p';wrap.innerHTML=`
<div style="margin:8px 0 12px;padding:11px 12px;border:1px solid #e5e7eb;border-radius:14px;background:#fff"><b>Emirates · Booking IG4JDF · Economy Flex</b><div style="font-size:12px;margin-top:5px">Azriel + Ayala · כבודה לבטן המטוס: 30 ק״ג לכל נוסע בכל מקטע · תיק יד Economy: עד 7 ק״ג</div></div>
<div class="flight-card"><b>03/11 · TLV → DXB</b><strong>13:50 → 18:55</strong><span>EK2269 / FZ1636 · מופעלת ע״י Flydubai · TLV T3 → DXB T3</span></div>
<div class="connection-card">⏱️ קונקשן בדובאי: 3:50</div>
<div class="flight-card"><b>03–04/11 · DXB → NRT</b><strong>22:45 → 13:10 (+1)</strong><span>EK320 · Emirates · DXB T3 → Narita T2 · מושבים: Azriel 48K · Ayala 48J</span></div>
<div class="flight-card"><b>17–18/11 · NRT → DXB</b><strong>21:30 → 04:40 (+1)</strong><span>EK321 · Emirates · Narita T2 → DXB T3 · מושבים: Azriel 32K · Ayala 32J</span></div>
<div class="connection-card">⏱️ קונקשן בדובאי: 1:35</div>
<div class="flight-card"><b>18/11 · DXB → TLV</b><strong>06:15 → 08:05</strong><span>EK2120 / FZ1073 · מופעלת ע״י Flydubai · DXB T3 → TLV T3</span></div>`;
if(head)head.insertAdjacentElement('afterend',wrap);else page.prepend(wrap)}
function setItinerarySeats(){const d0=$('#day-0');if(d0){[...d0.querySelectorAll('.stop-card')].forEach(c=>{if(/Dubai → Tokyo Narita/i.test(c.querySelector('h3')?.textContent||'')){const p=c.querySelector('p');if(p)p.textContent='EK320 · Economy Flex · מושבים: Azriel 48K · Ayala 48J · DXB Terminal 3 → Narita Terminal 2.'}})}const d14=$('#day-14');if(d14){[...d14.querySelectorAll('.stop-card')].forEach(c=>{const h=c.querySelector('h3')?.textContent||'';if(/Narita.*Dubai|Tokyo.*Dubai|NRT.*DXB/i.test(h)){const p=c.querySelector('p');if(p)p.textContent='EK321 · Economy Flex · 21:30 → 04:40 (+1) · מושבים: Azriel 32K · Ayala 32J · Narita Terminal 2 → Dubai Terminal 3.'}})}}
function version(){const v=$('header .logo .app-version')||$('header .logo small');if(v)v.textContent='2026 · '+VERSION;document.title='Japan Trip 2026 · '+VERSION;document.documentElement.dataset.appReady=VERSION}
function run(){setFlightPage();setItinerarySeats();version()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,450),{once:true});else setTimeout(run,450);setTimeout(run,1300);setTimeout(version,2200);
})();