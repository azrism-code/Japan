/* Japan Trip 2026 · Google Drive sync + reservation documents · v10.0.0
   Explicit rendering only. No MutationObserver and no UI patching. */
(() => {
  'use strict';
  const APP = () => window.JapanTripApp;
  const TAKE_KEY='japanTrip_take_v2', SHOP_KEY='japanTrip_shop_v2', DOCS_KEY='japanTrip_docs_v1';
  const EXP_KEY='japanTrip_expenses_v1', EXP_SETTINGS_KEY='japanTrip_expense_settings_v1';
  const CLIENT_KEY='japanTrip_googleClientId_v1', DEFAULT_CLIENT_ID='390490824-v3k40tus28ujfcc9n2e5o138flbgfddc.apps.googleusercontent.com';
  const META_KEY='japanTrip_driveSyncMeta_v1', TOKEN_KEY='japanTrip_driveAccessToken_v1', TOKEN_EXP_KEY='japanTrip_driveAccessTokenExp_v1';
  const FILE_NAME='JapanTripSync.json', SCOPE='https://www.googleapis.com/auth/drive.file';
  const FOLDER_KEY='japanTrip_docsFolder_v1';
  const API_KEY='AIzaSyAwA1aYbnhZENDGbx77MoW-JhR5bW9kvVM';
  const MIME_TYPES='application/pdf,image/png,image/jpeg,image/webp';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  let tokenClient=null, accessToken='', driveFileId='', applyingRemote=false, pushTimer=null;
  const nowIso=()=>new Date().toISOString();

  function parse(key,fallback){try{const v=JSON.parse(localStorage.getItem(key)||'');return v ?? fallback}catch(e){return fallback}}
  function getMeta(){return parse(META_KEY,{})}
  function setMeta(patch){const m={...getMeta(),...patch};localStorage.setItem(META_KEY,JSON.stringify(m));return m}
  function getClientId(){return localStorage.getItem(CLIENT_KEY)||DEFAULT_CLIENT_ID}
  function loadSessionToken(){try{const exp=Number(sessionStorage.getItem(TOKEN_EXP_KEY)||0),t=sessionStorage.getItem(TOKEN_KEY)||'';if(t&&exp>Date.now()+30000){accessToken=t;return true}}catch(e){}return false}
  function saveSessionToken(resp){accessToken=resp.access_token||'';const expires=Math.max(60,Number(resp.expires_in||3600));try{sessionStorage.setItem(TOKEN_KEY,accessToken);sessionStorage.setItem(TOKEN_EXP_KEY,String(Date.now()+expires*1000))}catch(e){}}
  function clearSessionToken(){accessToken='';try{sessionStorage.removeItem(TOKEN_KEY);sessionStorage.removeItem(TOKEN_EXP_KEY)}catch(e){}}

  function migratedDocs(input){
    const d=input&&typeof input==='object'&&!Array.isArray(input)?{...input}:{};
    if(d['hotel-richmond-kyoto-shijo']&&!d['hotel-daiwa-kyoto-shijo'])d['hotel-daiwa-kyoto-shijo']=d['hotel-richmond-kyoto-shijo'];
    delete d['hotel-richmond-kyoto-shijo'];
    return d;
  }
  function docs(){const d=migratedDocs(parse(DOCS_KEY,{}));localStorage.setItem(DOCS_KEY,JSON.stringify(d));return d}
  function state(){
    return {schema:10,updatedAt:nowIso(),take:parse(TAKE_KEY,[]),shop:parse(SHOP_KEY,[]),docs:docs(),expenses:parse(EXP_KEY,[]),expenseSettings:parse(EXP_SETTINGS_KEY,{})};
  }
  function status(text,ok=false){$$('.drive-status').forEach(el=>{el.textContent=text;el.style.color=ok?'#176b3a':'#6b7280'})}

  function injectGIS(){return new Promise((resolve,reject)=>{if(window.google?.accounts?.oauth2)return resolve();let s=document.querySelector('script[data-japan-gis]');if(!s){s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.defer=true;s.dataset.japanGis='1';document.head.appendChild(s)}const started=Date.now(),t=setInterval(()=>{if(window.google?.accounts?.oauth2){clearInterval(t);resolve()}else if(Date.now()-started>12000){clearInterval(t);reject(new Error('Google Identity Services לא נטען'))}},150)})}
  async function requestTokenInteractive(){const clientId=getClientId();if(!clientId)throw new Error('חסר Google OAuth Client ID');await injectGIS();if(!tokenClient)tokenClient=google.accounts.oauth2.initTokenClient({client_id:clientId,scope:SCOPE,callback:()=>{}});return new Promise((resolve,reject)=>{tokenClient.callback=resp=>{if(resp.error)return reject(new Error(resp.error));saveSessionToken(resp);resolve(accessToken)};tokenClient.requestAccessToken({prompt:'consent'})})}
  async function api(url,opt={}){if(!accessToken&&!loadSessionToken())throw new Error('AUTH_REQUIRED');const r=await fetch(url,{...opt,headers:{Authorization:'Bearer '+accessToken,...(opt.headers||{})}});if(r.status===401){clearSessionToken();throw new Error('AUTH_REQUIRED')}if(!r.ok)throw new Error('Drive API '+r.status);return r}
  async function findFile(){const q=encodeURIComponent("name='"+FILE_NAME+"' and trashed=false");const r=await api('https://www.googleapis.com/drive/v3/files?q='+q+'&fields=files(id,name,modifiedTime)&spaces=drive&pageSize=10'),j=await r.json();if(j.files?.length){driveFileId=j.files[0].id;setMeta({fileId:driveFileId});return j.files[0]}return null}
  async function createFile(payload){const boundary='japantrip_'+Date.now(),meta={name:FILE_NAME,mimeType:'application/json'},body='--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify(meta)+'\r\n--'+boundary+'\r\nContent-Type: application/json\r\n\r\n'+JSON.stringify(payload)+'\r\n--'+boundary+'--';const r=await api('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+boundary},body}),j=await r.json();driveFileId=j.id;setMeta({fileId:driveFileId,lastCloudSyncAt:payload.updatedAt,lastLocalChangeAt:payload.updatedAt});return j}
  async function readCloud(){if(!driveFileId)driveFileId=getMeta().fileId||'';if(!driveFileId){const f=await findFile();if(!f)return null}const r=await api('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(driveFileId)+'?alt=media');return await r.json()}
  async function writeCloud(payload){if(!driveFileId){const f=await findFile();if(!f)return createFile(payload)}await api('https://www.googleapis.com/upload/drive/v3/files/'+encodeURIComponent(driveFileId)+'?uploadType=media',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});setMeta({fileId:driveFileId,lastCloudSyncAt:payload.updatedAt,lastLocalChangeAt:payload.updatedAt});status('✓ מסונכרן ל-Google Drive',true)}

  function applyCloud(c){
    if(!c||typeof c!=='object')return;
    applyingRemote=true;
    if(Array.isArray(c.take))localStorage.setItem(TAKE_KEY,JSON.stringify(c.take));
    if(Array.isArray(c.shop))localStorage.setItem(SHOP_KEY,JSON.stringify(c.shop));
    if(c.docs&&typeof c.docs==='object')localStorage.setItem(DOCS_KEY,JSON.stringify(migratedDocs(c.docs)));
    if(Array.isArray(c.expenses))localStorage.setItem(EXP_KEY,JSON.stringify(c.expenses));
    if(c.expenseSettings&&typeof c.expenseSettings==='object')localStorage.setItem(EXP_SETTINGS_KEY,JSON.stringify(c.expenseSettings));
    applyingRemote=false;
    const at=c.updatedAt||nowIso();setMeta({lastCloudSyncAt:at,lastLocalChangeAt:at});
    status('✓ נטען מ-Google Drive',true);
    // A single reload is intentional here: app state is rebuilt from canonical localStorage after a cloud pull.
    setTimeout(()=>location.reload(),250);
  }
  async function doSync(interactive){try{status('מסנכרן…');if(!accessToken&&!loadSessionToken()){if(!interactive){status('☁️ לא מחובר כרגע · לחץ חבר / סנכרן');return}await requestTokenInteractive()}const cloud=await readCloud();if(!cloud){const s=state();await createFile(s);status('✓ נוצר קובץ Sync ב-Google Drive',true);return}const meta=getMeta(),cloudAt=Date.parse(cloud.updatedAt||0)||0,localAt=Date.parse(meta.lastLocalChangeAt||0)||0,syncedAt=Date.parse(meta.lastCloudSyncAt||0)||0;if(cloudAt>Math.max(localAt,syncedAt)){applyCloud(cloud);return}if(localAt>syncedAt){await writeCloud(state());return}setMeta({lastCloudSyncAt:cloud.updatedAt||nowIso(),fileId:driveFileId});status('✓ מסונכרן ל-Google Drive',true)}catch(e){console.warn('Drive sync:',e);if(String(e.message)==='AUTH_REQUIRED'){clearSessionToken();status('☁️ החיבור פג · לחץ חבר / סנכרן')}else status('Drive לא מחובר / נדרש אישור Google')}}
  const syncNow=()=>doSync(true),syncQuiet=()=>doSync(false);
  function schedulePush(){if(applyingRemote)return;setMeta({lastLocalChangeAt:nowIso()});clearTimeout(pushTimer);pushTimer=setTimeout(()=>{if(accessToken||loadSessionToken())syncQuiet();else status('נשמר בטלפון · יסונכרן בפעם הבאה שתתחבר')},1000)}

  function folder(){const f=parse(FOLDER_KEY,null);return f&&f.id?f:null}
  function saveFolder(f){localStorage.setItem(FOLDER_KEY,JSON.stringify(f))}
  function saveDocs(d){localStorage.setItem(DOCS_KEY,JSON.stringify(migratedDocs(d)));schedulePush();renderDocs()}
  function loadPickerApi(){return new Promise((resolve,reject)=>{if(window.google?.picker)return resolve();let s=document.querySelector('script[data-japan-picker-api]');if(!s){s=document.createElement('script');s.src='https://apis.google.com/js/api.js';s.async=true;s.defer=true;s.dataset.japanPickerApi='1';document.head.appendChild(s)}const started=Date.now(),t=setInterval(()=>{if(window.gapi?.load){clearInterval(t);gapi.load('picker',{callback:resolve,onerror:()=>reject(new Error('Google Picker לא נטען'))})}else if(Date.now()-started>12000){clearInterval(t);reject(new Error('Google API לא נטען'))}},150)})}
  async function pickerToken(){let t=accessToken||(loadSessionToken()?accessToken:'');if(!t)t=await requestTokenInteractive();return t}
  async function chooseJapanFolder(){await loadPickerApi();const t=await pickerToken();return new Promise((resolve,reject)=>{const view=new google.picker.DocsView(google.picker.ViewId.FOLDERS);view.setIncludeFolders(true);view.setSelectFolderEnabled(true);view.setMode(google.picker.DocsViewMode.LIST);new google.picker.PickerBuilder().addView(view).setOAuthToken(t).setDeveloperKey(API_KEY).setOrigin(location.protocol+'//'+location.host).setTitle('בחר פעם אחת את תיקיית Japan').setCallback(data=>{if(data.action===google.picker.Action.CANCEL)return reject(new Error('CANCELLED'));if(data.action!==google.picker.Action.PICKED)return;const f=data.docs?.[0];if(!f?.id)return reject(new Error('לא נבחרה תיקייה'));const chosen={id:f.id,name:f.name||'Japan',linkedAt:nowIso()};saveFolder(chosen);resolve(chosen)}).build().setVisible(true)})}
  async function ensureFolder(){return folder()||await chooseJapanFolder()}
  function labelFor(key){const h=window.TRIP_DATA?.hotels?.find(x=>x.key===key);if(h)return h.name;const b=window.TRIP_DATA?.bookings?.find(x=>x.docKey===key);return b?.title||key}
  async function chooseDoc(key){try{const label=labelFor(key),fldr=await ensureFolder();await loadPickerApi();const t=await pickerToken(),view=new google.picker.DocsView(google.picker.ViewId.DOCS);view.setParent(fldr.id);view.setIncludeFolders(false);view.setSelectFolderEnabled(false);view.setMimeTypes(MIME_TYPES);view.setMode(google.picker.DocsViewMode.LIST);new google.picker.PickerBuilder().addView(view).enableFeature(google.picker.Feature.NAV_HIDDEN).setOAuthToken(t).setDeveloperKey(API_KEY).setOrigin(location.protocol+'//'+location.host).setTitle('בחר אסמכתא מתוך '+(fldr.name||'Japan')+' עבור '+label).setCallback(data=>{if(data.action!==google.picker.Action.PICKED)return;const f=data.docs?.[0];if(!f)return;const d=docs();d[key]={id:f.id,name:f.name||label,mimeType:f.mimeType||'',url:f.url||('https://drive.google.com/file/d/'+encodeURIComponent(f.id)+'/view'),linkedAt:nowIso()};saveDocs(d)}).build().setVisible(true)}catch(e){if(String(e.message)==='CANCELLED')return;console.warn('Document picker:',e);alert('לא ניתן לפתוח את Google Drive כרגע. לחץ קודם על "חבר / סנכרן" ונסה שוב.')}}
  function openDoc(key){const f=docs()[key];if(f)window.open(f.url||('https://drive.google.com/file/d/'+encodeURIComponent(f.id)+'/view'),'_blank','noopener')}
  function unlink(key){const label=labelFor(key);if(!confirm('לנתק את האסמכתא מ-'+label+'? הקובץ עצמו לא יימחק מ-Google Drive.'))return;const d=docs();delete d[key];saveDocs(d)}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function actionHtml(key){const f=docs()[key];if(f)return '<div class="reservation-doc-actions" data-doc-key="'+esc(key)+'"><button type="button" class="reservation-doc-open">👁️ צפייה באסמכתה</button><button type="button" class="reservation-doc-replace" title="החלפת אסמכתה" aria-label="החלפת אסמכתה">🔄</button><button type="button" class="reservation-doc-unlink" title="מחיקת אסמכתה" aria-label="מחיקת אסמכתה">🗑️</button><span class="reservation-doc-name" title="'+esc(f.name||'')+'">'+esc(f.name||'')+'</span></div>';return '<div class="reservation-doc-actions" data-doc-key="'+esc(key)+'"><button type="button" class="reservation-doc-link">➕ הוסף אסמכתה</button></div>'}
  function renderDocs(){$$('[data-doc-key]').forEach(host=>{const key=host.dataset.docKey;if(!key)return;const slot=$('.doc-slot',host);if(slot)slot.innerHTML=actionHtml(key)})}

  function mountSyncUI(){$$('[data-drive-sync-slot]').forEach(slot=>{slot.innerHTML=''})}

  document.addEventListener('click',e=>{const b=e.target.closest('.reservation-doc-open,.reservation-doc-link,.reservation-doc-replace,.reservation-doc-unlink');if(!b)return;const key=b.closest('[data-doc-key]')?.dataset.docKey;if(!key)return;if(b.classList.contains('reservation-doc-open'))openDoc(key);else if(b.classList.contains('reservation-doc-unlink'))unlink(key);else chooseDoc(key)});
  window.addEventListener('load',()=>{renderDocs();mountSyncUI()});
  window.JapanDrive={renderDocs,mountSyncUI};
})();
