/* Japan Trip 2026 · service worker · v10.3.13
   Simple offline cache. No source rewriting, module merging or forced navigation. */
const CACHE='japan-trip-v10-3-13-cache-route-fix';
const CORE=[
  './','./index.html','./styles.css?v=10.3.13','./place-content.css?v=10.3.13','./station-guides.css?v=10.3.13','./expenses-ui.css?v=10.3.13','./trip-data.js?v=10.3.13','./place-content.js?v=10.3.13','./firebase-config.js?v=10.3.13','./firestore-sync.js?v=10.3.13','./shinjuku-prince-update.js?v=10.3.13','./romancecar-update.js?v=10.3.13','./kyoto-hotel-update.js?v=10.3.13','./app.js?v=10.3.13','./day-strip-city.js?v=10.3.13','./hotel-compact.js?v=10.3.13','./car-rental.js?v=10.3.13','./drive.js?v=10.3.13','./booking-planner.js?v=10.3.13','./romancecar-booking-update.js?v=10.3.13','./station-guides.js?v=10.3.13','./expense-safety.js?v=10.3.13','./expenses-ui.js?v=10.3.13','./manifest.json?v=10.3.13','./assets/icons/app-icon-192.png?v=10.3.13','./assets/icons/app-icon-512.png?v=10.3.13','./assets/icons/apple-touch-icon.png?v=10.3.13','./assets/icons/header-icon.png?v=10.3.13',
  './assets/train-infographic.svg',
  './images/evening-walks/asakusa.jpg','./images/evening-walks/ueno-akihabara.jpg','./images/evening-walks/shibuya.jpg','./images/evening-walks/marunouchi-ginza.jpg'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return response}).catch(()=>caches.match('./index.html')));return;
  }
  event.respondWith(fetch(event.request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}return response}).catch(()=>caches.match(event.request)));
});
