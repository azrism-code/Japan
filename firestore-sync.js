/* Japan Trip 2026 · Firestore state, auth, migration and real-time sync · v10.1.0 */
(() => {
  'use strict';
  const F=window.JAPAN_FIREBASE_CONFIG||{}, C=window.JAPAN_CLOUD_CONFIG||{};
  const configured=F.apiKey&&!String(F.apiKey).startsWith('REPLACE_')&&F.projectId&&!String(F.projectId).startsWith('REPLACE_');
  const TRIP=C.tripId||'japan-2026', SHARE=new URLSearchParams(location.search).get('share')||'';
  const KEYS={take:'japanTrip_take_v2',shop:'japanTrip_shop_v2',expenses:'japanTrip_expenses_v1',expenseSettings:'japanTrip_expense_settings_v1',docs:'japanTrip_docs_v1',settings:'japanTrip_settings_v1',completion:'japanTrip_completion_v1'};
  const MIGRATION_KEY='japanTrip_firestoreMigration_v1';
  let db=null, auth=null, role=SHARE?'viewer':'offline', applying=false, ready=false, shareToken='';
  const parse=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'')??fallback}catch(e){return fallback}};
  const publicState=()=>({schema:11,take:parse(KEYS.take,[]),shop:parse(KEYS.shop,[]),expenses:parse(KEYS.expenses,[]),expenseSettings:parse(KEYS.expenseSettings,{}),settings:parse(KEYS.settings,{}),completion:parse(KEYS.completion,{}),updatedAt:new Date().toISOString()});
  const privateState=()=>({schema:11,docs:parse(KEYS.docs,{}),updatedAt:new Date().toISOString()});
  function applyState(shared,priv){applying=true;for(const [name,key] of Object.entries(KEYS)){const src=name==='docs'?priv:shared;if(src&&src[name]!==undefined)localStorage.setItem(key,JSON.stringify(src[name]))}applying=false;document.dispatchEvent(new CustomEvent('japan:cloudApplied'));}
  function setRole(next){role=next;document.documentElement.dataset.role=role;document.dispatchEvent(new CustomEvent('japan:roleChanged',{detail:{role}}));renderStatus();}
  function deny(){alert('מצב צפייה בלבד');return false}
  function canWrite(){return role==='owner'||role==='editor'||role==='offline'}
  function renderStatus(){document.querySelectorAll('[data-cloud-status]').forEach(el=>{el.textContent=!configured?'Firebase טרם הוגדר':role==='viewer'?'👁️ מצב צפייה בלבד':role==='offline'?'נשמר מקומית · התחבר לסנכרון':role==='owner'?'מחובר · Owner':'מחובר · Editor'});document.querySelectorAll('[data-auth-action]').forEach(b=>{b.textContent=auth?.currentUser?'התנתק':'התחבר עם Google'})}
  function ensureShareToken(){let t=localStorage.getItem('japanTrip_shareToken_v1');if(!t){const a=new Uint8Array(24);crypto.getRandomValues(a);t=[...a].map(x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem('japanTrip_shareToken_v1',t)}return t}
  async function publish(shared,priv){if(!ready||applying||!canWrite()||role==='offline')return;const batch=db.batch(),tripRef=db.collection('trips').doc(TRIP);batch.set(tripRef.collection('shared').doc('state'),shared,{merge:true});batch.set(tripRef.collection('private').doc('state'),priv,{merge:true});if(shareToken)batch.set(db.collection('shares').doc(shareToken),{tripId:TRIP,state:shared,updatedAt:shared.updatedAt},{merge:true});await batch.commit()}
  let timer;function schedule(){if(applying||role==='viewer')return deny();clearTimeout(timer);timer=setTimeout(()=>publish(publicState(),privateState()).catch(console.error),350)}
  async function bootstrap(user){const tripRef=db.collection('trips').doc(TRIP),email=String(user.email||'').toLowerCase(),ownerEmail=String(C.ownerEmail||'').toLowerCase();let snap;if(email===ownerEmail){shareToken=ensureShareToken();await tripRef.set({ownerUid:user.uid,ownerEmail:user.email,editorUids:[],editorEmails:(C.editorEmails||[]).map(x=>x.toLowerCase()),shareToken,createdAt:new Date().toISOString()},{merge:true});snap=await tripRef.get();setRole('owner')}else{snap=await tripRef.get();if(!snap.exists)throw new Error('Trip is not initialized');const d=snap.data();shareToken=d.shareToken||'';setRole((d.editorUids||[]).includes(user.uid)||(d.editorEmails||[]).includes(email)?'editor':'viewer')}
    if(role==='viewer')return;
    ready=true;
    const sharedRef=tripRef.collection('shared').doc('state'), privateRef=tripRef.collection('private').doc('state'), [s,p]=await Promise.all([sharedRef.get(),privateRef.get()]);
    if(!s.exists){await publish(publicState(),privateState());localStorage.setItem(MIGRATION_KEY,JSON.stringify({status:'uploaded',at:new Date().toISOString()}))}else{applyState(s.data(),p.exists?p.data():{});localStorage.setItem(MIGRATION_KEY,JSON.stringify({status:'verified',at:new Date().toISOString()}))}
    sharedRef.onSnapshot(x=>{if(x.exists)applyState(x.data(),null)});privateRef.onSnapshot(x=>{if(x.exists)applyState(null,x.data())});renderStatus();
  }
  async function init(){if(!configured){setRole('offline');return}firebase.initializeApp(F);auth=firebase.auth();db=firebase.firestore();try{await db.enablePersistence({synchronizeTabs:true})}catch(e){console.warn('Firestore persistence:',e.code||e)}
    if(SHARE){setRole('viewer');db.collection('shares').doc(SHARE).onSnapshot(x=>{if(x.exists)applyState(x.data().state||{},{});else alert('קישור השיתוף אינו תקין')});ready=true;return}
    auth.onAuthStateChanged(user=>{if(user)bootstrap(user).catch(e=>{console.error(e);alert('לא ניתן לפתוח את נתוני הטיול')});else setRole('offline')});
  }
  async function authAction(){if(!configured)return alert('יש להשלים קודם את הגדרת Firebase');if(auth.currentUser)return auth.signOut();const provider=new firebase.auth.GoogleAuthProvider();try{await auth.signInWithPopup(provider)}catch(e){if(/popup|cancelled/.test(e.code||''))return;await auth.signInWithRedirect(provider)}}
  document.addEventListener('japan:stateChanged',schedule);
  const writeSelector='[data-action="add-take"],[data-take-move],[data-take-delete],[data-action="add-shop"],[data-shop-move],[data-shop-delete],[data-action="save-exp-settings"],[data-action="add-expense"],[data-exp-delete],[data-exp-include],[data-take-check],[data-shop-check],#importFile,.reservation-doc-link,.reservation-doc-replace,.reservation-doc-unlink';
  document.addEventListener('click',e=>{if(role==='viewer'&&e.target.closest(writeSelector)){e.preventDefault();e.stopImmediatePropagation();deny()}},true);
  document.addEventListener('change',e=>{if(role==='viewer'&&e.target.closest(writeSelector)){e.preventDefault();e.stopImmediatePropagation();deny()}},true);
  document.addEventListener('click',e=>{if(e.target.closest('[data-auth-action]'))authAction();if(e.target.closest('[data-copy-share]')){const url=location.origin+location.pathname+'?share='+shareToken;navigator.clipboard?.writeText(url);alert('קישור הצפייה הועתק')}});
  window.JapanCloud={init,canWrite,deny,get role(){return role},get shareUrl(){return shareToken?location.origin+location.pathname+'?share='+shareToken:''}};
  window.addEventListener('load',init);
})();
