// Japan Trip v9.12i - single-source itinerary stabilizer
(function(){'use strict';
const VERSION='v9.12i';
const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
const norm=s=>(s||'').replace(/\s+/g,' ').trim().toLowerCase();
function mkStop(time,icon,title,text,place){const d=document.createElement('div');d.className='stop v912i-stop';d.innerHTML='<div class="time">'+time+'</div><div class="rail"><i>'+icon+'</i></div><div class="stop-card"><h3>'+title+'</h3><p>'+text+'</p>'+(place?'<div class="stop-actions"><button class="info-modal-btn guide-tips-btn" data-place="'+place+'" type="button">ℹ️ מדריך וטיפים</button></div>':'')+'</div>';return d}
function rebuildDay12(){
 const day=q('#day-9');if(!day)return;const list=day.querySelector('.list-view');if(!list)return;
 const hotel=[...list.querySelectorAll('.stop')].find(s=>/Richmond Hotel Premier Kyoto Shijo/i.test(s.textContent||''));
 [...list.querySelectorAll('.stop')].forEach(s=>{if(s!==hotel)s.remove()});
 const h=day.querySelector('.day-heading h2');if(h)h.textContent='Fushimi Inari · Tofuku-ji · Sanjūsangen-dō';
 const sum=day.querySelector('.summary');if(sum)sum.textContent='Fushimi Inari → Tofuku-ji → Sanjūsangen-dō → Kyoto Station / Higashi Hongan-ji';
 const items=[
 ['09:00','⛩️','Fushimi Inari Taisha','בוקר בין אלפי שערי ה־torii. אין צורך לעלות לפסגה; נמשיך עד שנקבל את חוויית השערים והיער ואז נחזור.','Fushimi Inari'],
 ['11:30','🍁','Tofuku-ji','מקדש זן סמוך ל-Fushimi Inari, מפורסם במיוחד בשלכת ובמראה מעמק המייפלים ליד גשר Tsutenkyo.','Tofuku-ji'],
 ['14:00','🏯','Sanjūsangen-dō','אולם עץ ארוך ובו 1,001 פסלי Kannon. חוויה שונה מהמקדשים שכבר ראינו, ולכן שווה לשלב כאן.','Sanjusangen-do'],
 ['16:00','🚉','Kyoto Station + Higashi Hongan-ji','סיום רגוע באזור התחנה: מבנה Kyoto Station המרשים ובמידת הזמן קפיצה ל-Higashi Hongan-ji הסמוך.','Kyoto Station'],
 ['ערב','✨','teamLab Biovortex Kyoto · אופציה','רק אם נחליט להזמין. נשאר כאופציה לערב ולא כחובה, כדי לא להעמיס את היום.','teamLab Biovortex Kyoto']
 ];
 items.forEach(x=>list.appendChild(mkStop(...x)));if(hotel)list.appendChild(hotel);
 let map=day.querySelector('.map-view .route-map-card');if(map)map.innerHTML='<div class="route-map-icon">🗺️</div><h3>מסלול 12/11</h3><ol><li>Fushimi Inari Taisha</li><li>Tofuku-ji Temple</li><li>Sanjusangen-do</li><li>Kyoto Station</li></ol><a class="open-day-route" href="https://www.google.com/maps/dir/?api=1&origin=Fushimi+Inari+Taisha&destination=Kyoto+Station&travelmode=transit&waypoints=Tofuku-ji+Temple|Sanjusangen-do" target="_blank" rel="noopener">פתח את מסלול היום ↗</a>';
}
function fixDay14(){
 const day=q('#day-11');if(!day)return;const list=day.querySelector('.list-view');if(!list)return;
 [...list.querySelectorAll('.stop')].forEach(s=>{if(/Hozenji|Dotonbori · ערב ראשון|ארוחת ערב · Namba|v912i-evening/i.test((s.textContent||'')+' '+s.className))s.remove()});
 const hotel=[...list.querySelectorAll('.stop')].find(s=>/Hotel Royal Classic Osaka/i.test(s.textContent||''));
 const anchor=hotel||list.lastElementChild;
 const evening=[
 ['19:00','🏮','Hozenji Temple + Hozenji Yokocho','אחרי הצ׳ק-אין: סמטת אבן קטנה עם פנסים ומקדש Hozenji, במרחק הליכה קצר מ-Namba.','Hozenji Yokocho'],
 ['19:45','🌃','Dotonbori · ערב ראשון באוסקה','טיול לאורך התעלה, שלטי הניאון ו-Glico Man. מתאים לערב קל אחרי יום Nara.','Dotonbori'],
 ['20:30','🍽️','ארוחת ערב · Namba / Dotonbori','לבחור לפי החשק — אוקונומיאקי, טפניאקי או אוכל יפני אחר. אין צורך לקבע מסעדה מראש.','Namba']
 ];
 let after=anchor;evening.forEach(x=>{const s=mkStop(...x);s.classList.add('v912i-evening');if(after&&after.parentNode===list){after.after(s);after=s}else list.appendChild(s)});
}
function dedupeStops(){qa('.day .list-view').forEach(list=>{const seen=new Set();[...list.querySelectorAll(':scope > .stop')].forEach(s=>{const t=norm(s.querySelector('.time')?.textContent),h=norm(s.querySelector('h3')?.textContent);if(!h)return;const k=t+'|'+h;if(seen.has(k))s.remove();else seen.add(k)})})}
const EXTRA={
 'Shinjuku':'שווה בעיקר בערב: אורות, מסעדות ואווירה. בגלל שהמלון שלנו כאן אין צורך "לכסות" את כל האזור ביום אחד.',
 'JINS Shinjuku':'כדאי לבצע את ההזמנה בתחילת הטיול כדי להשאיר זמן לאיסוף או תיקון אם צריך.',
 'Kaminarimon':'נקודת הכניסה הסמלית לאסקוסה. עדיף להגיע לפני שהרחוב מתמלא.',
 'Nakamise':'הקטע המעניין הוא השיטוט והאווירה; אין צורך לעצור בכל דוכן.',
 'Sensō-ji':'המקדש פעיל גם בשעות מוקדמות, ולכן שווה להגיע לפני עומסי היום.',
 'Ameyoko Market':'שוק טוב גם לקניות קטנות ולא רק לאוכל; המחירים והאופי שונים מקניונים מסודרים.',
 'Akihabara':'בחרו 1–2 חנויות שמעניינות אתכם במקום לנסות להיכנס לכל בניין.',
 'Meiji Shrine':'היער והשקט הם חלק מהחוויה לא פחות מהמקדש עצמו.',
 'Omotesando':'אזור טוב לשלב קניות איכותיות ו-Onitsuka בלי סטייה מהמסלול.',
 'Shibuya Crossing':'החוויה הכי טובה כשהאזור כבר מואר; אין צורך להישאר זמן רב רק במעבר עצמו.',
 'Tsukiji Outer Market':'עדיף להגיע רעבים מוקדם; הרבה חנויות נסגרות מוקדם יחסית.',
 'Ginza':'מתאים לחלון קניות ממוקד, לא חייבים להקדיש לו חצי יום.',
 'Imperial Palace':'הגנים והמרחב הם העיקר; הארמון עצמו אינו פתוח לשיטוט חופשי.',
 'Tokyo Station':'כדאי לראות גם את חזית Marunouchi וגם את קומת האוכל/חנויות אם נשאר זמן.',
 'Lake Ashi':'ביום בהיר שווה לעצור לנוף Fuji, אבל לא לבנות על ראות מושלמת.',
 'Hakone Shrine':'השער ליד האגם הוא נקודת הצילום המבוקשת; לעיתים יש תור.',
 'Owakudani':'אזור געשי פעיל; מזג אוויר ורוח יכולים להשפיע על פתיחת חלק מהמתקנים.',
 'Hakone Ropeway':'הנסיעה עצמה היא חלק מהחוויה, במיוחד בראות טובה לכיוון Fuji.',
 'Kawaguchiko':'נבחר בו רק אם תחזית הראות טובה; אחרת לא שווה את הסטייה.',
 'Hakone Open-Air Museum':'שילוב מוצלח של אמנות ונוף, ומתאים גם אם מזג האוויר חלקית מעונן.',
 'Kiyomizu-dera':'המרפסת והנוף הם השיא; אחר כך ממשיכים ברגל דרך הרחובות ההיסטוריים.',
 'Sannenzaka & Ninenzaka':'הכי יפה מוקדם או לקראת ערב, לפני/אחרי עומסי קבוצות.',
 'Higashiyama':'זהו אזור שיטוט, לא אתר יחיד; עדיף להתקדם בקצב ולא "לסמן וי".',
 'Gion':'בערב האווירה חזקה יותר, אבל חשוב לכבד מגבלות צילום ברחובות פרטיים.',
 'Pontocho':'הערך הוא בערב — סמטה, מסעדות והנהר. לא חייבים לאכול דווקא במקום הכי עמוס.',
 'Fushimi Inari':'אין צורך לטפס לפסגה. אחרי שהעומס נחלש והשערים נהיים צפופים פחות אפשר להסתובב ולרדת.',
 'Tofuku-ji':'אחד מאתרי השלכת הבולטים בקיוטו, ובנובמבר הוא הגיוני במיוחד ביום שמתחיל ב-Fushimi Inari.',
 'Sanjusangen-do':'הייחוד הוא אולם העץ הארוך ו-1,001 פסלי Kannon — שונה מאוד משאר המקדשים במסלול.',
 'Kyoto Station':'שווה להרים מבט לארכיטקטורה, המדרגות והמרפסת העליונה — לא רק להשתמש בה כתחנה.',
 'teamLab Biovortex Kyoto':'אופציה לערב בלבד; אם לא נזמין, היום נשאר שלם גם בלעדיו.',
 'חוויית במבוק Arashiyama / Okusaga':'אם ה-Bamboo Grove עמוס, ממשיכים ל-Giōji או Adashino במקום לבזבז זמן בתור.',
 'Tenryu-ji':'הגן חשוב לא פחות מהמקדש, ומשתלב טבעית עם אזור הבמבוק.',
 'Kinkaku-ji':'האתר אייקוני אבל הביקור קצר יחסית; אין צורך לתכנן סביבו שעות רבות.',
 'Nishiki Market':'טוב לטעימות ולקניות תה/תבלינים; נעדיף לשמור אותו ליום 13 ולא לחזור אליו שוב ביום 12.',
 'Nara Park':'האיילים הם חלק מהדרך בין האתרים; לא להפוך את כל היום רק להאכלה.',
 'Tōdai-ji':'זה השיא התרבותי של Nara ולכן לא לדלג גם אם האיילים מושכים תשומת לב.',
 'Hozenji Yokocho':'מקום קטן ומתאים במיוחד לערב, לכן הוא משתלב אחרי הצ׳ק-אין ולא כיעד יום.',
 'Dotonbori':'להגיע אחרי החשיכה. אם מסעדה מסוימת מלאה, פשוט עוברים לחלופה ברחוב סמוך.',
 'Osaka Castle':'אם המוזיאון בפנים פחות מעניין, אפשר להסתפק בפארק ובטירה מבחוץ.',
 'Umeda':'אזור מודרני גדול; נבחר תצפית אחת בלבד ולא נרדוף אחרי כמה.',
 'Shinsaibashi':'רחוב קניות מקורה שמתחבר טבעית ל-Dotonbori ולכן נוח לסיים בו את היום.'
};
function enrichModal(place){const modal=q('#placeModal');if(!modal)return;const desc=q('#modalDesc'),tip=q('#modalTip');if(!tip)return;const extra=EXTRA[place];if(extra){tip.textContent='💡 '+extra;tip.style.display=''}else if(desc&&norm(desc.textContent)===norm(tip.textContent)){tip.textContent='';tip.style.display='none'}}
function fixPlaceMetadata(){qa('#placesGrid .place-card').forEach(c=>{const h=c.querySelector('h3')?.textContent||'';if(/Fushimi Inari/i.test(h)){c.dataset.city='קיוטו';c.dataset.scheduled='1';const m=c.querySelector('.place-card-meta');if(m)m.textContent='מקדשים · במסלול · 12/11 · 09:00';const b=c.querySelector('.scheduled-badge');if(b)b.textContent='🟢 במסלול · 12/11 · 09:00'}if(/Nara Park/i.test(h)){c.dataset.city='נארה';const m=c.querySelector('.place-card-meta');if(m)m.textContent='טבע · במסלול · 14/11 · 12:00';const b=c.querySelector('.scheduled-badge');if(b)b.textContent='🟢 במסלול · 14/11 · 12:00'}if(/Tōdai-ji/i.test(h)){c.dataset.city='נארה';const m=c.querySelector('.place-card-meta');if(m)m.textContent='מקדשים · במסלול · 14/11 · 13:00';const b=c.querySelector('.scheduled-badge');if(b)b.textContent='🟢 במסלול · 14/11 · 13:00'}})}
function version(){let v=q('header .logo .app-version')||q('header .logo small');if(v)v.textContent='2026 · '+VERSION;document.title='Japan Trip 2026 · '+VERSION;document.documentElement.dataset.appReady=VERSION}
function run(){rebuildDay12();fixDay14();dedupeStops();fixPlaceMetadata();version()}
let busy=false;function schedule(){if(busy)return;busy=true;setTimeout(()=>{busy=false;run()},120)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('pageshow',schedule);
document.addEventListener('click',e=>{const b=e.target.closest('.guide-tips-btn,.place-info-btn,.info-modal-btn');if(!b)return;const p=b.dataset.place||'';setTimeout(()=>enrichModal(p),100)},true);
setTimeout(()=>{if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js?v=912i',{scope:'./'}).then(r=>r.update()).catch(()=>{})},300);
})();