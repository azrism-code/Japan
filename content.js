/* Japan Trip 2026 · route copy normalization · v10.0.0
   Deterministic enrichment from the canonical place descriptions before the UI renders. */
(() => {
  'use strict';
  const T=window.TRIP_DATA;
  if(!T?.days||!T?.places)return;
  const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
  T.days.forEach(day=>{
    (day.stops||[]).forEach(stop=>{
      if(!stop.place)return;
      const p=T.places[stop.place];
      if(!p?.desc)return;
      const current=String(stop.text||'').trim();
      const desc=String(p.desc||'').trim();
      if(!current){stop.text=desc;return;}
      const a=norm(current),b=norm(desc);
      if(a===b||a.includes(b)||b.includes(a))return;
      if(current.length<135)stop.text=current+' '+desc;
    });
  });
})();
