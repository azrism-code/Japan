/* Japan Trip 2026 · Firestore state, auth and privacy-safe sync · v10.3.18 */
(() => {
  'use strict';
  const F=window.JAPAN_FIREBASE_CONFIG||{}, C=window.JAPAN_CLOUD_CONFIG||{};
  const configured=F.apiKey&&!String(F.apiKey).startsWith('REPLACE_')&&F.projectId&&!String(F.projectId).startsWith('REPLACE_');
  const TRIP=C.tripId||'japan-2026', SHARE=C.shareId||'public-view-v2';
  const KEYS={take:'japanTrip_take_v2',shop:'japanTrip_shop_v2',expenses:'japanTrip_expenses_v1',expenseSettings:'japanTrip_expense_settings_v1',docs:'japanTrip_docs_v1',settings:'japanTrip_settings_v1',completion:'japanTrip_completion_v1'};
  const MIGRATION_KEY='japanTrip_firestoreMigration_v1', PRIVATE_SECRETS_KEY='japanTrip_privateSecrets_v1';
  let db=null, auth=null, role='viewer', applying=false, ready=false, publicUnsubscribe=null;

  const parse=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'')??fallback}catch(e){return fallback}};
  const editorState=()=>({schema:12,take:parse(KEYS.take,[]),shop:parse(KEYS.shop,[]),expenses:parse(KEYS.expenses,[]),expenseSettings:parse(KEYS.expenseSettings,{}),settings:parse(KEYS.settings,{}),completion:parse(KEYS.completion,{}),updatedAt:new Date().toISOString()});
  const viewerState=()=>({schema:12,completion:parse(KEYS.completion,{}),updatedAt:new Date().toISOString()});
  const runtimeSecrets=()=>({
    flightBooking:window.TRIP_DATA?.flights?.booking||'',
    flightLegSeats:(window.TRIP_DATA?.flights?.legs||[]).map(x=>x.seats||''),
    hotels:Object.fromEntries((window.TRIP_DATA?.hotels||[]).map(h=>[h.key,{booking:h.booking||'',reference:h.reference||''}])),
    rentalBooking:window.TRIP_DATA?.carRental?.booking||''
  });
  const preservedSecrets=()=>{
    const stored=parse(PRIVATE_SECRETS_KEY,{}), runtime=runtimeSecrets();
    return {
      flightBooking:stored.flightBooking||runtime.flightBooking||'',
      flightLegSeats:Array.isArray(stored.flightLegSeats)&&stored.flightLegSeats.some(Boolean)?stored.flightLegSeats:runtime.flightLegSeats,
      hotels:Object.keys(stored.hotels||{}).length?stored.hotels:runtime.hotels,
      rentalBooking:stored.rentalBooking||runtime.rentalBooking||''
    };
  };
  const privateState=()=>({schema:12,docs:parse(KEYS.docs,{}),secrets:preservedSecrets(),updatedAt:new Date().toISOString()});

  function applySecrets(s){
    if(!s||typeof s!=='object')return;
    localStorage.setItem(PRIVATE_SECRETS_KEY,JSON.stringify(s));
    if(!window.TRIP_DATA)return;
    if(s.flightBooking!==undefined)window.TRIP_DATA.flights.booking=s.flightBooking||'';
    (s.flightLegSeats||[]).forEach((v,i)=>{if(window.TRIP_DATA.flights.legs[i])window.TRIP_DATA.flights.legs[i].seats=v||''});
    for(const h of window.TRIP_DATA.hotels||[]){
      const x=s.hotels?.[h.key];
      if(x){h.booking=x.booking||'';h.reference=x.reference||''}
    }
    if(window.TRIP_DATA.carRental&&s.rentalBooking!==undefined)window.TRIP_DATA.carRental.booking=s.rentalBooking||'';
  }

  function applyState(shared,priv){
    applying=true;
    for(const [name,key] of Object.entries(KEYS)){
      const src=name==='docs'?priv:shared;
      if(src&&src[name]!==undefined)localStorage.setItem(key,JSON.stringify(src[name]));
    }
    if(priv?.secrets)applySecrets(priv.secrets);
    applying=false;
    document.dispatchEvent(new CustomEvent('japan:cloudApplied'));
  }

  function setRole(next){
    role=next;
    document.documentElement.dataset.role=role;
    document.querySelectorAll('[data-page="expenses"]').forEach(el=>{el.hidden=role==='viewer'});
    document.dispatchEvent(new CustomEvent('japan:roleChanged',{detail:{role}}));
    renderStatus();
  }

  function deny(){alert('מצב צפייה בלבד');return false}
  function canWrite(){return role==='owner'||role==='editor'}
  function renderStatus(){
    document.querySelectorAll('[data-cloud-status]').forEach(el=>{
      el.textContent=!configured?'Firebase טרם הוגדר':role==='viewer'?'👁️ מצב צפייה בלבד':role==='offline'?'נשמר מקומית · התחבר לסנכרון':role==='owner'?'מחובר · Owner':'מחובר · Editor';
    });
    document.querySelectorAll('[data-auth-action]').forEach(b=>{b.textContent=auth?.currentUser?'התנתק':'התחבר עם Google'});
  }

  async function publish(shared,priv){
    if(!ready||applying||!canWrite())return;
    const batch=db.batch(), tripRef=db.collection('trips').doc(TRIP), now=new Date().toISOString();
    batch.set(tripRef.collection('shared').doc('state'),shared,{merge:true});
    batch.set(tripRef.collection('private').doc('state'),priv,{merge:true});
    const safeShare={tripId:TRIP,state:viewerState(),updatedAt:now};
    batch.set(db.collection('shares').doc(SHARE),safeShare);
    if(SHARE!==TRIP)batch.set(db.collection('shares').doc(TRIP),safeShare);
    await batch.commit();
    if(SHARE!==TRIP)db.collection('shares').doc(TRIP).delete().catch(()=>{});
  }

  let timer;
  function schedule(){
    if(applying||role==='viewer')return deny();
    clearTimeout(timer);
    timer=setTimeout(()=>publish(editorState(),privateState()).catch(console.error),350);
  }

  function watchPublic(){
    if(publicUnsubscribe)return;
    publicUnsubscribe=db.collection('shares').doc(SHARE).onSnapshot(x=>{
      if(x.exists){
        const raw=x.data().state||{};
        applyState({completion:raw.completion||{},updatedAt:raw.updatedAt||x.data().updatedAt||''},{});
      }
      setRole('viewer');
    },()=>setRole('viewer'));
  }

  async function bootstrap(user){
    const tripRef=db.collection('trips').doc(TRIP);
    let snap;
    try{snap=await tripRef.get()}catch(e){watchPublic();return}
    if(!snap.exists){watchPublic();return}

    const data=snap.data()||{}, email=String(user.email||'').toLowerCase();
    const owner=data.ownerUid===user.uid;
    const editor=(data.editorUids||[]).includes(user.uid)||(data.editorEmails||[]).map(x=>String(x).toLowerCase()).includes(email);
    if(!owner&&!editor){watchPublic();return}

    setRole(owner?'owner':'editor');
    ready=true;

    const sharedRef=tripRef.collection('shared').doc('state');
    const privateRef=tripRef.collection('private').doc('state');
    const [sh,pr]=await Promise.all([sharedRef.get(),privateRef.get()]);
    const existingPrivate=pr.exists?pr.data():{};

    if(existingPrivate?.secrets)applySecrets(existingPrivate.secrets);
    if(sh.exists||pr.exists)applyState(sh.exists?sh.data():{},existingPrivate);
    else localStorage.setItem(MIGRATION_KEY,JSON.stringify({status:'initialized',at:new Date().toISOString()}));

    const privatePayload={...privateState(),...existingPrivate,secrets:existingPrivate?.secrets||privateState().secrets};

    sharedRef.onSnapshot(x=>{if(x.exists)applyState(x.data(),null)});
    privateRef.onSnapshot(x=>{if(x.exists)applyState(null,x.data())});

    await publish(sh.exists?sh.data():editorState(),privatePayload);
    localStorage.setItem(MIGRATION_KEY,JSON.stringify({status:'verified-v12',at:new Date().toISOString()}));
    renderStatus();
  }

  async function init(){
    if(!configured){setRole('offline');return}
    firebase.initializeApp(F);
    auth=firebase.auth();
    db=firebase.firestore();
    try{await db.enablePersistence({synchronizeTabs:true})}catch(e){console.warn('Firestore persistence:',e.code||e)}
    ready=true;
    auth.onAuthStateChanged(user=>{if(user)bootstrap(user).catch(e=>{console.error(e);watchPublic()});else watchPublic()});
  }

  async function authAction(){
    if(!configured)return alert('יש להשלים קודם את הגדרת Firebase');
    if(auth.currentUser)return auth.signOut();
    const provider=new firebase.auth.GoogleAuthProvider();
    try{await auth.signInWithPopup(provider)}catch(e){if(/popup|cancelled/.test(e.code||''))return;await auth.signInWithRedirect(provider)}
  }

  document.addEventListener('japan:stateChanged',schedule);
  const writeSelector='[data-action="add-take"],[data-take-move],[data-take-delete],[data-action="add-shop"],[data-shop-move],[data-shop-delete],[data-action="save-exp-settings"],[data-action="add-expense"],[data-exp-delete],[data-exp-include],[data-take-check],[data-shop-check],#importFile,.reservation-doc-link,.reservation-doc-replace,.reservation-doc-unlink';
  document.addEventListener('click',e=>{if(role==='viewer'&&e.target.closest(writeSelector)){e.preventDefault();e.stopImmediatePropagation();deny()}},true);
  document.addEventListener('change',e=>{if(role==='viewer'&&e.target.closest(writeSelector)){e.preventDefault();e.stopImmediatePropagation();deny()}},true);
  document.addEventListener('click',e=>{if(e.target.closest('[data-auth-action]'))authAction()});

  window.JapanCloud={init,canWrite,deny,get role(){return role}};
  window.addEventListener('load',init);
})();
