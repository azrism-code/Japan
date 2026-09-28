/* Japan Trip 2026 · Romancecar plan · v10.2.4 */
(() => {
  'use strict';
  const T=window.TRIP_DATA;
  if(!T)return;

  const seatTip='במערכת Odakyu המושבים הרלוונטיים הם C ו-D. מושב D הוא מושב החלון בצד של הר פוג׳י, ו-C הוא המושב הסמוך לו במעבר. בנסיעה הלוך מטוקיו להאקונה מומלץ לבחור בשורה עם מספר אי-זוגי כדי לקבל חלון פנורמי גדול וללא חסימות של עמודי המסגרת של הרכבת.';

  const day=T.days?.find(d=>d.date==='08/11');
  if(day){
    const stops=day.stops||[];
    let rideIndex=stops.findIndex(s=>/Shinjuku → Odawara|Romancecar/.test(s.title||''));
    let checkout=stops.find(s=>/Check-out.*Shinjuku Prince Hotel/.test(s.title||''));
    if(!checkout){
      checkout={
        time:'08:50',
        icon:'🏨',
        title:'Check-out · Shinjuku Prince Hotel',
        text:'Check-out ויציאה עם המזוודות לכיוון Odakyu Shinjuku Station לקראת ה-Romancecar של 09:20.'
      };
      stops.splice(rideIndex>=0?rideIndex:0,0,checkout);
      rideIndex=stops.indexOf(checkout)+1;
    }else{
      Object.assign(checkout,{
        time:'08:50',
        icon:'🏨',
        title:'Check-out · Shinjuku Prince Hotel',
        text:'Check-out ויציאה עם המזוודות לכיוון Odakyu Shinjuku Station לקראת ה-Romancecar של 09:20.'
      });
    }

    const ride=stops.find(s=>/Shinjuku → Odawara|Romancecar/.test(s.title||''));
    if(ride)Object.assign(ride,{
      time:'09:20',
      icon:'🚆',
      title:'Romancecar · Shinjuku → Odawara',
      text:'Hakone 7 · יציאה 09:20 מ-Odakyu Shinjuku · הגעה 10:35 ל-Odawara. איסוף הרכב ב-11:00, כך שנשארות כ־25 דקות.',
      tag:'⭐ הרכבת המתוכננת'
    });

    const currentRideIndex=stops.indexOf(ride);
    let tip=stops.find(s=>/טיפ לבחירת מושבים.*Romancecar/.test(s.title||''));
    if(!tip){
      tip={
        time:'טיפ',
        icon:'💺',
        title:'טיפ לבחירת מושבים · Romancecar',
        text:seatTip,
        tag:'⭐ D = חלון בצד Fuji · C = מעבר לידו'
      };
      stops.splice(currentRideIndex>=0?currentRideIndex+1:1,0,tip);
    }else{
      Object.assign(tip,{time:'טיפ',icon:'💺',title:'טיפ לבחירת מושבים · Romancecar',text:seatTip,tag:'⭐ D = חלון בצד Fuji · C = מעבר לידו'});
    }
  }

  if(Array.isArray(T.trains)){
    const row=T.trains.find(x=>Array.isArray(x)&&/^8\/11 · Shinjuku → Odawara/.test(x[0]||''));
    if(row)row[1]='08:50 Check-out מ-Shinjuku Prince Hotel ויציאה ל-Odakyu Shinjuku · Romancecar Hakone 7 · 09:20 Shinjuku → 10:35 Odawara · מושב שמור. איסוף הרכב ב-11:00. 💡 '+seatTip;
  }
})();
