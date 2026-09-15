/* Japan Trip 2026 · Romancecar plan · v10.2.2 */
(() => {
  'use strict';
  const T=window.TRIP_DATA;
  if(!T)return;

  const day=T.days?.find(d=>d.date==='08/11');
  if(day){
    const ride=day.stops?.find(s=>/Shinjuku → Odawara|Romancecar/.test(s.title||''));
    if(ride)Object.assign(ride,{
      time:'09:20',
      icon:'🚆',
      title:'Romancecar · Shinjuku → Odawara',
      text:'Hakone 7 · יציאה 09:20 מ-Odakyu Shinjuku · הגעה 10:35 ל-Odawara. איסוף הרכב ב-11:00, כך שנשארות כ־25 דקות.',
      tag:'⭐ הרכבת המתוכננת'
    });
  }

  if(Array.isArray(T.trains)){
    const row=T.trains.find(x=>Array.isArray(x)&&/^8\/11 · Shinjuku → Odawara/.test(x[0]||''));
    if(row)row[1]='Romancecar Hakone 7 · 09:20 Shinjuku → 10:35 Odawara · מושב שמור. איסוף הרכב ב-11:00.';
  }
})();
