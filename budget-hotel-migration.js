// Japan Trip v9.14.1 — one canonical budget entry per active hotel
(()=>{'use strict';
const KEY='japanTrip_expenses_v1';
const canonical=[
 {name:'JR Kyushu Hotel Blossom Shinjuku',status:'מוזמן',payment:'אשראי',currency:'JPY',amount:311616,category:'🏨 לינה',included:true,note:'4–8/11 · Agoda 696266027'},
 {name:'Daiwa Roynet Hotel Kyoto Shijo Karasuma',status:'מוזמן',payment:'אשראי',currency:'JPY',amount:116856,category:'🏨 לינה',included:true,note:'10–14/11 · Agoda 2048972834'},
 {name:'Hotel Royal Classic Osaka',status:'מוזמן',payment:'אשראי',currency:'JPY',amount:109398,category:'🏨 לינה',included:true,note:'14–16/11 · Agoda 693085383'},
 {name:'Hotel Metropolitan Tokyo Marunouchi',status:'שולם',payment:'אשראי',currency:'ILS',amount:676.61,category:'🏨 לינה',included:true,note:'16–17/11 · Klook QXU287073'}
];
const groups=[
 /JR Kyushu Hotel Blossom Shinjuku|^מלון טוקיו$/i,
 /Daiwa Roynet Hotel Kyoto Shijo Karasuma|Richmond Hotel Premier Kyoto Shijo/i,
 /Hotel Royal Classic Osaka|Cross Hotel Osaka/i,
 /Hotel Metropolitan Tokyo Marunouchi|remm Tokyo Kyobashi|מלון טוקיו · לילה אחרון/i
];
function migrate(){let a;try{a=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}if(!Array.isArray(a))return;const keep=a.filter(x=>!groups.some(re=>re.test(String(x.name||''))));const now=Date.now();canonical.forEach((c,i)=>keep.push({...c,id:now+i}));localStorage.setItem(KEY,JSON.stringify(keep));if(typeof window.expRender==='function')window.expRender()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(migrate,700),{once:true});else setTimeout(migrate,700);
})();