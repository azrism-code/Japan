// Japan Trip v9.12d - restore persisted Take/Shopping state without overwriting localStorage
(function(){'use strict';
function safeJson(key){try{const raw=localStorage.getItem(key);if(raw===null)return null;const v=JSON.parse(raw);return Array.isArray(v)?v:null}catch(e){return null}}
function restoreTake(){
  const saved=safeJson('japanTrip_take_v1');
  if(saved===null)return;
  try{
    if(typeof items!=='undefined'&&Array.isArray(items)){
      items.splice(0,items.length,...saved);
      if(typeof renderTake==='function')renderTake();
      return;
    }
  }catch(e){}
  const box=document.getElementById('takeList');
  if(box&&saved.length===0)box.innerHTML='';
}
function restoreShopping(){
  const saved=safeJson('japanTrip_shopping_v2');
  if(saved===null)return;
  try{
    if(typeof shopItems!=='undefined'&&Array.isArray(shopItems)){
      shopItems.splice(0,shopItems.length,...saved);
      if(typeof renderShopping==='function')renderShopping();
    }
  }catch(e){}
}
function run(){restoreTake();restoreShopping()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0));else setTimeout(run,0);
window.addEventListener('pageshow',()=>setTimeout(run,0));
})();
