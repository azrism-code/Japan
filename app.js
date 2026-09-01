// Japan Trip v9.7 loader
// Reuse the proven inline logic from the preserved legacy build while keeping
// the current split HTML/CSS structure. Each legacy script is injected as a
// separate classic script so one bad legacy block cannot stop the others.
(async function bootJapanTrip(){
  try{
    const res=await fetch('./index.htm?v=97',{cache:'no-store'});
    if(!res.ok) throw new Error('legacy source '+res.status);
    const html=await res.text();
    const doc=new DOMParser().parseFromString(html,'text/html');
    const scripts=[...doc.querySelectorAll('script')]
      .map(s=>s.textContent||'')
      .filter(Boolean)
      // Skip the old broken duplicate checklist/filter block.
      .filter(t=>!t.includes("const TK='japanTrip_take_v1'"))
      // Service worker registration is handled below.
      .filter(t=>!t.includes("navigator.serviceWorker.register('./service-worker.js')"));

    for(const code of scripts){
      const s=document.createElement('script');
      s.textContent=code;
      document.body.appendChild(s);
    }

    // v9.6+ current-day behavior, kept outside the legacy source.
    const tripStart=new Date(2026,10,3), tripEnd=new Date(2026,10,17), now=new Date();
    const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    if(today>=tripStart&&today<=tripEnd&&typeof showDay==='function'){
      const i=Math.round((today-tripStart)/86400000);
      setTimeout(()=>{
        showDay(i);
        const chips=document.querySelectorAll('.day-chip');
        if(chips[i]&&!chips[i].querySelector('.today-mini')){
          chips[i].classList.add('today');
          const t=document.createElement('span');
          t.className='today-mini';t.textContent='היום';chips[i].appendChild(t);
        }
      },80);
    }

    document.documentElement.dataset.appReady='v9.7';
  }catch(err){
    console.error('Japan Trip boot failed',err);
    document.documentElement.dataset.appReady='error';
  }

  if('serviceWorker' in navigator){
    try{
      const reg=await navigator.serviceWorker.register('./service-worker.js?v=97');
      reg.update();
    }catch(e){console.warn('SW registration failed',e);}
  }
})();
