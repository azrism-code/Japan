/* Japan Trip 2026 · Firestore auth lifecycle and privacy-safe sync · v10.3.31 */
(() => {
  'use strict';
  const F=window.JAPAN_FIREBASE_CONFIG||{}, C=window.JAPAN_CLOUD_CONFIG||{};
  const configured=F.apiKey&&!String(F.apiKey).startsWith('REPLACE_')&&F.projectId&&!String(F.projectId).startsWith('REPLACE_');
  const TRIP=C.tripId||'japan-2026', SHARE=C.shareId||'public-view-v2';
  const KEYS={take:'japanTrip_take_v2',shop:'japanTrip_shop_v2',expenses:'japanTrip_expenses_v1',expenseSettings:'japanTrip_expense_settings_v1',docs:'japanTrip_docs_v1',settings:'japanTrip_settings_v1',completion:'japanTrip_completion_v1'};
  const MIGRATION_KEY='japanTrip_firestoreMigration_v1', PRIVATE_SECRETS_KEY='japanTrip_privateSecrets_v1';
  let db=null, auth=null, role='viewer', applying=false, ready=false, publicUnsubscribe=null;
  let privateUnsubscribers=[], authGeneration=0, syncWarning='', checkingAuth=false;

  // The listener for public viewers must not outlive a signed-in editor/owner.
  function unsubscribeAll(){
    if(publicUnsubscribe){publicUnsubscribe();publicUnsubscribe=null}
    for(const unsubscribe of privateUnsubscribers)unsubscribe();
    privateUnsubscribers=[];
  }
  function isCurrentSession(user,generation){
    return generation===authGeneration&&auth?.currentUser?.uid===user.uid;
  }

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
    // Flight booking/PNR stays private in Firestore/localStorage and is never injected into the UI runtime.
    if(window.TRIP_DATA.flights)window.TRIP_DATA.flights.booking='';
    (s.flightLegSeats||[]).forEach((v,i)=>{
      // Legacy seats beyond the outbound flights belonged to the superseded
      // Emirates return. Preserve them privately but never label them as EY801/EY595 seats.
      const leg=window.TRIP_DATA.flights.legs[i];
      if(i<=2&&leg?.flight)leg.seats=v||'';
    });
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
      el.textContent=!configured?'Firebase טרם הוגדר'
        :checkingAuth?'בודק התחברות והרשאות…'
        :role==='viewer'?'👁️ מצב צפייה בלבד'
        :role==='offline'?'נשמר מקומית · התחבר לסנכרון'
        :(role==='owner'?'מחובר · Owner':'מחובר · Editor')+(syncWarning?' · ⚠️ שגיאת סנכרון':'');
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
    try{
      await batch.commit();
      if(syncWarning){syncWarning='';renderStatus()}
    }catch(error){
      syncWarning='sync-error';renderStatus();
      throw error;
    }
    if(SHARE!==TRIP)db.collection('shares').doc(TRIP).delete().catch(()=>{});
  }

  let timer;
  function schedule(){
    if(applying||!ready||!canWrite())return;
    clearTimeout(timer);
    timer=setTimeout(()=>publish(editorState(),privateState()).catch(console.error),350);
  }

  function watchPublic(generation){
    if(generation!==authGeneration||publicUnsubscribe)return;
    ready=false;
    checkingAuth=false;
    setRole('viewer');
    publicUnsubscribe=db.collection('shares').doc(SHARE).onSnapshot(x=>{
      // An old public snapshot must NEVER demote an authenticated Owner/Editor.
      if(generation!==authGeneration||role!=='viewer')return;
      if(x.exists){
        const raw=x.data().state||{};
        applyState({completion:raw.completion||{},updatedAt:raw.updatedAt||x.data().updatedAt||''},{});
      }
    },error=>{
      if(generation===authGeneration)console.warn('Japan Trip public read failed',error.code||error);
    });
  }

  async function bootstrap(user,generation){
    const tripRef=db.collection('trips').doc(TRIP);
    let snap;
    try{snap=await tripRef.get()}catch(error){
      if(isCurrentSession(user,generation)){
        console.warn('Japan Trip role lookup failed',error.code||error);
        watchPublic(generation);
      }
      return;
    }
    if(!isCurrentSession(user,generation))return;
    if(!snap.exists){watchPublic(generation);return}

    const data=snap.data()||{}, email=String(user.email||'').trim().toLowerCase();
    // The Owner role is controlled by the trusted Firebase UID, never the
    // email address alone. Never grant Owner by modifying client code.
    const owner=data.ownerUid===user.uid;
    const editor=(data.editorUids||[]).includes(user.uid)
      ||(data.editorEmails||[]).some(x=>String(x).trim().toLowerCase()===email);
    if(!owner&&!editor){watchPublic(generation);return}
    if(!owner&&editor)console.info('Japan Trip: signed-in account is authorized as Editor, not as the stored Owner UID');

    const sharedRef=tripRef.collection('shared').doc('state');
    const privateRef=tripRef.collection('private').doc('state');
    const [sh,pr]=await Promise.all([sharedRef.get(),privateRef.get()]);
    if(!isCurrentSession(user,generation))return;
    const existingPrivate=pr.exists?pr.data():{};

    // Finish initial hydration before enabling writes and Firestore listeners.
    checkingAuth=false;
    setRole(owner?'owner':'editor');
    if(existingPrivate?.secrets)applySecrets(existingPrivate.secrets);
    if(sh.exists||pr.exists)applyState(sh.exists?sh.data():{},existingPrivate);
    else localStorage.setItem(MIGRATION_KEY,JSON.stringify({status:'initialized',at:new Date().toISOString()}));

    const privatePayload={...privateState(),...existingPrivate,secrets:existingPrivate?.secrets||privateState().secrets};
    ready=true;
    privateUnsubscribers.push(sharedRef.onSnapshot(x=>{
      if(isCurrentSession(user,generation)&&canWrite()&&x.exists)applyState(x.data(),null);
    },error=>{if(isCurrentSession(user,generation))console.warn('Japan Trip shared sync failed',error.code||error)}));
    privateUnsubscribers.push(privateRef.onSnapshot(x=>{
      if(isCurrentSession(user,generation)&&canWrite()&&x.exists)applyState(null,x.data());
    },error=>{if(isCurrentSession(user,generation))console.warn('Japan Trip private sync failed',error.code||error)}));

    // A share-publication error must not reclassify a valid Owner/Editor as Viewer.
    let initialPublishOk=true;
    try{await publish(sh.exists?sh.data():editorState(),privatePayload)}
    catch(error){
      initialPublishOk=false;
      if(isCurrentSession(user,generation))console.warn('Japan Trip initial publish failed',error.code||error);
    }
    if(!isCurrentSession(user,generation))return;
    if(initialPublishOk)localStorage.setItem(MIGRATION_KEY,JSON.stringify({status:'verified-v12',at:new Date().toISOString()}));
    renderStatus();
  }

  async function init(){
    if(!configured){setRole('offline');return}
    if(!firebase.apps?.length)firebase.initializeApp(F);
    auth=firebase.auth();
    db=firebase.firestore();
    try{await db.enablePersistence({synchronizeTabs:true})}
    catch(error){console.warn('Firestore persistence:',error.code||error)}
    auth.onAuthStateChanged(user=>{
      const generation=++authGeneration;
      clearTimeout(timer);
      unsubscribeAll();
      ready=false;
      syncWarning='';
      if(!user){checkingAuth=false;watchPublic(generation);return}
      checkingAuth=true;
      setRole('viewer');
      bootstrap(user,generation).catch(error=>{
        if(!isCurrentSession(user,generation))return;
        console.error('Japan Trip authenticated bootstrap failed:',error.code||error);
        unsubscribeAll();
        watchPublic(generation);
      });
    });
  }

  async function authAction(){
    if(!configured)return alert('יש להשלים קודם את הגדרת Firebase');
    if(!auth)return alert('ההתחברות עדיין נטענת. נסה שוב בעוד רגע.');
    if(auth.currentUser){
      try{await auth.signOut()}
      catch(error){console.error('Google sign-out failed',error);alert('לא הצלחנו להתנתק. נסה שוב.')}
      return;
    }
    const provider=new firebase.auth.GoogleAuthProvider();
    // Make the user session persistent on reload where browser storage allows.
    try{await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)}
    catch(error){console.warn('Local Firebase auth persistence unavailable',error.code||error)}
    try{await auth.signInWithPopup(provider)}
    catch(error){
      const code=String(error.code||'');
      if(code==='auth/popup-blocked'||code==='auth/operation-not-supported-in-this-environment'){
        try{await auth.signInWithRedirect(provider)}
        catch(redirectError){console.error('Google redirect sign-in failed',redirectError);alert('ההתחברות נכשלה. נסה לפתוח את האפליקציה בכרום ולהתחבר מחדש.')}
      }else if(code!=='auth/popup-closed-by-user'&&code!=='auth/cancelled-popup-request'){
        console.error('Google sign-in failed',error);
        alert('ההתחברות ל-Google נכשלה. נסה שוב.');
      }
    }
  }

  document.addEventListener('japan:stateChanged',schedule);
  const writeSelector='[data-action="add-take"],[data-take-move],[data-take-delete],[data-action="add-shop"],[data-shop-move],[data-shop-delete],[data-action="save-exp-settings"],[data-action="add-expense"],[data-exp-delete],[data-exp-include],[data-take-check],[data-shop-check],#importFile,.reservation-doc-link,.reservation-doc-replace,.reservation-doc-unlink';
  document.addEventListener('click',e=>{if(role==='viewer'&&e.target.closest(writeSelector)){e.preventDefault();e.stopImmediatePropagation();deny()}},true);
  document.addEventListener('change',e=>{if(role==='viewer'&&e.target.closest(writeSelector)){e.preventDefault();e.stopImmediatePropagation();deny()}},true);
  document.addEventListener('click',e=>{if(e.target.closest('[data-auth-action]'))authAction()});

  window.JapanCloud={init,canWrite,deny,get role(){return role}};
  window.addEventListener('load',init);
})();
