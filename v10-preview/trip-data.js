/* Japan Trip 2026 · canonical data · v10.0.0
   One source of truth. No runtime hotel/place replacement patches. */
(() => {
  'use strict';
  const G = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  const D = (origin,destination,waypoints=[]) => 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(origin) + '&destination=' + encodeURIComponent(destination) + (waypoints.length ? '&waypoints=' + waypoints.map(encodeURIComponent).join('%7C') : '') + '&travelmode=transit';
  const RATE_JPY_ILS = 0.0196773; // snapshot used in the trip file on 10/09/2026

  const hotels = [
    {
      key:'hotel-jr-kyushu-shinjuku', city:'Tokyo', dates:'4–8 Nov 2026', booked:true,
      name:'JR Kyushu Hotel Blossom Shinjuku', provider:'Agoda', booking:'696266027', reference:'6870831053',
      room:'Standard Double Room with Queen Bed · Non-Smoking', size:'19 m²', bed:'Queen · 160×200 cm',
      meal:'כולל ארוחת בוקר + Wi-Fi', jpy:311616, ils:Math.round(311616*RATE_JPY_ILS), payment:'תשלום מאוחר',
      cancellation:'ביטול חינם לפני 1 Nov 2026',
      address:'2-6-2 Yoyogi, Shibuya-ku, Tokyo', arrival:'JR Shinjuku · South Exit · כ־3 דקות',
      map:G('JR Kyushu Hotel Blossom Shinjuku')
    },
    {
      key:'hotel-hakone', city:'Hakone / Fuji', dates:'8–10 Nov 2026', booked:false,
      name:'Hakone / Fuji · טרם הוזמן', provider:'', booking:'', reference:'', room:'', size:'', bed:'', meal:'', jpy:0, ils:0,
      payment:'', cancellation:'', address:'', arrival:'מקום הלינה באזור Hakone / Fuji עדיין לא נסגר.', map:G('Hakone Japan')
    },
    {
      key:'hotel-daiwa-kyoto-shijo', city:'Kyoto', dates:'10–14 Nov 2026', booked:true,
      name:'Daiwa Roynet Hotel Kyoto Shijo Karasuma', provider:'Agoda', booking:'2048972834', reference:'',
      room:'Moderate Double Room · Newly Renovated · Non-Smoking', size:'21.1 m²', bed:'Double רחבה · 168×203 cm',
      meal:'ללא ארוחת בוקר · Wi-Fi + coffee/tea', jpy:116856, ils:Math.round(116856*RATE_JPY_ILS), payment:'תשלום מאוחר',
      cancellation:'ביטול חינם לפני 9 Nov 2026',
      address:'678 Omandokorocho, Karasumadori, Shimogyo-ku, Kyoto 600-8413', arrival:'Kyoto Subway Shijo · Exit 5 · כ־1 דקה מהיציאה',
      map:G('Daiwa Roynet Hotel Kyoto Shijo Karasuma')
    },
    {
      key:'hotel-royal-classic-osaka', city:'Osaka', dates:'14–16 Nov 2026', booked:true,
      name:'Hotel Royal Classic Osaka', provider:'Agoda', booking:'693085383', reference:'GHT261114349164',
      room:'Standard Queen Room · Non-Smoking', size:'25.6–31 m²', bed:'מיטה זוגית אחת',
      meal:'כולל ארוחת בוקר + Wi-Fi', jpy:109398, ils:Math.round(109398*RATE_JPY_ILS), payment:'תשלום מאוחר',
      cancellation:'ביטול חינם לפני 12 Nov 2026',
      address:'4-3-3 Namba, Chuo-ku, Osaka', arrival:'Osaka Metro Namba · Exit 12 · מחובר ישירות למלון',
      map:G('Hotel Royal Classic Osaka')
    },
    {
      key:'hotel-metropolitan-marunouchi', city:'Tokyo', dates:'16–17 Nov 2026', booked:true,
      name:'Hotel Metropolitan Tokyo Marunouchi', provider:'Klook', booking:'QXU287073', reference:'',
      room:'UTSUROI (Renovated) · Queen · Non-Smoking', size:'18 m²', bed:'Queen',
      meal:'ללא ארוחת בוקר', jpy:Math.round(676.61/RATE_JPY_ILS), ils:676.61, yenEquivalent:true, payment:'שולם',
      cancellation:'ביטול חינם עד 15 Nov 2026 · 21:59 (שעון יפן)',
      address:'Sapia Tower, 1-7-12 Marunouchi, Chiyoda-ku, Tokyo', arrival:'Tokyo Station · Nihombashi Exit · כ־1 דקה',
      map:G('Hotel Metropolitan Tokyo Marunouchi')
    }
  ];

  const places = {
    'Narita Airport':{name:'Narita International Airport',icon:'✈️',city:'Tokyo / Chiba',cat:'אתרים',desc:'שדה התעופה הבינלאומי שבו נוחתים וממנו ממריאים. Narita Express הוא אחת האפשרויות הנוחות להגיע ישירות ל-Shinjuku עם מזוודות.',tip:'ביום החזרה משאירים מרווח גדול לנסיעה, לבידוק ול-Terminal 2.',map:G('Narita International Airport Terminal 2')},
    'Shinjuku':{name:'Shinjuku',icon:'🏙️',city:'Tokyo',cat:'אתרים',schedule:'04/11 · ערב',desc:'אזור ענק סביב אחת התחנות העמוסות בעולם: קניות, מסעדות, גורדי שחקים וחיי לילה. מערב Shinjuku מתאים לתצפית ולבנייני המשרדים, והמזרח לאווירת ערב.',tip:'בודקים מראש את ה-Exit הנכון בתחנה; יציאה לא נכונה יכולה להוסיף הליכה מיותרת.',map:G('Shinjuku Tokyo')},
    'JINS Shinjuku':{name:'JINS Shinjuku',icon:'👓',city:'Tokyo',cat:'שווקים וקניות',schedule:'04/11 · ערב / איסוף 17/11 אם צריך',desc:'חנות משקפיים של JINS בשינג׳וקו. התוכנית היא לבצע בדיקת ראייה ולהזמין מוקדם בטיול כדי להשאיר זמן להכנה ולאיסוף.',tip:'להגיע עם המרשם הקיים אם יש, ולוודא בזמן ההזמנה מתי המשקפיים יהיו מוכנים.',map:G('JINS Shinjuku Tokyo')},
    'Kaminarimon':{name:'Kaminarimon',icon:'⛩️',city:'Tokyo',cat:'מקדשים',schedule:'05/11 · 09:00',desc:'שער הרעם האדום והכניסה האייקונית לאזור Sensō-ji ו-Nakamise באסקוסה.',tip:'בבוקר מוקדם האזור רגוע יותר; בהמשך היום הוא נעשה צפוף מאוד.',map:G('Kaminarimon Tokyo')},
    'Nakamise':{name:'Nakamise Shopping Street',icon:'🛍️',city:'Tokyo',cat:'שווקים וקניות',schedule:'05/11 · 09:15',desc:'רחוב שוק מסורתי המוביל מ-Kaminarimon ל-Sensō-ji, עם מזכרות, ממתקים ומוצרים יפניים.',tip:'לא חייבים לעצור בכל דוכן; עדיף לעבור בנחת ולשמור זמן למקדש.',map:G('Nakamise Shopping Street Tokyo')},
    'Sensō-ji':{name:'Sensō-ji',icon:'🏯',city:'Tokyo',cat:'מקדשים',schedule:'05/11 · 09:30',desc:'המקדש הבודהיסטי העתיק והמפורסם ביותר בטוקיו, בלב Asakusa.',tip:'שווה להמשיך גם לצדדים של המתחם ולא רק לצלם את האולם המרכזי.',map:G('Sensoji Tokyo')},
    'Ueno':{name:'Ueno',icon:'🌳',city:'Tokyo',cat:'אתרים',schedule:'05/11 · 12:00',desc:'אזור של פארק, מוזיאונים, תחבורה ושוק Ameyoko. הוא מתאים למעבר נוח מאסקוסה לכיוון Akihabara.',tip:'אם היום מתארך, הפארק עצמו יכול להיות עצירה קצרה ולא יעד של שעות.',map:G('Ueno Tokyo')},
    'Ameyoko Market':{name:'Ameyoko Market',icon:'🍜',city:'Tokyo',cat:'שווקים וקניות',schedule:'05/11 · 13:00',desc:'שוק רחוב צפוף וססגוני עם בגדים, נעליים, קוסמטיקה, ממתקים, תבלינים ואוכל.',tip:'שווה כחוויה גם בלי לקנות; עדיף להשאיר ידיים פנויות לפני Akihabara.',map:G('Ameyoko Shopping District Tokyo')},
    'Akihabara':{name:'Akihabara',icon:'🎮',city:'Tokyo',cat:'אתרים',schedule:'05/11 · 16:30',desc:'רובע אלקטרוניקה, משחקים, אנימה ואספנות עם בניינים שלמים של חנויות וניאון.',tip:'לבחור 1–2 חנויות שמעניינות באמת ולא לנסות להיכנס לכל מקום.',map:G('Akihabara Electric Town Tokyo')},
    'Meiji Shrine':{name:'Meiji Shrine',icon:'⛩️',city:'Tokyo',cat:'מקדשים',schedule:'06/11 · 09:00',desc:'מקדש שינטו גדול בתוך יער בלב טוקיו, ליד Harajuku. המעבר מהעיר ליער הוא חלק מרכזי מהחוויה.',tip:'מתחילים מוקדם ואז ממשיכים ברגל ל-Harajuku ו-Omotesando.',map:G('Meiji Jingu Tokyo')},
    'Harajuku':{name:'Harajuku',icon:'🏙️',city:'Tokyo',cat:'אתרים',schedule:'06/11 · 10:45',desc:'אזור אופנה ותרבות צעירה סביב Takeshita Street והרחובות הצדדיים.',tip:'Takeshita יכולה להיות עמוסה; הרחובות הצדדיים נעימים יותר לשיטוט.',map:G('Takeshita Street Harajuku Tokyo')},
    'Omotesando':{name:'Omotesando',icon:'☕',city:'Tokyo',cat:'שווקים וקניות',schedule:'06/11 · 12:30',desc:'שדרה אלגנטית עם אדריכלות, בתי קפה, חנויות ומותגים.',tip:'היא מחברת טבעית בין Harajuku לכיוון Shibuya, ולכן אין צורך בנסיעה נפרדת.',map:G('Omotesando Tokyo')},
    'Shibuya Crossing':{name:'Shibuya Crossing',icon:'🚦',city:'Tokyo',cat:'אתרים',schedule:'06/11 · 15:00',desc:'מעבר החצייה האייקוני של Shibuya, מוקף מסכים, תחנות ומרכזי קניות.',tip:'כדאי לראות פעם אחת מגובה הרחוב ופעם נוספת מנקודת תצפית ציבורית סמוכה.',map:G('Shibuya Scramble Crossing Tokyo')},
    'Tokyo Metropolitan Government Building Observatory':{name:'Tokyo Metropolitan Government Building Observatory',icon:'🌇',city:'Tokyo · Shinjuku',cat:'תצפיות',desc:'תצפית גבוהה וחינמית יחסית בלב Shinjuku, חלופה גמישה ל-Shibuya Sky בלי לבנות את כל היום סביב הזמנה.',tip:'נעלה רק אם הראות טובה; אם מעונן אין סיבה לבזבז זמן.',map:G('Tokyo Metropolitan Government Building Observatory')},
    'Roppongi Hills Tokyo City View':{name:'Roppongi Hills Tokyo City View',icon:'🌇',city:'Tokyo · Roppongi',cat:'תצפיות',desc:'תצפית על מרכז טוקיו עם זווית טובה במיוחד לכיוון Tokyo Tower.',tip:'נבחר בה רק אם Roppongi משתלב באותו ערב, לא כנסיעה מיוחדת לעוד תצפית.',map:G('Roppongi Hills Tokyo City View')},
    'Tsukiji Outer Market':{name:'Tsukiji Outer Market',icon:'🛍️',city:'Tokyo',cat:'שווקים וקניות',schedule:'07/11 · 09:00',desc:'שוק חיצוני צפוף עם אוכל, סכינים, כלי מטבח, תה ומוצרים יפניים. גם למי שפחות אוכל דג נא יש הרבה מה לראות.',tip:'מגיעים מוקדם ומסתובבים קודם לפני שמחליטים איפה לאכול או לקנות.',map:G('Tsukiji Outer Market Tokyo')},
    'Ginza':{name:'Ginza',icon:'🏙️',city:'Tokyo',cat:'שווקים וקניות',schedule:'07/11 · 11:30',desc:'רובע קניות ובילוי אלגנטי עם בתי כלבו, חנויות דגל, גלריות ומסעדות.',tip:'בסופי שבוע חלק מהשדרה המרכזית עשוי להפוך למדרחוב, מה שהופך את השיטוט לנעים יותר.',map:G('Ginza Tokyo')},
    'Imperial Palace':{name:'Imperial Palace',icon:'🏰',city:'Tokyo',cat:'אתרים',schedule:'07/11 · 14:00',desc:'אזור הארמון הקיסרי על שטח טירת Edo לשעבר. החפירים, חומות האבן והמרחב הירוק נותנים ניגוד למרכז העסקי.',tip:'אם הזמן קצר מספיק לראות את אזור החפיר והגשר מבחוץ ולהמשיך ל-Marunouchi.',map:G('Imperial Palace Tokyo')},
    'Tokyo Station / Marunouchi':{name:'Tokyo Station / Marunouchi',icon:'🚉',city:'Tokyo',cat:'אתרים',schedule:'07/11 · 16:30',desc:'חזית הלבנים האדומות ההיסטורית של Tokyo Station והאזור העסקי האלגנטי של Marunouchi.',tip:'שעת ערב מתאימה במיוחד לחזית התחנה ול-Naka-dori.',map:G('Tokyo Station Marunouchi')},
    'Odawara':{name:'Odawara',icon:'🚄',city:'Hakone / Fuji',cat:'אתרים',desc:'נקודת המעבר בין Tokyo לאזור Hakone. כאן מתוכננים איסוף והחזרת הרכב, ומכאן גם עולים ל-Shinkansen לקיוטו.',tip:'עדיף לרכז את כל פעולות הרכב ליד התחנה כדי לא להסתבך עם מזוודות.',map:G('Odawara Station')},
    'Lake Ashi':{name:'Lake Ashi',icon:'🏞️',city:'Hakone / Fuji',cat:'טבע',schedule:'08/11 · 12:00',desc:'אגם הררי שהוא אחד מסמלי Hakone. ביום בהיר אפשר לראות ממנו את Fuji, ועל שפתו נמצא Hakone Shrine.',tip:'אם הראות לפוג׳י טובה בבוקר, נותנים לה עדיפות לפני שהעננות מתפתחת.',map:G('Lake Ashi Hakone')},
    'Hakone Shrine':{name:'Hakone Shrine',icon:'⛩️',city:'Hakone / Fuji',cat:'מקדשים',schedule:'08/11 · 14:00',desc:'מקדש שינטו בתוך יער לצד Lake Ashi, עם שער Torii אדום ליד המים.',tip:'התור לצילום בשער שעל שפת האגם יכול להיות ארוך; המקדש והיער שווים גם בלי להמתין.',map:G('Hakone Shrine')},
    'Owakudani':{name:'Owakudani',icon:'🗻',city:'Hakone / Fuji',cat:'טבע',schedule:'09/11 · 09:00',desc:'עמק געשי פעיל עם אדים, ריח גופרית ונוף דרמטי. ביום בהיר יש לעיתים תצפית טובה ל-Fuji.',tip:'בודקים בבוקר שהגישה והרכבל פועלים בגלל רוח או מגבלות געשיות.',map:G('Owakudani Hakone')},
    'Hakone Ropeway':{name:'Hakone Ropeway',icon:'🚡',city:'Hakone / Fuji',cat:'אתרים',schedule:'09/11 · 10:30',desc:'רכבל מעל האזור הגעשי של Hakone, שהוא גם אמצעי תחבורה וגם אטרקציה נופית.',tip:'אם יש רוח חזקה, בודקים סטטוס לפני שמבנים את היום סביבו.',map:G('Hakone Ropeway')},
    'Kawaguchiko':{name:'Lake Kawaguchiko',icon:'🗻',city:'Hakone / Fuji',cat:'טבע',schedule:'09/11 · לפי הראות',desc:'אחד מחמשת אגמי Fuji ואחד המקומות הטובים לצפייה בהר מקרוב. בנובמבר יש גם שלכת.',tip:'נוסעים רק אם הראות מצדיקה את זה; ביום סגור עדיף להשקיע את הזמן ב-Hakone.',map:G('Lake Kawaguchiko Japan')},
    'Hakone Open-Air Museum':{name:'Hakone Open-Air Museum',icon:'🖼️',city:'Hakone / Fuji',cat:'מוזיאונים',schedule:'09/11 · אופציה',desc:'מוזיאון פתוח המשלב פסלים ואמנות עם נוף ההרים של Hakone.',tip:'חלופה טובה אם הראות לפוג׳י פחות מוצלחת או אם רוצים יום רגוע יותר.',map:G('Hakone Open-Air Museum')},
    'Gion':{name:'Gion',icon:'🏮',city:'Kyoto',cat:'אתרים',schedule:'10/11 + 11/11',desc:'הרובע המסורתי המפורסם של Kyoto, עם machiya, סמטאות, Hanamikoji ואזור Shirakawa.',tip:'הכי נעים לקראת ערב; שומרים על שקט וכבוד לתושבים ולא מצלמים אנשים באופן פולשני.',map:G('Gion Kyoto')},
    'Kiyomizu-dera':{name:'Kiyomizu-dera',icon:'🏯',city:'Kyoto',cat:'מקדשים',schedule:'11/11 · 09:00',desc:'מקדש מפורסם על צלע ההר עם מרפסת עץ ונוף לעיר.',tip:'להגיע מוקדם ואז לרדת ברגל דרך Sannenzaka ו-Ninenzaka.',map:G('Kiyomizu-dera Kyoto')},
    'Sannenzaka & Ninenzaka':{name:'Sannenzaka & Ninenzaka',icon:'🏘️',city:'Kyoto',cat:'אתרים',schedule:'11/11 · 10:30',desc:'רחובות היסטוריים עם בתי עץ, חנויות, תה ומדרגות בין Kiyomizu ל-Higashiyama.',tip:'השילוב הטוב הוא בירידה מהמקדש ולא כנסיעה נפרדת.',map:G('Sannenzaka Kyoto')},
    'Higashiyama':{name:'Higashiyama',icon:'🏞️',city:'Kyoto',cat:'אתרים',schedule:'11/11 · 12:30',desc:'אזור היסטורי במזרח Kyoto שמחבר מקדשים, סמטאות ורחובות מסורתיים.',tip:'זה יום שמתאים בעיקר להליכה; נעליים נוחות חשובות יותר מתכנון של רכבת לכל קטע.',map:G('Higashiyama Kyoto')},
    'Pontocho':{name:'Pontocho',icon:'🍜',city:'Kyoto',cat:'אתרים',schedule:'11/11 · 19:00',desc:'סמטת מסעדות צרה ליד נהר Kamo, יפה במיוחד בערב.',tip:'אפשר לאכול גם ברחובות הסמוכים אם המסעדות בסמטה עצמה מלאות.',map:G('Pontocho Alley Kyoto')},
    'Fushimi Inari':{name:'Fushimi Inari Taisha',icon:'⛩️',city:'Kyoto',cat:'מקדשים',schedule:'12/11 · 09:00',desc:'מקדש שינטו מפורסם בזכות אלפי שערי Torii אדומים לאורך שבילי הר Inari.',tip:'אין צורך להגיע לפסגה; נלך מספיק כדי לקבל את חוויית השערים והיער ואז נחזור.',map:G('Fushimi Inari Taisha Kyoto')},
    'Tofuku-ji':{name:'Tofuku-ji',icon:'🍁',city:'Kyoto',cat:'מקדשים',schedule:'12/11 · 11:30',desc:'מקדש זן גדול סמוך ל-Fushimi Inari, מפורסם בגשרים, גנים ושלכת.',tip:'באמצע נובמבר עלול להיות עמוס; נחליט במקום לפי התורים.',map:G('Tofuku-ji Kyoto')},
    'Sanjusangen-do':{name:'Sanjūsangen-dō',icon:'🏯',city:'Kyoto',cat:'מקדשים',schedule:'12/11 · 14:00',desc:'אולם עץ ארוך ובו 1,001 פסלי Kannon, אחד האתרים המרשימים והייחודיים בקיוטו.',tip:'הצילום בפנים מוגבל; מגיעים בשביל האולם והפסלים עצמם.',map:G('Sanjusangendo Kyoto')},
    'Kyoto Station':{name:'Kyoto Station',icon:'🚉',city:'Kyoto',cat:'אתרים',schedule:'12/11 · 16:00',desc:'תחנה מרכזית ענקית עם אדריכלות מודרנית, חנויות ומסעדות. מתאימה לעצירה לפני פעילות ערב.',tip:'אם נשאר זמן אפשר לשלב את Higashi Hongan-ji הסמוך.',map:G('Kyoto Station')},
    'Higashi Hongan-ji':{name:'Higashi Hongan-ji',icon:'🏯',city:'Kyoto',cat:'מקדשים',schedule:'12/11 · אופציה',desc:'מקדש בודהיסטי גדול במרחק הליכה קצר מ-Kyoto Station.',tip:'משלבים רק אם נשאר זמן לפני teamLab; לא צריך להעמיס.',map:G('Higashi Hongan-ji Kyoto')},
    'teamLab Biovortex Kyoto':{name:'teamLab Biovortex Kyoto',icon:'✨',city:'Kyoto',cat:'מוזיאונים',schedule:'12/11 · ערב',desc:'חוויית אמנות דיגיטלית immersive של teamLab בקיוטו, אחת מפעילויות החובה שסומנו לטיול.',tip:'להזמין מראש לשעת ערב מתאימה ולהשאיר מרווח מהפעילות הקודמת.',map:G('teamLab Biovortex Kyoto')},
    'Arashiyama / Okusaga':{name:'Arashiyama / Okusaga · חוויית במבוק',icon:'🎋',city:'Kyoto',cat:'טבע',schedule:'13/11 · 09:00',desc:'אזור טבע במערב Kyoto. אם Bamboo Grove המרכזי עמוס, ממשיכים ל-Okusaga, Giōji או Adashino לחוויה רגועה יותר.',tip:'לא לבזבז זמן על ניסיון לצלם את היער הראשי בלי אנשים; האלטרנטיבות השקטות עדיפות אם עמוס.',map:G('Arashiyama Kyoto')},
    'Tenryu-ji':{name:'Tenryu-ji',icon:'🏯',city:'Kyoto',cat:'מקדשים',schedule:'13/11 · בוקר',desc:'מקדש זן מרכזי ב-Arashiyama עם גן שמשתלב בנוף ההרים.',tip:'נוח לעבור דרך הגן ולהמשיך ממנו ישירות לכיוון אזור הבמבוק.',map:G('Tenryu-ji Kyoto')},
    'Kinkaku-ji':{name:'Kinkaku-ji · Golden Pavilion',icon:'🏯',city:'Kyoto',cat:'מקדשים',schedule:'13/11 · 12:30',desc:'מקדש הזהב, אחד הסמלים המפורסמים של Kyoto, סביב בריכה וגן מסודר.',tip:'הביקור קומפקטי; שעה בדרך כלל מספיקה.',map:G('Kinkaku-ji Kyoto')},
    'Nishiki Market':{name:'Nishiki Market',icon:'🛍️',city:'Kyoto',cat:'שווקים וקניות',schedule:'13/11 · 15:30',desc:'שוק מקורה ארוך עם אוכל, תה, תבלינים, ממתקים וכלי מטבח.',tip:'מתאים לשיטוט וטעימות; לא חייבים להפוך אותו לארוחה מלאה.',map:G('Nishiki Market Kyoto')},
    'Giōji Temple':{name:'Giōji Temple',icon:'🌿',city:'Kyoto · Okusaga',cat:'טבע',desc:'מקדש קטן ושקט עם גן טחב, במבוק ועצי מייפל באזור Okusaga.',tip:'האלטרנטיבה המועדפת אם Bamboo Grove המרכזי עמוס.',map:G('Gioji Temple Kyoto')},
    'Adashino Nenbutsu-ji':{name:'Adashino Nenbutsu-ji',icon:'🎋',city:'Kyoto · Okusaga',cat:'טבע',desc:'מקדש באזור השקט של Okusaga עם אלפי פסלי אבן ושביל במבוק קטן.',tip:'מתאים אם יש זמן וכוח להמשיך מעט עמוק יותר לתוך Okusaga.',map:G('Adashino Nenbutsu-ji Kyoto')},
    '66tantan':{name:'66tantan (Rokuroku Tantan)',icon:'🍜',city:'Kyoto',cat:'מסעדות',schedule:'13/11 · 13:45',desc:'Tantanmen קטן ומיוחד בגיון · 286-6 Gionmachi Kitagawa.',tip:'מקום קטן; אם יש תור חריג, לא לבזבז זמן רב על ההמתנה.',map:G('66tantan Rokuroku Tantan Kyoto'),rating:5.0,reviews:468,type:'Tantanmen / Dan Dan noodles'},
    'Nara Park':{name:'Nara Park',icon:'🦌',city:'Nara',cat:'טבע',schedule:'14/11 · סביב 12:00',desc:'פארק ירוק שבו מסתובבים איילי sika בחופשיות, בדרך לאתרים המרכזיים של Nara.',tip:'קונים shika-senbei רק כשבאמת רוצים להאכיל; האיילים מזהים את הקרקרים ומתקבצים מהר.',map:G('Nara Park')},
    'Tōdai-ji':{name:'Tōdai-ji',icon:'🏯',city:'Nara',cat:'מקדשים',schedule:'14/11 · צהריים',desc:'אחד המקדשים הבודהיסטיים החשובים ביפן, עם אולם Daibutsuden ופסל בודהה ברונזה ענק.',tip:'לא לוותר עליו בגלל האיילים; זה השיא התרבותי של יום Nara.',map:G('Todaiji Nara')},
    'Naramachi':{name:'Naramachi',icon:'☕',city:'Nara',cat:'אתרים',schedule:'14/11 · רק אם נשאר זמן',desc:'רובע מסורתי עם בתי עץ, חנויות קטנות ובתי קפה.',tip:'אופציונלי בלבד; לא פוגעים בזמן של Tōdai-ji כדי להספיק אותו.',map:G('Naramachi Nara')},
    'Hozenji Yokocho':{name:'Hozenji Temple + Hozenji Yokocho',icon:'🏮',city:'Osaka',cat:'אתרים',schedule:'14/11 · 19:00',desc:'סמטת אבן קטנה ואטמוספרית ליד Namba עם מקדש Hozenji ופנסים.',tip:'מעבר קצר ומוצלח לפני Dotonbori; אין צורך להקדיש שעות.',map:G('Hozenji Yokocho Osaka')},
    'Dotonbori':{name:'Dotonbori',icon:'🌃',city:'Osaka',cat:'אתרים',schedule:'14/11 · 19:45 + 15/11 ערב',desc:'אזור הבילויים והאוכל המזוהה ביותר עם Osaka, סביב התעלה ושלטי הניאון, כולל Glico Running Man.',tip:'להגיע אחרי החשיכה. אם מסעדה אחת מלאה, יש המון חלופות ברחובות הסמוכים.',map:G('Dotonbori Osaka')},
    'Namba':{name:'Namba',icon:'🏙️',city:'Osaka',cat:'אתרים',schedule:'14/11 · ערב',desc:'מרכז התחבורה, הקניות והבילויים של דרום Osaka. Dotonbori, Kuromon ו-Shinsaibashi כולם בטווח הליכה.',tip:'אחרי שמגיעים ל-Namba עדיף לעבור ברגל בין האתרים ולא לחזור לרכבת לכל קפיצה קצרה.',map:G('Namba Osaka')},
    'Osaka Castle':{name:'Osaka Castle',icon:'🏰',city:'Osaka',cat:'אתרים',schedule:'15/11 · 09:00',desc:'טירה משוחזרת בתוך פארק גדול עם חפירים וגנים. אפשר ליהנות מהפארק ומהמבנה גם בלי להיכנס למוזיאון.',tip:'אם מוזיאון היסטורי פחות מעניין, נסתפק בחוץ ונחסוך את התור.',map:G('Osaka Castle')},
    'Umeda':{name:'Umeda',icon:'🏙️',city:'Osaka',cat:'אתרים',schedule:'15/11 · 12:30',desc:'מרכז מודרני של Osaka עם תחנות ענק, קניונים, גורדי שחקים ו-Grand Front.',tip:'מתאים לצהריים ולתצפית אם מזג האוויר טוב.',map:G('Umeda Osaka')},
    'Shinsaibashi':{name:'Shinsaibashi',icon:'🛍️',city:'Osaka',cat:'שווקים וקניות',schedule:'15/11 · 16:00',desc:'רחוב קניות מקורה ארוך שמוביל כמעט ישירות ל-Dotonbori.',tip:'המעבר ממנו ל-Dotonbori הוא טבעי ברגל, אין צורך בתחבורה.',map:G('Shinsaibashi Osaka')},
    'Kuromon Market':{name:'Kuromon Market',icon:'🍜',city:'Osaka',cat:'שווקים וקניות',desc:'שוק מקורה באורך של כ-600 מטר עם דוכני אוכל, בשר, פירות, ממתקים, כלי בית וגם דגים ופירות ים.',tip:'עוברים קודם לאורך השוק ורק אחר כך מחליטים איפה לקנות או לאכול.',map:G('Kuromon Ichiba Market Osaka')},
    'Nihonbashi':{name:'Nihonbashi',icon:'🏮',city:'Tokyo',cat:'אתרים',schedule:'16/11 · 15:00',desc:'אזור המחבר Edo ישנה עם Tokyo המודרנית: Nihonbashi Bridge, רחובות ותיקים ו-COREDO Muromachi.',tip:'מתאים לשעתיים רגועות אחרי נסיעת ה-Shinkansen ולפני ערב Marunouchi.',map:G('Nihonbashi Bridge Tokyo')},
    'Gransta / Character Street':{name:'Tokyo Station · Gransta / Character Street',icon:'🛍️',city:'Tokyo',cat:'שווקים וקניות',schedule:'16/11 · 17:00',desc:'אזור קניות בתוך וסביב Tokyo Station עם מתנות, ממתקים, Character Street ו-Daimaru.',tip:'מקום מצוין להשלמות אחרונות בלי להתרחק מהמלון.',map:G('Tokyo Character Street')},
    'KITTE Marunouchi':{name:'KITTE + Marunouchi Naka-dori',icon:'🌃',city:'Tokyo',cat:'תצפיות',schedule:'16/11 · 18:30',desc:'Rooftop Garden של KITTE נותן מבט יפה לכיוון Tokyo Station, ומשם ממשיכים להליכה קצרה ב-Marunouchi Naka-dori.',tip:'אם התאורה העונתית כבר פעילה באמצע נובמבר, זה בונוס לערב האחרון.',map:G('KITTE Marunouchi Tokyo')},
    'Gyukatsu Motomura Shinjuku':{name:'Gyukatsu Motomura Shinjuku',icon:'🍽️',city:'Tokyo',cat:'מסעדות',desc:'Gyukatsu בשינג׳וקו — בקר מצופה ומטוגן שמסיימים על אבן חמה.',tip:'לעיתים יש תורים; לבדוק סניף חלופי קרוב אם ההמתנה ארוכה.',map:G('Gyukatsu Motomura Shinjuku Main Branch'),rating:4.9,reviews:8231,type:'Gyukatsu · קאטסו בקר'},
    'AFURI Harajuku':{name:'AFURI Harajuku',icon:'🍽️',city:'Tokyo',cat:'מסעדות',desc:'ראמן קליל המזוהה עם Yuzu Shio באזור Harajuku.',tip:'אפשרות טובה ביום Meiji / Harajuku אם רוצים ראמן פחות כבד.',map:G('AFURI Harajuku Tokyo'),rating:4.4,reviews:4980,type:'Ramen · Yuzu Shio'},
    'Katsukura Kyoto Porta':{name:'Katsukura Kyoto Porta',icon:'🍽️',city:'Kyoto',cat:'מסעדות',desc:'Tonkatsu ליד Kyoto Station, נוח במיוחד ביום שעובר באזור התחנה.',tip:'מתאים אם רוצים ארוחה מבושלת ופשוטה יחסית.',map:G('Katsukura Kyoto Porta'),rating:4.4,reviews:1290,type:'Tonkatsu · קאטסו חזיר'},
    'Mizuno Dotonbori':{name:'Mizuno Dotonbori',icon:'🍽️',city:'Osaka',cat:'מסעדות',desc:'מסעדת Okonomiyaki מוכרת באזור Dotonbori.',tip:'אם התור ארוך מאוד, יש הרבה חלופות טובות באזור.',map:G('Mizuno Dotonbori Osaka'),rating:3.8,reviews:3167,type:'Okonomiyaki'},
    '551 HORAI':{name:'551 HORAI Honten',icon:'🍽️',city:'Osaka',cat:'מסעדות',desc:'הסניף הראשי של 551 HORAI, מפורסם ב-Butaman וב-Shumai.',tip:'טוב כנשנוש או ארוחה קלה באזור Namba.',map:G('551 HORAI Honten Osaka'),rating:4.2,reviews:4385,type:'Chinese · Butaman / Shumai'},
    'Namba Ramen Ichiza':{name:'Namba Ramen Ichiza',icon:'🍽️',city:'Osaka',cat:'מסעדות',schedule:'15/11 · אופציה לארוחה',desc:'מתחם ראמן בקומה 9 של EDION Namba עם כמה סגנונות ראמן במקום אחד.',tip:'נוח כשלא רוצים להחליט מראש על מסעדת ראמן אחת.',map:G('Namba Ramen Ichiza Osaka'),rating:3.9,reviews:1488,type:'Ramen food hall'}
  };

  const days = [
    {date:'03/11',dow:'שלישי',city:'ישראל → יפן',title:'עזרי ואיילי יוצאים לדרך ✈️',summary:'נתב״ג → Dubai → Tokyo · יום טיסה',stops:[
      {time:'13:50',icon:'✈️',title:'TLV → Dubai',text:'EK2269 / FZ1636 · Flydubai · Economy Flex · TLV Terminal 3 → DXB Terminal 3.'},
      {time:'18:55',icon:'🇦🇪',title:'נחיתה ב-Dubai',text:'קונקשן 3:50 שעות · אוכל, התרעננות והגעה רגועה לשער.'},
      {time:'22:45',icon:'✈️',title:'Dubai → Tokyo Narita',text:'EK320 · Emirates · מושבים: Azriel 48K · Ayala 48J · DXB T3 → Narita T2.',tag:'⭐ להיות בשער בזמן'},
      {time:'מחר 13:10',icon:'🇯🇵',title:'נחיתה Narita',text:'הנחיתה ביפן מופיעה בתחילת היום הבא.'}
    ],route:null},
    {date:'04/11',dow:'רביעי',city:'Tokyo',title:'נחיתה והתאקלמות',summary:'Narita → מלון → ערב קל ב-Shinjuku → JINS',hotel:'hotel-jr-kyushu-shinjuku',stops:[
      {time:'13:10',icon:'✈️',title:'נחיתה Narita',text:'ביקורת גבולות, מזוודות ויציאה לעיר.',place:'Narita Airport'},
      {time:'אחה״צ',icon:'🏨',title:'Check-in · JR Kyushu Hotel Blossom Shinjuku',text:'התארגנות ומנוחה קצרה לפני ערב ראשון בעיר.'},
      {time:'ערב',icon:'🏙️',title:'Shinjuku',text:'שיטוט ראשון, ארוחת ערב ואורות העיר.',place:'Shinjuku'},
      {time:'ערב',icon:'👓',title:'JINS Shinjuku',text:'בדיקת ראייה, בחירת מסגרת והזמנת משקפיים מוקדם בטיול.',place:'JINS Shinjuku'}
    ],route:D('Narita International Airport','Shinjuku Tokyo')},
    {date:'05/11',dow:'חמישי',city:'Tokyo',title:'Asakusa · Ueno · Akihabara',summary:'Kaminarimon → Nakamise → Sensō-ji → Ueno → Ameyoko → Akihabara',hotel:'hotel-jr-kyushu-shinjuku',evening:'asakusa',stops:[
      {time:'09:00',icon:'⛩️',title:'Kaminarimon',text:'שער הרעם והכניסה הסמלית לאסקוסה.',place:'Kaminarimon'},
      {time:'09:15',icon:'🛍️',title:'Nakamise',text:'רחוב שוק מסורתי עם דוכנים, מזכרות וממתקים.',place:'Nakamise'},
      {time:'09:30',icon:'🏯',title:'Sensō-ji',text:'המקדש הבודהיסטי המפורסם של Tokyo.',place:'Sensō-ji'},
      {time:'12:00',icon:'🌳',title:'Ueno',text:'מעבר לאזור Ueno והפסקת צהריים.',place:'Ueno'},
      {time:'13:00',icon:'🍜',title:'Ameyoko Market',text:'שוק רחוב תוסס — קניות, אוכל ואווירה מקומית.',place:'Ameyoko Market'},
      {time:'16:30',icon:'🎮',title:'Akihabara',text:'אלקטרוניקה, משחקים, אנימה ואווירת ערב.',place:'Akihabara'}
    ],route:D('Kaminarimon Tokyo','Akihabara Tokyo',['Nakamise Shopping Street Tokyo','Sensoji Tokyo','Ueno Tokyo','Ameyoko Tokyo'])},
    {date:'06/11',dow:'שישי',city:'Tokyo',title:'Meiji · Harajuku · Shibuya',summary:'Meiji Shrine → Harajuku → Omotesando → Shibuya → תצפית לפי הראות',hotel:'hotel-jr-kyushu-shinjuku',evening:'ueno',stops:[
      {time:'09:00',icon:'⛩️',title:'Meiji Shrine',text:'מקדש שינטו בתוך יער גדול בלב העיר.',place:'Meiji Shrine'},
      {time:'10:45',icon:'🏙️',title:'Harajuku',text:'Takeshita Street והרחובות מסביב.',place:'Harajuku'},
      {time:'12:30',icon:'☕',title:'Omotesando',text:'שדרה אלגנטית עם אדריכלות, בתי קפה וחנויות.',place:'Omotesando'},
      {time:'15:00',icon:'🚦',title:'Shibuya Crossing',text:'מעבר החצייה האייקוני של Tokyo.',place:'Shibuya Crossing'},
      {time:'אחה״צ / ערב',icon:'🌇',title:'תצפית על Tokyo · טרם הוחלט',text:'נחליט לפי הראות בין Tokyo Metropolitan Government Building, Roppongi Hills Tokyo City View או Shibuya Sky.'}
    ],route:D('Meiji Jingu Tokyo','Shibuya Scramble Crossing',['Takeshita Street Harajuku','Omotesando Tokyo'])},
    {date:'07/11',dow:'שבת',city:'Tokyo',title:'שווקים ומרכז Tokyo',summary:'Tsukiji → Ginza → Imperial Palace → Tokyo Station / Marunouchi',hotel:'hotel-jr-kyushu-shinjuku',evening:'shibuya',stops:[
      {time:'09:00',icon:'🛍️',title:'Tsukiji Outer Market',text:'שוק אוכל, סכינים, כלי מטבח, תה ודוכנים.',place:'Tsukiji Outer Market'},
      {time:'11:30',icon:'🏙️',title:'Ginza',text:'שיטוט באזור הקניות האלגנטי ובתי הכלבו.',place:'Ginza'},
      {time:'14:00',icon:'🏰',title:'Imperial Palace',text:'עצירה קצרה באזור החפיר והגנים.',place:'Imperial Palace'},
      {time:'16:30',icon:'🚉',title:'Tokyo Station / Marunouchi',text:'חזית התחנה והאזור האלגנטי לקראת ערב.',place:'Tokyo Station / Marunouchi'}
    ],route:D('Tsukiji Outer Market','Tokyo Station Marunouchi',['Ginza Tokyo','Tokyo Imperial Palace'])},
    {date:'08/11',dow:'ראשון',city:'Hakone / Fuji',title:'Tokyo → Hakone',summary:'Shinjuku → Odawara → רכב → Lake Ashi → Hakone Shrine',hotel:'hotel-hakone',stops:[
      {time:'בוקר',icon:'🚆',title:'Shinjuku → Odawara',text:'Romancecar אם השעה מתאימה ויש מקום; אחרת Odakyu רגילה. היעד נשאר Odawara ואיסוף הרכב.'},
      {time:'הגעה',icon:'🚗',title:'איסוף רכב · Odawara',text:'הרכב מיועד ליומיים באזור Hakone / Fuji.',place:'Odawara'},
      {time:'12:00',icon:'🏞️',title:'Lake Ashi',text:'אגם, נוף הררי ואפשרות לתצפית לכיוון Fuji.',place:'Lake Ashi'},
      {time:'14:00',icon:'⛩️',title:'Hakone Shrine',text:'מקדש בתוך היער ושער Torii על שפת האגם.',place:'Hakone Shrine'},
      {time:'אחה״צ',icon:'🗻',title:'המשך לפי מקום הלינה',text:'מקום הלינה באזור Hakone / Fuji עדיין לא נקבע.'}
    ],route:D('Odawara Station','Hakone Shrine',['Lake Ashi Hakone'])},
    {date:'09/11',dow:'שני',city:'Hakone / Fuji',title:'Hakone · Fuji',summary:'Owakudani → Ropeway → Kawaguchiko לפי הראות / Open-Air Museum',hotel:'hotel-hakone',stops:[
      {time:'09:00',icon:'🗻',title:'Owakudani',text:'עמק געשי פעיל ותצפית אפשרית ל-Fuji.',place:'Owakudani'},
      {time:'10:30',icon:'🚡',title:'Hakone Ropeway',text:'הרכבל מעל האזור הגעשי.',place:'Hakone Ropeway'},
      {time:'צהריים',icon:'🏞️',title:'Kawaguchiko',text:'אם הראות טובה — עדיפות לתצפיות Fuji באזור האגם.',place:'Kawaguchiko'},
      {time:'אופציה',icon:'🖼️',title:'Hakone Open-Air Museum',text:'פסלים ואמנות בנוף ההרים.',place:'Hakone Open-Air Museum'}
    ],route:D('Owakudani Hakone','Hakone Open-Air Museum',['Hakone Ropeway','Lake Kawaguchiko'])},
    {date:'10/11',dow:'שלישי',city:'Kyoto',title:'Hakone / Fuji → Kyoto',summary:'החזרת רכב → Odawara → Shinkansen → Kyoto → Gion',hotel:'hotel-daiwa-kyoto-shijo',evening:'gion',stops:[
      {time:'בוקר',icon:'🚗',title:'החזרת רכב · Odawara',text:'החזרת הרכב ליד התחנה לפני ה-Shinkansen.',place:'Odawara'},
      {time:'צהריים',icon:'🚄',title:'Shinkansen → Kyoto',text:'Odawara → Kyoto. את השעה הסופית נבחר קרוב יותר לטיול.'},
      {time:'אחה״צ',icon:'🏨',title:'Check-in · Daiwa Roynet Hotel Kyoto Shijo Karasuma',text:'המלון צמוד כמעט ל-Shijo Exit 5.'},
      {time:'ערב',icon:'🏮',title:'Gion',text:'ערב ראשון ברובע המסורתי של Kyoto.',place:'Gion'}
    ],route:D('Odawara Station','Gion Kyoto',['Kyoto Station'])},
    {date:'11/11',dow:'רביעי',city:'Kyoto',title:'מזרח Kyoto',summary:'Kiyomizu-dera → Sannenzaka / Ninenzaka → Higashiyama → Gion → Pontocho',hotel:'hotel-daiwa-kyoto-shijo',evening:'pontocho',stops:[
      {time:'09:00',icon:'🏯',title:'Kiyomizu-dera',text:'מקדש מפורסם על צלע ההר עם תצפית על העיר.',place:'Kiyomizu-dera'},
      {time:'10:30',icon:'🏘️',title:'Sannenzaka & Ninenzaka',text:'רחובות היסטוריים עם בתי עץ, חנויות ותה.',place:'Sannenzaka & Ninenzaka'},
      {time:'12:30',icon:'🏞️',title:'Higashiyama',text:'שיטוט באזור ההיסטורי.',place:'Higashiyama'},
      {time:'17:00',icon:'🏮',title:'Gion',text:'הרובע המסורתי יפה במיוחד לקראת ערב.',place:'Gion'},
      {time:'19:00',icon:'🍜',title:'Pontocho',text:'סמטת מסעדות ליד נהר Kamo.',place:'Pontocho'}
    ],route:D('Kiyomizu-dera Kyoto','Pontocho Kyoto',['Sannenzaka Kyoto','Higashiyama Kyoto','Gion Kyoto'])},
    {date:'12/11',dow:'חמישי',city:'Kyoto',title:'Fushimi Inari · Tofuku-ji · Sanjūsangen-dō · teamLab',summary:'Fushimi Inari → Tofuku-ji → Sanjūsangen-dō → Kyoto Station → teamLab Biovortex Kyoto',hotel:'hotel-daiwa-kyoto-shijo',stops:[
      {time:'09:00',icon:'⛩️',title:'Fushimi Inari Taisha',text:'בוקר בין אלפי שערי Torii. אין צורך לעלות לפסגה.',place:'Fushimi Inari'},
      {time:'11:30',icon:'🍁',title:'Tofuku-ji',text:'מקדש זן סמוך ל-Fushimi Inari, חזק במיוחד בעונת השלכת.',place:'Tofuku-ji'},
      {time:'14:00',icon:'🏯',title:'Sanjūsangen-dō',text:'אולם עץ ארוך ובו 1,001 פסלי Kannon.',place:'Sanjusangen-do'},
      {time:'16:00',icon:'🚉',title:'Kyoto Station + Higashi Hongan-ji',text:'סיום רגוע באזור התחנה; Higashi Hongan-ji רק אם נשאר זמן.',place:'Kyoto Station'},
      {time:'ערב',icon:'✨',title:'teamLab Biovortex Kyoto',text:'אחת מחוויות החובה של הטיול. להזמין כרטיסים מראש.',place:'teamLab Biovortex Kyoto',tag:'⭐ חובה · להזמין מראש'}
    ],route:D('Fushimi Inari Taisha','teamLab Biovortex Kyoto',['Tofuku-ji','Sanjusangendo','Kyoto Station'])},
    {date:'13/11',dow:'שישי',city:'Kyoto',title:'Arashiyama · Kinkaku-ji · Nishiki',summary:'Arashiyama / Okusaga → Tenryu-ji → Kinkaku-ji → 66tantan → Nishiki',hotel:'hotel-daiwa-kyoto-shijo',evening:'gion',stops:[
      {time:'09:00',icon:'🎋',title:'Arashiyama / Okusaga · חוויית במבוק',text:'אם ה-Bamboo Grove המרכזי סביר נעבור בו בקצרה; אם עמוס נמשיך ל-Giōji או Adashino.',place:'Arashiyama / Okusaga'},
      {time:'10:00',icon:'🏯',title:'Tenryu-ji',text:'מקדש וגן בסמוך לאזור הבמבוק.',place:'Tenryu-ji'},
      {time:'12:30',icon:'🏯',title:'Kinkaku-ji',text:'מקדש הזהב — אחד האתרים האייקוניים של Kyoto.',place:'Kinkaku-ji'},
      {time:'13:45',icon:'🍜',title:'66tantan (Rokuroku Tantan)',text:'Tantanmen קטן ומיוחד בגיון.',place:'66tantan'},
      {time:'15:30',icon:'🛍️',title:'Nishiki Market',text:'שוק מקורה עם אוכל, תה, תבלינים וכלי מטבח.',place:'Nishiki Market'}
    ],route:D('Arashiyama Kyoto','Nishiki Market Kyoto',['Tenryu-ji Kyoto','Kinkaku-ji Kyoto'])},
    {date:'14/11',dow:'שבת',city:'Kyoto · Nara · Osaka',title:'Kyoto → Nara → Osaka',summary:'מזוודות → AONIYOSHI → Nara → Osaka-Namba → Hozenji → Dotonbori',hotel:'hotel-royal-classic-osaka',stops:[
      {time:'בוקר',icon:'🧳',title:'Check-out + טיפול במזוודות',text:'נבדוק עם Daiwa אפשרות לשליחה באותו יום ל-Hotel Royal Classic Osaka. אם השירות לא מאושר בפועל, ניקח אותן איתנו/נשתמש בפתרון חלופי.'},
      {time:'10:55',icon:'🚆',title:'AONIYOSHI · Kyoto → Kintetsu-Nara',text:'רכבת התיירות המיוחדת. לפי לוח מרץ 2026: 10:55 → 11:31; נוודא שוב סמוך לפתיחת המכירה.',tag:'⭐ Twin Seats מומלצים לזוג'},
      {time:'11:35',icon:'🧳',title:'Coin Locker · Kintetsu-Nara',text:'אם נשאר איתנו trolley קטן, מכניסים אותו ללוקר ויוצאים לטייל בידיים חופשיות.'},
      {time:'12:00',icon:'🦌',title:'Nara Park',text:'Nara Park → Tōdai-ji → ארוחת צהריים. Naramachi רק אם נשאר זמן.',place:'Nara Park'},
      {time:'13:00',icon:'🏯',title:'Tōdai-ji',text:'אולם הבודהה הגדול והמקדש המרכזי של Nara.',place:'Tōdai-ji'},
      {time:'16:00–16:30',icon:'🚆',title:'Kintetsu-Nara → Osaka-Namba',text:'Kintetsu Express / Rapid Express רגילה וישירה, בערך 40 דקות.'},
      {time:'אחה״צ–ערב',icon:'🏨',title:'Check-in · Hotel Royal Classic Osaka',text:'המלון מחובר ישירות ל-Namba Exit 12.'},
      {time:'19:00',icon:'🏮',title:'Hozenji Temple + Hozenji Yokocho',text:'סמטת אבן, פנסים ומקדש קטן אחרי הצ׳ק-אין.',place:'Hozenji Yokocho'},
      {time:'19:45',icon:'🌃',title:'Dotonbori · ערב ראשון ב-Osaka',text:'טיול לאורך התעלה, שלטי הניאון ו-Glico Man.',place:'Dotonbori'},
      {time:'20:30',icon:'🍽️',title:'ארוחת ערב · Namba / Dotonbori',text:'לבחור לפי החשק — Okonomiyaki, Teppanyaki או אוכל יפני מבושל.',place:'Namba'}
    ],route:D('Kyoto Station','Osaka-Namba Station',['Kintetsu-Nara Station','Nara Park','Todaiji Nara'])},
    {date:'15/11',dow:'ראשון',city:'Osaka',title:'Osaka Highlights',summary:'Osaka Castle → Umeda → Shinsaibashi → Dotonbori',hotel:'hotel-royal-classic-osaka',evening:'umeda',stops:[
      {time:'09:00',icon:'🏰',title:'Osaka Castle',text:'הטירה והפארק.',place:'Osaka Castle'},
      {time:'12:30',icon:'🏙️',title:'Umeda',text:'מרכז מודרני, קניונים וגורדי שחקים.',place:'Umeda'},
      {time:'16:00',icon:'🛍️',title:'Shinsaibashi',text:'רחוב קניות מקורה שמתחבר ל-Dotonbori.',place:'Shinsaibashi'},
      {time:'ערב',icon:'🌃',title:'Dotonbori',text:'ערב נוסף לאוכל ושיטוט.',place:'Dotonbori'},
      {time:'אופציה',icon:'🍜',title:'Namba Ramen Ichiza',text:'מתחם ראמן ב-EDION Namba.',place:'Namba Ramen Ichiza'}
    ],route:D('Osaka Castle','Dotonbori Osaka',['Umeda Osaka','Shinsaibashi Osaka'])},
    {date:'16/11',dow:'שני',city:'Tokyo',title:'Osaka → Tokyo',summary:'Namba → Shin-Osaka → Shinkansen → Hotel Metropolitan → Nihonbashi → Tokyo Station → Marunouchi',hotel:'hotel-metropolitan-marunouchi',evening:'marunouchi',stops:[
      {time:'בוקר',icon:'🚄',title:'Osaka → Tokyo',text:'Namba → Shin-Osaka ב-Midosuji Line, ואז Shinkansen ל-Tokyo. אם הראות טובה, שווה לשבת בצד המתאים ל-Fuji.'},
      {time:'אחה״צ',icon:'🏨',title:'Check-in · Hotel Metropolitan Tokyo Marunouchi',text:'המלון ב-Sapia Tower, ליד Nihombashi Exit של Tokyo Station.'},
      {time:'15:00',icon:'🏮',title:'Nihonbashi · Tokyo של פעם',text:'Nihonbashi Bridge, רחובות ותיקים ו-COREDO Muromachi.',place:'Nihonbashi'},
      {time:'17:00',icon:'🛍️',title:'Tokyo Station · Gransta / Character Street',text:'מתנות, ממתקים והשלמות אחרונות בלי להתרחק מהמלון.',place:'Gransta / Character Street'},
      {time:'18:30',icon:'🌃',title:'KITTE + Marunouchi Naka-dori',text:'Rooftop Garden של KITTE והליכה קצרה ב-Marunouchi.',place:'KITTE Marunouchi'},
      {time:'אופציה',icon:'🛍️',title:'Ginza · רק אם נשאר משהו לקנות',text:'קרובה מאוד ל-Tokyo Station; רק אם יש קנייה ספציפית שלא הספקנו.',place:'Ginza'}
    ],route:D('Hotel Metropolitan Tokyo Marunouchi','Marunouchi Naka-dori Tokyo',['Nihonbashi Bridge Tokyo','Tokyo Station','KITTE Marunouchi'])},
    {date:'17/11',dow:'שלישי',city:'Tokyo',title:'יום אחרון וטיסה',summary:'בוקר חופשי → JINS / השלמות → Narita → טיסה',hotel:'hotel-metropolitan-marunouchi',stops:[
      {time:'בוקר',icon:'🏨',title:'Check-out · Hotel Metropolitan Tokyo Marunouchi',text:'Check-out והשארת מזוודות אם צריך עד היציאה ל-Narita.'},
      {time:'בוקר',icon:'☕',title:'בוקר חופשי',text:'לפי מה שנשאר ומה שמתחשק.'},
      {time:'אופציה',icon:'👓',title:'JINS Shinjuku',text:'איסוף משקפיים אם הוזמנו בתחילת הטיול.',place:'JINS Shinjuku'},
      {time:'אחה״צ',icon:'🚆',title:'יציאה ל-Narita',text:'להשאיר מרווח נדיב לנסיעה ולבידוק.',place:'Narita Airport'},
      {time:'21:30',icon:'✈️',title:'Narita → Dubai',text:'EK321 · Emirates · מושבים: Azriel 32K · Ayala 32J · Narita T2 → DXB T3.'}
    ],route:D('Hotel Metropolitan Tokyo Marunouchi','Narita International Airport')}
  ];

  const eveningWalks = {
    asakusa:{title:'Asakusa Lights',duration:'כ־3–3.5 שעות כולל נסיעות וארוחת ערב',out:'🚆 יציאה 19:30 מהמלון · Shinjuku → Kanda ב-JR Chuo Line, החלפה ל-Tokyo Metro Ginza Line → Asakusa. כ־30–35 דק׳.',back:'🚆 חזרה · Asakusa → Kanda ב-Ginza Line, החלפה ל-JR Chuo Line → Shinjuku. כ־30–35 דק׳.',stops:[['Sensō-ji','המקדש והאזור המואר בלילה.'],['Nakamise & side streets','סמטאות Asakusa באווירת ערב רגועה.'],['Sumida River Promenade','הליכה לאורך הנהר והגשרים.'],['Skytree view','סיום מול ה-Skytree המואר.']],dinner:'🍽️ ארוחת ערב: באזור Asakusa.',map:'https://www.google.com/maps/dir/?api=1&origin=Senso-ji+Tokyo&destination=Sumida+Park+Tokyo&waypoints=Nakamise+Shopping+Street+Tokyo&travelmode=walking',image:'images/evening-walks/asakusa.jpg'},
    ueno:{title:'Ueno → Akihabara',duration:'כ־3–3.5 שעות כולל נסיעות וארוחת ערב',out:'🚆 יציאה 19:30 מהמלון · Shinjuku → Ueno ב-JR Yamanote Line. כ־25 דק׳.',back:'🚆 חזרה · Akihabara → Shinjuku ב-JR Chuo-Sobu Line. כ־20 דק׳.',stops:[['Ueno Park','מתחילים בפארק Ueno כשהאזור כבר מואר.'],['Ameyoko Market','השוק והרחובות התוססים.'],['Okachimachi','הליכה דרומה ברחובות המקומיים.'],['Akihabara Electric Town','מסיימים בניאון, אלקטרוניקה ואנימה.']],dinner:'🍽️ ארוחת ערב: Ameyoko או Akihabara.',map:'https://www.google.com/maps/dir/?api=1&origin=Ueno+Park+Tokyo&destination=Akihabara+Electric+Town&waypoints=Ameyoko+Shopping+District+Tokyo%7COkachimachi+Station&travelmode=walking',image:'images/evening-walks/ueno-akihabara.jpg'},
    shibuya:{title:'Shibuya After Dark',duration:'כ־3 שעות כולל נסיעות וארוחת ערב',out:'🚆 יציאה 19:30 מהמלון · Shinjuku → Shibuya ב-JR Yamanote Line. כ־7 דק׳.',back:'🚆 חזרה · Shibuya → Shinjuku ב-JR Yamanote Line. כ־7 דק׳.',stops:[['Hachikō + Shibuya Crossing','פתיחה בכיכר ובמעבר החצייה כשהמסכים מוארים.'],['Center-gai','רחובות צפופים, אוכל ואנרגיה עירונית.'],['Nonbei Yokocho','סמטת ברים קטנה ליד פסי הרכבת.'],['Miyashita Park','סיום באזור המודרני.']],dinner:'🍽️ ארוחת ערב: Shibuya.',map:'https://www.google.com/maps/dir/?api=1&origin=Hachiko+Memorial+Statue&destination=Miyashita+Park&waypoints=Shibuya+Center-gai%7CNonbei+Yokocho&travelmode=walking',image:'images/evening-walks/shibuya.jpg'},
    gion:{title:'Gion · Yasaka · Shirakawa',duration:'כ־2.5–3 שעות כולל ארוחת ערב',out:'🚶 יציאה 19:30 מהמלון · Daiwa Roynet Hotel Kyoto Shijo Karasuma → Gion/Yasaka כ־20–25 דק׳ הליכה. אם לא רוצים ללכת: מונית/תחבורה קצרה עד Shijo-Kawaramachi/Gion.',back:'🚶 חזרה · Gion-Shijo / Shijo-Kawaramachi → Daiwa Roynet Hotel Kyoto Shijo Karasuma כ־20–25 דק׳ הליכה; אפשר גם מונית קצרה.',stops:[['Yasaka Shrine','פתיחה באזור המקדש והפנסים.'],['Hanamikoji','רחוב Gion המסורתי.'],['Gion Shirakawa','תעלה, גשרים ובתי machiya.'],['Shijo-Kawaramachi','סיום באזור מרכזי עם אוכל ותחבורה.']],dinner:'🍽️ ארוחת ערב: Gion או Shijo-Kawaramachi.',map:'https://www.google.com/maps/dir/?api=1&origin=Yasaka+Shrine+Kyoto&destination=Shijo+Kawaramachi+Kyoto&waypoints=Hanamikoji+Street%7CGion+Shirakawa&travelmode=walking'},
    pontocho:{title:'Pontocho · Kiyamachi · Kawaramachi',duration:'כ־2.5–3 שעות כולל ארוחת ערב',out:'🚶 יציאה 19:30 מהמלון · כ־20 דק׳ הליכה מ-Daiwa Roynet Hotel Kyoto Shijo Karasuma ל-Shijo-Kawaramachi/Pontocho; אין צורך ברכבת.',back:'🚶 חזרה · Kawaramachi → Daiwa Roynet Hotel Kyoto Shijo Karasuma כ־20 דק׳ הליכה לאורך Shijo-dori.',stops:[['Shijo Bridge','פתיחה על נהר Kamo.'],['Pontocho Alley','הסמטה הצרה והמפורסמת.'],['Kiyamachi','הליכה לאורך התעלה.'],['Shijo-Kawaramachi','סיום באזור הקניות והאוכל.']],dinner:'🍽️ ארוחת ערב: Pontocho / Kawaramachi.',map:'https://www.google.com/maps/dir/?api=1&origin=Shijo+Bridge+Kyoto&destination=Shijo+Kawaramachi+Kyoto&waypoints=Pontocho+Alley%7CKiyamachi+Street&travelmode=walking'},
    umeda:{title:'Umeda Night Lights',duration:'כ־3 שעות כולל נסיעות וארוחת ערב',out:'🚆 יציאה 19:30 מהמלון · Namba → Umeda ב-Osaka Metro Midosuji Line. כ־9 דק׳, ללא החלפה.',back:'🚆 חזרה · Umeda → Namba ב-Midosuji Line. כ־9 דק׳.',stops:[['Osaka Station','מתחם התחנה המודרני.'],['Grand Front Osaka','אזור עירוני מואר.'],['Umeda Sky Building','הבניין והרחבה.'],['Umeda','חזרה לכיוון התחנה והמסעדות.']],dinner:'🍽️ ארוחת ערב: Umeda / Grand Front.',map:'https://www.google.com/maps/dir/?api=1&origin=Osaka+Station&destination=Umeda+Osaka&waypoints=Grand+Front+Osaka%7CUmeda+Sky+Building&travelmode=walking'},
    marunouchi:{title:'Marunouchi → Ginza',duration:'כ־2.5–3 שעות כולל ארוחת ערב',out:'🚶 יציאה 19:30 מהמלון · Hotel Metropolitan Tokyo Marunouchi מחובר ל-Tokyo Station; כ־10–15 דק׳ הליכה לצד Marunouchi.',back:'🚶 חזרה · Ginza → Hotel Metropolitan Tokyo Marunouchi כ־15–20 דק׳ הליכה; אם עייפים, Marunouchi Line היא תחנה אחת.',stops:[['Tokyo Station · Marunouchi','חזית התחנה המוארת.'],['Marunouchi Lights','רחובות אלגנטיים ומוארים.'],['Imperial Palace Outer Gardens','קטע רגוע ליד הארמון והחפיר.'],['Ginza','סיום ברחובות המוארים.']],dinner:'🍽️ ארוחת ערב: Ginza.',map:'https://www.google.com/maps/dir/?api=1&origin=Tokyo+Station+Marunouchi&destination=Ginza+Tokyo&waypoints=Marunouchi+Naka-dori%7CImperial+Palace+Outer+Gardens+Tokyo&travelmode=walking',image:'images/evening-walks/marunouchi-ginza.jpg'}
  };

  const flights = {
    booking:'IG4JDF', cabin:'Economy Flex', passengers:'Azriel + Ayala', checked:'30 ק״ג לכל נוסע בכל מקטע', hand:'עד 7 ק״ג לנוסע',
    legs:[
      {date:'03/11',route:'TLV → DXB',time:'13:50 → 18:55',flight:'EK2269 / FZ1636',carrier:'Flydubai',terminals:'TLV T3 → DXB T3',duration:'כ־4:05 שעות'},
      {connection:'Dubai · 3:50'},
      {date:'03–04/11',route:'DXB → NRT',time:'22:45 → 13:10 (+1)',flight:'EK320',carrier:'Emirates',terminals:'DXB T3 → Narita T2',duration:'כ־9:25 שעות',seats:'Azriel 48K · Ayala 48J'},
      {date:'17–18/11',route:'NRT → DXB',time:'21:30 → 04:40 (+1)',flight:'EK321',carrier:'Emirates',terminals:'Narita T2 → DXB T3',duration:'כ־12:10 שעות',seats:'Azriel 32K · Ayala 32J'},
      {connection:'Dubai · 1:35'},
      {date:'18/11',route:'DXB → TLV',time:'06:15 → 08:05',flight:'EK2120 / FZ1073',carrier:'Flydubai',terminals:'DXB T3 → TLV T3',duration:'כ־3:50 שעות'}
    ]
  };

  const bookings = [
    {priority:'red',title:'teamLab Biovortex Kyoto',status:'טרם הוזמן',note:'12/11 בערב · חובה להזמין מראש',docKey:'teamlab-biovortex-kyoto'},
    {priority:'yellow',title:'AONIYOSHI · Kyoto → Nara',status:'טרם הוזמן',note:'14/11 · מתוכנן 10:55 → 11:31 · Twin Seats מומלצים',docKey:'aoniyoshi-kyoto-nara'},
    {priority:'yellow',title:'Shinkansen · Odawara → Kyoto',status:'שעה טרם נקבעה',note:'10/11 · נקבע קרוב יותר לטיול'},
    {priority:'yellow',title:'Shinkansen · Shin-Osaka → Tokyo',status:'שעה טרם נקבעה',note:'16/11 · לשקול צד Fuji לפי הראות'},
    {priority:'yellow',title:'Hakone / Fuji Hotel',status:'טרם הוזמן',note:'8–10/11'},
    {priority:'yellow',title:'רכב · Odawara',status:'טרם הוזמן',note:'איסוף 8/11 · החזרה 10/11'},
    {priority:'green',title:'תצפית Tokyo',status:'נחליט לפי הראות',note:'Tokyo Metropolitan Government / Roppongi Hills / Shibuya Sky'}
  ];

  const takeDefault = ['דרכונים','ארנק + כרטיסי אשראי','ביטוח נסיעות','תרופות קבועות','מטענים לטלפונים','Power Bank','מתאם חשמל ליפן','eSIM / פרטי חיבור','משקפי שמש','נעלי הליכה נוחות','מעיל קל / שכבות','מטרייה מתקפלת','תיק יום קטן','צילום/עותק של מסמכי הנסיעה'];
  const shoppingDefault = [
    {name:'משקפיים · JINS',note:'להזמין בתחילת הטיול כדי להשאיר זמן לאיסוף',map:G('JINS Shinjuku Tokyo')},
    {name:'נעלי ריצה',note:'Onitsuka Tiger / חנויות ספורט לפי התאמה',map:G('Onitsuka Tiger Omotesando Tokyo')},
    {name:'מכונת גילוח',note:'Bic Camera / Yodobashi Camera',map:G('Bic Camera Shinjuku Tokyo')},
    {name:'מכנסי ספורט',note:'Uniqlo / חנויות ספורט',map:G('Uniqlo Tokyo')}
  ];

  const expenseDefaults = [
    {name:'טיסות Emirates / Flydubai',status:'שולם',payment:'אשראי',currency:'USD',amount:3166,category:'✈️ טיסות',included:true,note:'Booking IG4JDF'},
    {name:'JR Kyushu Hotel Blossom Shinjuku',status:'מוזמן',payment:'אשראי',currency:'JPY',amount:311616,category:'🏨 לינה',included:true,note:'4–8/11'},
    {name:'מלון Hakone / Fuji',status:'הערכה',payment:'אשראי',currency:'USD',amount:600,category:'🏨 לינה',included:true,note:'8–10/11 · טרם הוזמן'},
    {name:'Daiwa Roynet Hotel Kyoto Shijo Karasuma',status:'מוזמן',payment:'אשראי',currency:'JPY',amount:116856,category:'🏨 לינה',included:true,note:'10–14/11'},
    {name:'Hotel Royal Classic Osaka',status:'מוזמן',payment:'אשראי',currency:'JPY',amount:109398,category:'🏨 לינה',included:true,note:'14–16/11 · סופי'},
    {name:'Hotel Metropolitan Tokyo Marunouchi',status:'שולם',payment:'אשראי',currency:'ILS',amount:676.61,category:'🏨 לינה',included:true,note:'16–17/11 · QXU287073'},
    {name:'ביטוח נסיעות (2×17)',status:'הערכה',payment:'אשראי',currency:'USD',amount:34,category:'🛡️ ביטוח',included:true,note:''},
    {name:'eSIM עזרי',status:'הערכה',payment:'אשראי',currency:'USD',amount:12,category:'📱 תקשורת',included:true,note:''},
    {name:'eSIM איילי',status:'הערכה',payment:'אשראי',currency:'USD',amount:12,category:'📱 תקשורת',included:true,note:''},
    {name:'השכרת רכב · Odawara',status:'הערכה',payment:'אשראי',currency:'USD',amount:150,category:'🚗 תחבורה',included:true,note:'8–10/11'},
    {name:'חניה בנתב״ג',status:'הערכה',payment:'אשראי',currency:'ILS',amount:800,category:'🚗 תחבורה',included:true,note:''}
  ];

  const trains = [
    ['4/11 · Narita → Shinjuku','Narita Express — ישיר ונוח עם מזוודות; או Keisei + המשך עירוני לפי זמן הנחיתה.'],
    ['5/11 · Asakusa → Ueno → Akihabara','Shinjuku → Asakusa: Marunouchi + Ginza בדרך כלל. Asakusa → Ueno: Ginza Line. Ueno → Akihabara: JR Yamanote / Keihin-Tohoku.'],
    ['6/11 · Meiji → Harajuku → Shibuya','JR Yamanote נוחה בין Harajuku, Shibuya ו-Shinjuku; Omotesando נגיש גם במטרו.'],
    ['7/11 · Tsukiji → Ginza → Tokyo Station','Hibiya/Ginza/Marunouchi לפי הקטע; חלק גדול מהיום נוח גם ברגל.'],
    ['8/11 · Shinjuku → Odawara','Romancecar — ישירה ונוחה עם מושב שמור; Odakyu רגילה — זולה וגמישה. בשתי האפשרויות מגיעים ל-Odawara.'],
    ['14/11 · Kyoto → Nara','AONIYOSHI מתוכננת 10:55 → 11:31; נוודא לוח שוב לפני המכירה.'],
    ['16/11 · Osaka → Tokyo','Namba → Shin-Osaka ב-Midosuji, ואז Shinkansen ל-Tokyo.'],
    ['17/11 · Tokyo → Narita','Narita Express או Keisei לפי נקודת היציאה והשעה; משאירים מרווח גדול לטיסה.']
  ];

  window.TRIP_DATA = {
    version:'10.0.0', title:'Japan Trip', year:2026, travelers:'עזרי ואיילי',
    tripStart:'2026-11-03', tripEnd:'2026-11-18', rateJpyIls:RATE_JPY_ILS,
    hotels, places, days, eveningWalks, flights, bookings, takeDefault, shoppingDefault, expenseDefaults, trains,
    maps:{search:G,directions:D}
  };
})();
