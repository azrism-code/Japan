/* Japan Trip 2026 · local encrypted Visit Japan Web QR wallet · v10.3.34
   Images live ONLY in this device's IndexedDB. No Firebase, Drive or public Git data. */
(() => {
  'use strict';
  const DB='JapanTripEntryQR_v1', STORE='wallet', META='meta';
  const PEOPLE=[{id:'first',name:'עזרי'},{id:'second',name:'איילי'}];
  const encoder=new TextEncoder();
  let key=null, open=false, busy=false, zoomUrl=null;
  let urls=[];
  const $=s=>document.querySelector(s);
  const available=()=>!!window.indexedDB&&!!window.crypto?.subtle&&!!window.crypto?.getRandomValues;
  const isEditor=()=>window.JapanCloud?.canWrite?.()===true;
  const arr=x=>new Uint8Array(x);
  const rand=n=>crypto.getRandomValues(new Uint8Array(n));
  function openDB(){
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB,1);
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:'id'})};
      req.onerror=()=>reject(req.error||new Error('לא ניתן לפתוח אחסון מקומי'));
      req.onblocked=()=>reject(new Error('אחסון ה-QR חסום בחלון אחר'));
      req.onsuccess=()=>resolve(req.result);
    });
  }
  async function record(id){
    const db=await openDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly'),r=tx.objectStore(STORE).get(id);
      r.onsuccess=()=>resolve(r.result||null);
      r.onerror=()=>reject(r.error||new Error('קריאת QR נכשלה'));
      tx.oncomplete=()=>db.close();
      tx.onabort=()=>{db.close();reject(tx.error||new Error('קריאת QR נכשלה'))};
    });
  }
  async function put(item){
    const db=await openDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put(item);
      tx.oncomplete=()=>{db.close();resolve()};
      tx.onerror=()=>reject(tx.error||new Error('שמירת QR נכשלה'));
      tx.onabort=()=>{db.close();reject(tx.error||new Error('שמירת QR נכשלה'))};
    });
  }
  async function remove(id){
    const db=await openDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete=()=>{db.close();resolve()};
      tx.onerror=()=>reject(tx.error||new Error('מחיקת QR נכשלה'));
      tx.onabort=()=>{db.close();reject(tx.error||new Error('מחיקת QR נכשלה'))};
    });
  }
  async function derive(pin,salt){
    const material=await crypto.subtle.importKey('raw',encoder.encode(pin),'PBKDF2',false,['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',salt:arr(salt),iterations:310000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  }
  async function seal(k,data){
    const iv=rand(12);
    const bytes=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,data);
    return {iv:Array.from(iv),bytes};
  }
  async function unseal(k,item){
    return crypto.subtle.decrypt({name:'AES-GCM',iv:arr(item.iv)},k,item.bytes);
  }
  const modal=document.createElement('div');
  modal.id='entryQrModal';
  modal.className='entry-qr-backdrop';
  modal.hidden=true;
  modal.innerHTML='<section class="entry-qr-dialog" role="dialog" aria-modal="true" aria-label="קודי כניסה ליפן">'
    +'<div class="entry-qr-header"><b>🛂 הגירה ומכס · Visit Japan Web</b><button type="button" data-entry-qr-close aria-label="סגור">✕</button></div>'
    +'<p class="entry-qr-intro">שני קודי QR אישיים לכניסה ליפן · נאריטה, 4/11. כל קוד נשמר ומוצג רק במכשיר הזה, גם ללא אינטרנט.</p>'
    +'<div id="entryQrContent"></div>'
    +'<div class="entry-qr-foot">אין סנכרון בין מכשירים. שמרו גיבוי מקורי בגלריה. מחיקת נתוני הדפדפן עלולה למחוק את הקודים.</div>'
    +'</section>';
  const zoom=document.createElement('div');
  zoom.id='entryQrFull';
  zoom.className='entry-qr-full';
  zoom.hidden=true;
  zoom.innerHTML='<button data-entry-qr-zoom-close type="button" aria-label="חזרה לקודים">✕ סגור</button><div id="entryQrFullName"></div><img id="entryQrFullImage" alt="קוד QR לסריקה בביקורת הגבולות"><div class="entry-qr-zoom-help">הציגו את הקוד לסריקה · הגדילו בהירות מסך במקרה הצורך</div>';
  document.body.append(modal,zoom);
  function cleanupUrls(){
    for(const u of urls)URL.revokeObjectURL(u);
    urls=[];
    if(zoomUrl){URL.revokeObjectURL(zoomUrl);zoomUrl=null}
  }
  const root=()=>$('#entryQrContent');
  function message(text){const el=$('#entryQrMessage');if(el)el.textContent=text}
  function lock(){
    // Keep the unlocked key in RAM for quick reopening during the same page session.
    // The Lock button and pagehide event clear it.
    cleanupUrls();
    zoom.hidden=true;zoomUrl=null;
    modal.hidden=true;open=false;
    document.body.classList.remove('entry-qr-active');
  }
  async function draw(){
    if(!open)return;
    const target=root();
    cleanupUrls();
    if(!available()){target.innerHTML='<p class="entry-qr-error">הדפדפן הזה אינו תומך באחסון QR מוצפן. פתחו את האתר ב-Chrome ובחיבור HTTPS.</p>';return}
    let meta;
    try{meta=await record(META)}catch(error){target.textContent='לא ניתן לקרוא את הקודים במכשיר: '+error.message;return}
    if(!open)return;
    if(!meta){
      if(!isEditor()){
        target.innerHTML='<p class="entry-qr-error">כדי לשמור כאן קודים חדשים יש להתחבר לחשבון Owner או Editor. אם כבר שמרתם קודים בטלפון אחר, הם אינם מסונכרנים אוטומטית.</p>';
        return;
      }
      target.innerHTML='<div class="entry-qr-setup"><h3>הגדרת שמירה מקומית מוצפנת</h3>'
        +'<p>בחרו קוד אישי בן 6 ספרות. תזדקקו לו לפתיחת הקודים לאחר סגירת האפליקציה, גם ללא אינטרנט.</p>'
        +'<label>קוד גישה<input id="entryQrPin" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="off" placeholder="6 ספרות"></label>'
        +'<label>אימות קוד<input id="entryQrPinAgain" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="off" placeholder="הקלידו שוב"></label>'
        +'<button type="button" data-entry-qr-create>הפעל שמירת QR</button><p class="entry-qr-feedback" id="entryQrMessage" aria-live="polite"></p></div>';
      return;
    }
    if(!key){
      target.innerHTML='<div class="entry-qr-setup"><h3>פתיחת קודי הכניסה</h3>'
        +'<p>הכניסו את קוד 6 הספרות שהגדרתם. עובד גם כשאין אינטרנט.</p>'
        +'<label>קוד גישה<input id="entryQrPin" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="off" placeholder="6 ספרות"></label>'
        +'<button type="button" data-entry-qr-unlock>הצג קודים</button><button type="button" class="entry-qr-reset" data-entry-qr-reset>שכחתי קוד · איפוס מחיקת כל התמונות</button><p class="entry-qr-feedback" id="entryQrMessage" aria-live="polite"></p></div>';
      return;
    }
    const items=await Promise.all(PEOPLE.map(async p=>({person:p,saved:await record(p.id)})));
    if(!open)return;
    const allowChange=!!key;
    const rows=[];
    for(const {person,saved} of items){
      let content='<div class="entry-qr-empty">טרם נשמר QR</div>';
      if(saved){
        try{
          const bytes=await unseal(key,saved);
          const url=URL.createObjectURL(new Blob([bytes],{type:saved.mime}));
          urls.push(url);
          content='<button type="button" class="entry-qr-preview" data-entry-qr-preview="'+person.id+'" aria-label="הגדל QR של '+person.name+'"><img alt="קוד QR של '+person.name+'" src="'+url+'"><span>לחץ להגדלה למסך מלא</span></button>';
        }catch(error){content='<p class="entry-qr-error">לא ניתן לפענח קוד זה. נסו להעלות אותו מחדש.</p>'}
      }
      rows.push('<article class="entry-qr-person"><h3>QR '+person.name+'</h3>'+content
        +(allowChange?'<div class="entry-qr-actions"><label class="entry-qr-file-label">📁 '+(saved?'החלף תמונה':'העלה צילום QR')+'<input type="file" accept="image/png,image/jpeg,image/webp" data-entry-qr-upload="'+person.id+'" hidden></label>'
          +(saved?'<button type="button" data-entry-qr-delete="'+person.id+'">🗑️ מחק</button>':'')+'</div>':'')+'</article>');
    }
    target.innerHTML='<div class="entry-qr-people">'+rows.join('')+'</div>'
      +'<div class="entry-qr-bottom"><button type="button" data-entry-qr-lock>🔒 נעל קודים</button><p id="entryQrMessage" class="entry-qr-feedback" aria-live="polite"></p></div>';
  }
  async function setup(){
    const pin=$('#entryQrPin')?.value||'',again=$('#entryQrPinAgain')?.value||'';
    if(!/^[0-9]{6}$/.test(pin)){message('יש להזין בדיוק 6 ספרות.');return}
    if(pin!==again){message('שני הקודים אינם זהים.');return}
    if(!isEditor()){message('כדי להגדיר ארנק חדש יש להתחבר כ-Owner או Editor.');return}
    const salt=rand(16),created=await derive(pin,salt);
    const verifier=await seal(created,encoder.encode('JAPAN-ENTRY-QR-V1'));
    if(await record(META)){message('כבר קיים ארנק קודים במכשיר.');return}
    await put({id:META,salt:Array.from(salt),verifier});
    key=created;await draw();
  }
  async function unlock(){
    const pin=$('#entryQrPin')?.value||'';
    if(!/^[0-9]{6}$/.test(pin)){message('יש להזין 6 ספרות.');return}
    const meta=await record(META);
    if(!meta){message('לא נמצאו קודים במכשיר.');return}
    const candidate=await derive(pin,meta.salt);
    try{
      const value=await unseal(candidate,meta.verifier);
      if(new TextDecoder().decode(value)!=='JAPAN-ENTRY-QR-V1')throw new Error('incorrect');
    }catch(error){message('קוד שגוי. נסו שוב.');return}
    key=candidate;await draw();
  }
  async function upload(id,file){
    if(!PEOPLE.some(p=>p.id===id)||!key||!file)return;
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)){message('בחרו צילום PNG, JPG או WebP בלבד.');return}
    if(file.size<1||file.size>8*1024*1024){message('התמונה צריכה להיות בגודל עד 8MB.');return}
    const data=await file.arrayBuffer(),recordValue=await seal(key,data);
    await put({id,mime:file.type,iv:recordValue.iv,bytes:recordValue.bytes,updatedAt:new Date().toISOString()});
    await draw();
  }
  async function resetWallet(){
    if(!window.confirm('איפוס ארנק QR ימחק את שתי התמונות מהמכשיר ולא ניתן לשחזר אותן. יש לך גיבוי בגלריה?'))return;
    if(!window.confirm('אישור אחרון: למחוק לצמיתות את שתי תמונות ה-QR ואת קוד הגישה?'))return;
    await remove('first');await remove('second');await remove(META);
    cleanupUrls();key=null;await draw();
  }
  async function erase(id){
    if(!PEOPLE.some(p=>p.id===id)||!key)return;
    const person=PEOPLE.find(p=>p.id===id);
    if(!window.confirm('למחוק את קוד ה-QR של '+person.name+' מהמכשיר?'))return;
    await remove(id);await draw();
  }
  async function fullscreen(id){
    if(!key)return;
    const person=PEOPLE.find(p=>p.id===id);if(!person)return;
    const saved=await record(id);if(!saved)return;
    const bytes=await unseal(key,saved);
    if(zoomUrl)URL.revokeObjectURL(zoomUrl);
    zoomUrl=URL.createObjectURL(new Blob([bytes],{type:saved.mime}));
    $('#entryQrFullImage').src=zoomUrl;
    $('#entryQrFullName').textContent='Visit Japan Web · '+person.name;
    zoom.hidden=false;
  }
  async function act(fn){
    if(busy)return;busy=true;
    try{await fn()}catch(e){console.warn('Local QR wallet:',e);message('לא הצלחנו להשלים את הפעולה. בדקו נפח אחסון ונסו שוב.')}
    finally{busy=false}
  }
  function show(){
    const menu=$('#sideMenu'),backdrop=$('#overlay');
    menu?.classList.remove('open');menu?.setAttribute('aria-hidden','true');
    backdrop?.classList.remove('open');
    modal.hidden=false;open=true;document.body.classList.add('entry-qr-active');
    act(draw);
  }
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-entry-qr-open]');
    if(trigger){e.preventDefault();show();return}
    if(e.target.closest('[data-entry-qr-close]')){lock();return}
    if(e.target.closest('[data-entry-qr-zoom-close]')){
      zoom.hidden=true;$('#entryQrFullImage').removeAttribute('src');
      if(zoomUrl){URL.revokeObjectURL(zoomUrl);zoomUrl=null}
      return;
    }
    if(e.target.closest('[data-entry-qr-lock]')){key=null;act(draw);return}
    if(e.target.closest('[data-entry-qr-reset]')){act(resetWallet);return}
    if(e.target.closest('[data-entry-qr-create]')){act(setup);return}
    if(e.target.closest('[data-entry-qr-unlock]')){act(unlock);return}
    const prev=e.target.closest('[data-entry-qr-preview]');if(prev){act(()=>fullscreen(prev.dataset.entryQrPreview));return}
    const del=e.target.closest('[data-entry-qr-delete]');if(del){act(()=>erase(del.dataset.entryQrDelete));return}
  });
  document.addEventListener('change',e=>{
    const input=e.target.closest('[data-entry-qr-upload]');
    if(!input)return;
    const file=input.files?.[0],id=input.dataset.entryQrUpload;
    act(()=>upload(id,file));
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){if(!zoom.hidden){zoom.hidden=true;$('#entryQrFullImage').removeAttribute('src');if(zoomUrl){URL.revokeObjectURL(zoomUrl);zoomUrl=null}}else if(open)lock()}
    if(e.key==='Enter'&&open&&!key&&e.target.id==='entryQrPin'){
      e.preventDefault();act(async()=>{if(await record(META))await unlock();else if($('#entryQrPinAgain')?.value)await setup()});
    }
  });
  window.addEventListener('pagehide',()=>{cleanupUrls();key=null});
  window.JapanEntryQR={open:show};
})();