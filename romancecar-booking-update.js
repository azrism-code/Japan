/* Japan Trip 2026 · Romancecar booking planner detail · v10.2.2 */
(() => {
  'use strict';
  const planner=window.JapanBookingPlanner;
  const item=planner?.items?.find(x=>x.id==='romancecar-shinjuku-odawara');
  if(!item)return;
  item.tripDate='8/11 · 09:20 → 10:35';
  item.whenNote='המכירה נפתחת חודש לפני. היעד שלנו: Hakone 7 בשעה 09:20 מ-Shinjuku, הגעה 10:35 ל-Odawara; איסוף הרכב ב-11:00.';
})();
