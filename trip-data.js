/* Japan Trip 2026 · canonical data · v10.3.15
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
    'Cross Shinjuku Vision – 3D Cat':{name:'Cross Shinjuku Vision · 3D Cat',icon:'🐈',city:'Tokyo · Shinjuku',cat:'אתרים',schedule:'04/11 · ערב',desc:'המסך המעוקל המפורסם מול East Exit של Shinjuku Station, שבו מופיע חתול הענק בתלת־ממד.',tip:'לעמוד ברחבה מול East Exit בזווית הנכונה ולחכות למחזור של החתול; זו עצירה קצרה וחינמית.',map:G('Cross Shinjuku Vision 3D Cat Tokyo')},
    'Godzilla Head':{name:'Godzilla Head · Shinjuku Toho Building',icon:'🦖',city:'Tokyo · Shinjuku',cat:'אתרים',schedule:'04/11 · ערב',desc:'ראש Godzilla האייקוני מעל Shinjuku Toho Building בלב Kabukicho, כמה דקות מהמלון ומהאזור של 3D Cat.',tip:'מספיק לעצור לצילום קצר בדרך בתוך Kabukicho; אין צורך להקדיש לזה זמן רב.',map:G('Godzilla Head Shinjuku Toho Building Tokyo')},
    'Hanazono Shrine':{name:'Hanazono Shrine',icon:'⛩️',city:'Tokyo · Shinjuku',cat:'מקדשים',optionalSchedule:'04/11 · ערב',desc:'מקדש שינטו היסטורי בקצה Kabukicho, קרוב ל-Golden Gai ולמסלול הערב בשינג׳וקו.',tip:'אופציה טובה אם נשאר כוח אחרי JINS והאורות של Kabukicho; לא חובה ביום הנחיתה.',map:G('Hanazono Shrine Shinjuku Tokyo')},
    'Shinjuku Golden Gai':{name:'Shinjuku Golden Gai',icon:'🏮',city:'Tokyo · Shinjuku',cat:'אתרים',optionalSchedule:'04/11 · ערב מאוחר',desc:'מקבץ סמטאות צפופות עם ברים זעירים ואווירת Tokyo ישנה בלב Shinjuku.',tip:'רוב הברים מתעוררים מאוחר; גם מעבר קצר בסמטאות מספיק. לא מצלמים אנשים או פנים של ברים בלי רשות.',map:G('Shinjuku Golden Gai Tokyo')},
    'Omoide Yokocho':{name:'Omoide Yokocho',icon:'🍢',city:'Tokyo · Shinjuku',cat:'אתרים',optionalSchedule:'04/11 · ארוחת ערב',desc:'סמטאות צרות ליד West Exit עם דוכני yakitori ומסעדות קטנות באווירה נוסטלגית.',tip:'אופציה טובה לארוחת ערב או מעבר קצר; אם עייפים מהטיסה אפשר לדלג בלי לפגוע במסלול.',map:G('Omoide Yokocho Shinjuku Tokyo')},
    'Shinjuku Gyoen':{name:'Shinjuku Gyoen National Garden',icon:'🌳',city:'Tokyo · Shinjuku',cat:'טבע',optionalSchedule:'06/11 · אופציה בשעות היום',desc:'גן לאומי גדול ושקט בלב Shinjuku, עם גנים יפניים ומרחבים ירוקים.',tip:'מתאים רק אם רוצים להחליף חלק מיום Meiji / Harajuku / Shibuya בחוויה רגועה יותר; לא מתאים למסלול הלילה.',map:G('Shinjuku Gyoen National Garden Tokyo')},
    'JINS Shinjuku':{name:'JINS Shinjuku',icon:'👓',city:'Tokyo',cat:'שווקים וקניות',schedule:'04/11 · ערב / איסוף 17/11 אם צריך',desc:'חנות משקפיים של JINS בשינג׳וקו. התוכנית היא לבצע בדיקת ראייה ולהזמין מוקדם בטיול כדי להשאיר זמן להכנה ולאיסוף.',tip:'להגיע עם המרשם הקיים אם יש, ולוודא בזמן ההזמנה מתי המשקפיים יהיו מוכנים.',map:G('JINS Shinjuku Tokyo')},
    'Don Quijote Shinjuku Kabukicho':{name:'Don Quijote Shinjuku Kabukicho',icon:'🛍️',city:'Tokyo · Shinjuku',cat:'שווקים וקניות',optionalSchedule:'04/11 · טיול ערב Shinjuku',storeOptional:true,desc:'סניף גדול של Don Quijote בלב Kabukicho עם קוסמטיקה, חטיפים, מזכרות, מוצרי יומיום, אלקטרוניקה קטנה והמון מציאות יפניות.',worth:'הוא יושב ממש על מסלול הערב שלנו ליד Godzilla, כך שאפשר להיכנס בלי לבנות נסיעה מיוחדת ולראות במקום אחד הרבה סוגי קניות.',tip:'להיכנס רק אם יש כוח אחרי הטיסה; החנות גדולה וקל להיתקע בה הרבה זמן. עדיף להגדיר מראש 20–30 דקות.',map:G('Don Quijote Shinjuku Kabukicho Tokyo')},
    'Kaminarimon':{name:'Kaminarimon',icon:'⛩️',city:'Tokyo',cat:'מקדשים',schedule:'05/11 · 09:00',desc:'שער הרעם האדום והכניסה האייקונית לאזור Sensō-ji ו-Nakamise באסקוסה.',tip:'בבוקר מוקדם האזור רגוע יותר; בהמשך היום הוא נעשה צפוף מאוד.',map:G('Kaminarimon Tokyo')},
    'Nakamise':{name:'Nakamise Shopping Street',icon:'🛍️',city:'Tokyo',cat:'שווקים וקניות',schedule:'05/11 · 09:15',desc:'רחוב שוק מסורתי המוביל מ-Kaminarimon ל-Sensō-ji, עם מזכרות, ממתקים ומוצרים יפניים.',tip:'לא חייבים לעצור בכל דוכן; עדיף לעבור בנחת ולשמור זמן למקדש.',map:G('Nakamise Shopping Street Tokyo')},
    'Sensō-ji':{name:'Sensō-ji',icon:'🏯',city:'Tokyo',cat:'מקדשים',schedule:'05/11 · 09:30',desc:'המקדש הבודהיסטי העתיק והמפורסם ביותר בטוקיו, בלב Asakusa.',tip:'שווה להמשיך גם לצדדים של המתחם ולא רק לצלם את האולם המרכזי.',map:G('Sensoji Tokyo')},
    'Gyoza no Ousama':{name:'Gyoza no Ousama · Asakusa',icon:'🥟',city:'Tokyo · Asakusa',cat:'מסעדות',optionalSchedule:'05/11 · על הדרך ב-Asakusa',desc:'מסעדה ותיקה שמתמחה בגיוזה ומנות סיניות פשוטות, קרובה לאזור Sensō-ji ו-Asakusa.',worth:'עצירת גיוזה קלה לשילוב בלי נסיעה מיוחדת — אפשר להיכנס רק לכמה גיוזות ולהמשיך במסלול.',tip:'לא להתייחס אליה כארוחת צהריים חובה; אם עוברים והיא פתוחה ואין תור ארוך, זו עצירת נשנוש מצוינת.',map:G('Gyoza no Ousama Asakusa Tokyo'),type:'Gyoza / Dumplings'},
    'Ueno':{name:'Ueno',icon:'🌳',city:'Tokyo',cat:'אתרים',schedule:'05/11 · 12:00',desc:'אזור של פארק, מוזיאונים, תחבורה ושוק Ameyoko. הוא מתאים למעבר נוח מאסקוסה לכיוון Akihabara.',tip:'אם היום מתארך, הפארק עצמו יכול להיות עצירה קצרה ולא יעד של שעות.',map:G('Ueno Tokyo')},
    'Ameyoko Market':{name:'Ameyoko Market',icon:'🍜',city:'Tokyo',cat:'שווקים וקניות',schedule:'05/11 · 13:00',desc:'שוק רחוב צפוף וססגוני עם בגדים, נעליים, קוסמטיקה, ממתקים, תבלינים ואוכל.',tip:'שווה כחוויה גם בלי לקנות; עדיף להשאיר ידיים פנויות לפני Akihabara.',map:G('Ameyoko Shopping District Tokyo')},
    'Chuka Chinman':{name:'Chuka Chinman · Okachimachi',icon:'🥟',city:'Tokyo · Ueno / Okachimachi',cat:'מסעדות',optionalSchedule:'05/11 · על הדרך Ueno → Akihabara',desc:'מסעדה סינית ותיקה ליד Okachimachi הידועה גם בגיוזה שלה, ממש על הרצף בין Ueno/Ameyoko ל-Akihabara.',worth:'כמעט בלי סטייה מהמסלול שלנו, ולכן אפשר לעצור לכמה גיוזות גם אם זו לא שעת ארוחה.',tip:'אם כבר עצרנו לגיוזה באסקוסה אפשר לדלג; המטרה היא הזדמנות בדרך, לא להספיק את כל המקומות.',map:G('Chuka Chinman Okachimachi Tokyo'),type:'Gyoza / Chinese'},
    'Akihabara':{name:'Akihabara',icon:'🎮',city:'Tokyo',cat:'אתרים',schedule:'05/11 · 16:30',desc:'רובע אלקטרוניקה, משחקים, אנימה ואספנות עם בניינים שלמים של חנויות וניאון.',tip:'לבחור 1–2 חנויות שמעניינות באמת ולא לנסות להיכנס לכל מקום.',map:G('Akihabara Electric Town Tokyo')},
    'Meiji Shrine':{name:'Meiji Shrine',icon:'⛩️',city:'Tokyo',cat:'מקדשים',schedule:'06/11 · 09:00',desc:'מקדש שינטו גדול בתוך יער בלב טוקיו, ליד Harajuku. המעבר מהעיר ליער הוא חלק מרכזי מהחוויה.',tip:'מתחילים מוקדם ואז ממשיכים ברגל ל-Harajuku ו-Omotesando.',map:G('Meiji Jingu Tokyo')},
    'Harajuku':{name:'Harajuku',icon:'🏙️',city:'Tokyo',cat:'אתרים',schedule:'06/11 · 10:45',desc:'אזור אופנה ותרבות צעירה סביב Takeshita Street והרחובות הצדדיים.',tip:'Takeshita יכולה להיות עמוסה; הרחובות הצדדיים נעימים יותר לשיטוט.',map:G('Takeshita Street Harajuku Tokyo')},
    'Harajuku Gyoza Lou':{name:'Harajuku Gyoza Lou',icon:'🥟',city:'Tokyo · Harajuku / Omotesando',cat:'מסעדות',optionalSchedule:'06/11 · על הדרך Harajuku → Omotesando',desc:'מקום מוכר עם תפריט ממוקד בגיוזה מטוגנת ומבושלת, באזור שבין Harajuku ל-Omotesando.',worth:'המיקום שלו מתאים בדיוק למסלול הרגלי שלנו, ולכן זו עצירת גיוזה טבעית בלי לתכנן סביב ארוחה.',tip:'אפשר להיכנס גם רק למנה קטנה ולהמשיך. אם יש תור משמעותי — מדלגים בלי לפגוע במסלול.',map:G('Harajuku Gyoza Lou Tokyo'),type:'Gyoza / Dumplings'},
    'Omotesando':{name:'Omotesando',icon:'☕',city:'Tokyo',cat:'שווקים וקניות',schedule:'06/11 · 12:30',desc:'שדרה אלגנטית עם אדריכלות, בתי קפה, חנויות ומותגים.',tip:'היא מחברת טבעית בין Harajuku לכיוון Shibuya, ולכן אין צורך בנסיעה נפרדת.',map:G('Omotesando Tokyo')},
    'Onitsuka Tiger Omotesando':{name:'Onitsuka Tiger Omotesando',icon:'👟',city:'Tokyo · Omotesando',cat:'שווקים וקניות',optionalSchedule:'06/11 · בדרך מ-Harajuku ל-Shibuya',storeOptional:true,desc:'חנות דגל באזור Omotesando של מותג הסניקרס היפני Onitsuka Tiger, עם דגמים קלאסיים ומהדורות מקומיות.',worth:'היא יושבת על ציר ההליכה שלנו ב-Omotesando ולכן זו הזדמנות טובה לראות נעלי ספורט יפניות בלי סטייה מיוחדת.',tip:'אם מחפשים מידה או דגם מסוים, לשאול מיד את הצוות ולא לבזבז זמן על כל הקומות.',map:G('Onitsuka Tiger Omotesando Tokyo')},
    'Shibuya LOFT':{name:'Shibuya LOFT',icon:'🛍️',city:'Tokyo · Shibuya',cat:'שווקים וקניות',optionalSchedule:'06/11 · סיור ערב Shibuya',storeOptional:true,desc:'כלבו יפני אהוב עם כלי כתיבה, קוסמטיקה, מוצרים לבית, גאדג׳טים ומתנות יפניות קטנות.',worth:'LOFT מצוין למתנות ודברים יפניים שימושיים שקשה לדעת מראש שרוצים, והוא משתלב ממש באזור Shibuya שבו אנחנו כבר נמצאים.',tip:'אם הזמן קצר, להתמקד בקומות של stationery, beauty ומתנות ולא לנסות לעבור על הכול.',map:G('Shibuya Loft Tokyo')},
    'Hands Shibuya':{name:'Hands Shibuya',icon:'🛠️',city:'Tokyo · Shibuya',cat:'שווקים וקניות',optionalSchedule:'06/11 · סיור ערב Shibuya',storeOptional:true,desc:'כלבו רב-קומות עם מוצרי בית, DIY, נסיעות, ארגון, כלי כתיבה, מטבח וגאדג׳טים שימושיים.',worth:'זו אחת החנויות הטובות למצוא בה מוצרים יפניים חכמים ושימושיים, ובגלל שהיא בשיבויה אפשר להחליט במקום אם להיכנס.',tip:'החנות גדולה מאוד; אם אין משהו ספציפי לחפש, להגביל את הביקור לכמה מחלקות שמעניינות אתכם.',map:G('Hands Shibuya Tokyo')},
    'Shibuya Crossing':{name:'Shibuya Crossing',icon:'🚦',city:'Tokyo',cat:'אתרים',schedule:'06/11 · 15:00',desc:'מעבר החצייה האייקוני של Shibuya, מוקף מסכים, תחנות ומרכזי קניות.',tip:'כדאי לראות פעם אחת מגובה הרחוב ופעם נוספת מנקודת תצפית ציבורית סמוכה.',map:G('Shibuya Scramble Crossing Tokyo')},
    'Tokyo Metropolitan Government Building Observatory':{name:'Tokyo Metropolitan Government Building Observatory',icon:'🌇',city:'Tokyo · Shinjuku',cat:'תצפיות',optionalSchedule:'06/11',desc:'תצפית גבוהה וחינמית יחסית בלב Shinjuku, חלופה גמישה ל-Shibuya Sky בלי לבנות את כל היום סביב הזמנה.',tip:'נעלה רק אם הראות טובה; אם מעונן אין סיבה לבזבז זמן.',map:G('Tokyo Metropolitan Government Building Observatory')},
    'Roppongi Hills Tokyo City View':{name:'Roppongi Hills Tokyo City View',icon:'🌇',city:'Tokyo · Roppongi',cat:'תצפיות',optionalSchedule:'06/11',desc:'תצפית על מרכז טוקיו עם זווית טובה במיוחד לכיוון Tokyo Tower.',tip:'נבחר בה רק אם Roppongi משתלב באותו ערב, לא כנסיעה מיוחדת לעוד תצפית.',map:G('Roppongi Hills Tokyo City View')},
    'Tsukiji Outer Market':{name:'Tsukiji Outer Market',icon:'🛍️',city:'Tokyo',cat:'שווקים וקניות',schedule:'07/11 · 09:00',desc:'שוק חיצוני צפוף עם אוכל, סכינים, כלי מטבח, תה ומוצרים יפניים. גם למי שפחות אוכל דג נא יש הרבה מה לראות.',tip:'מגיעים מוקדם ומסתובבים קודם לפני שמחליטים איפה לאכול או לקנות.',map:G('Tsukiji Outer Market Tokyo')},
    'Ginza':{name:'Ginza',icon:'🏙️',city:'Tokyo',cat:'שווקים וקניות',schedule:'07/11 · 11:30',desc:'רובע קניות ובילוי אלגנטי עם בתי כלבו, חנויות דגל, גלריות ומסעדות.',tip:'בסופי שבוע חלק מהשדרה המרכזית עשוי להפוך למדרחוב, מה שהופך את השיטוט לנעים יותר.',map:G('Ginza Tokyo')},
    'UNIQLO Ginza':{name:'UNIQLO Ginza',icon:'👕',city:'Tokyo · Ginza',cat:'שווקים וקניות',optionalSchedule:'07/11 · בזמן השיטוט ב-Ginza',storeOptional:true,desc:'חנות דגל גדולה של UNIQLO עם מגוון רחב של ביגוד בסיסי, AIRism, Heattech, מעילים ואביזרים.',worth:'אם רוצים לקנות UNIQLO ביפן, זה סניף גדול ונוח שנמצא בדיוק בתוך יום Ginza שלנו.',tip:'אם יש רשימת מידות או פריטים רצויים, להגיע אליהם ישירות; החנות גדולה ואפשר לבלות בה זמן רב.',map:G('UNIQLO Ginza Tokyo')},
    'GU Ginza':{name:'GU Ginza',icon:'👕',city:'Tokyo · Ginza',cat:'שווקים וקניות',optionalSchedule:'07/11 · מועדף בזמן Ginza · גיבוי 16/11 בערב',storeOptional:true,desc:'מותג האופנה האחות הזול יותר של UNIQLO, עם בגדים טרנדיים במחירים נגישים.',worth:'הוא מתאים במיוחד אם מחפשים בגדים יפניים זולים יותר ולא רק פריטי בסיס, ונמצא באותו אזור שכבר נטייל בו.',tip:'להיכנס רק אם הקולקציה מעניינת באותו רגע; אין סיבה להפוך אותו ליעד חובה.',map:G('GU Ginza Tokyo')},
    'MUJI Ginza':{name:'MUJI Ginza',icon:'🧺',city:'Tokyo · Ginza',cat:'שווקים וקניות',optionalSchedule:'07/11 · מועדף בזמן Ginza · גיבוי 16/11 בערב',storeOptional:true,desc:'חנות דגל גדולה של MUJI עם מוצרי בית, נסיעות, ארגון, כלי כתיבה, ביגוד ומזון בעיצוב מינימליסטי.',worth:'זה מקום מצוין למצוא ציוד נסיעות ומוצרים יפניים שימושיים, והוא משתלב באופן טבעי ביום Ginza.',tip:'שווה להסתכל במיוחד על מחלקות travel, organization וכלי כתיבה; לא חייבים לעבור על כל החנות.',map:G('MUJI Ginza Tokyo')},
    'Imperial Palace':{name:'Imperial Palace',icon:'🏰',city:'Tokyo',cat:'אתרים',schedule:'07/11 · 14:00',desc:'אזור הארמון הקיסרי על שטח טירת Edo לשעבר. החפירים, חומות האבן והמרחב הירוק נותנים ניגוד למרכז העסקי.',tip:'אם הזמן קצר מספיק לראות את אזור החפיר והגשר מבחוץ ולהמשיך ל-Marunouchi.',map:G('Imperial Palace Tokyo')},
    'Tokyo Station / Marunouchi':{name:'Tokyo Station / Marunouchi',icon:'🚉',city:'Tokyo',cat:'אתרים',schedule:'07/11 · 16:30',desc:'חזית הלבנים האדומות ההיסטורית של Tokyo Station והאזור העסקי האלגנטי של Marunouchi.',tip:'שעת ערב מתאימה במיוחד לחזית התחנה ול-Naka-dori.',map:G('Tokyo Station Marunouchi')},
    'Tokyo Gyoza Stand Oolong':{name:'Tokyo Gyoza Stand Oolong · Gransta',icon:'🥟',city:'Tokyo · Tokyo Station',cat:'מסעדות',optionalSchedule:'16/11 · בתוך Tokyo Station / Gransta',desc:'דוכן־מסעדה בתוך Gransta Tokyo שמתמקד בגיוזה בעבודת יד, כולל גיוזה מטוגנת ומבושלת.',worth:'אנחנו כבר בתוך Tokyo Station ביום 16/11, ולכן זו עצירת גיוזה בלי שום נסיעה או סטייה מיוחדת.',tip:'מתאים במיוחד לנשנוש קצר תוך כדי המעבר בתחנה — לא צריך לחכות לשעת צהריים או ערב.',map:G('Tokyo Gyoza Stand Oolong Gransta Tokyo Station'),type:'Gyoza / Dumplings'},
    'Pokemon Center Tokyo DX':{name:'Pokémon Center Tokyo DX',icon:'⚡',city:'Tokyo · Nihonbashi',cat:'שווקים וקניות',optionalSchedule:'16/11 · במהלך Nihonbashi / Tokyo Station',storeOptional:true,desc:'Pokémon Center גדול באזור Nihonbashi עם מוצרים רשמיים, בובות, קלפים, פריטי אספנות ומתנות ייחודיות.',worth:'גם בלי להיות מעריצי Pokémon זו חנות יפנית צבעונית וכיפית, והיא נמצאת קרוב למסלול Nihonbashi–Tokyo Station שלנו.',tip:'אם לא מחפשים פריט מסוים, מספיק ביקור קצר; החנות יכולה להיות עמוסה בשעות אחר הצהריים.',map:G('Pokemon Center Tokyo DX Nihonbashi')},
    'Odawara':{name:'Odawara',icon:'🚄',city:'Hakone / Fuji',cat:'אתרים',desc:'נקודת המעבר בין Tokyo לאזור Hakone. כאן מתוכננים איסוף והחזרת הרכב, ומכאן גם עולים ל-Shinkansen לקיוטו.',tip:'עדיף לרכז את כל פעולות הרכב ליד התחנה כדי לא להסתבך עם מזוודות.',map:G('Odawara Station')},
    'Lake Ashi':{name:'Lake Ashi',icon:'🏞️',city:'Hakone / Fuji',cat:'טבע',schedule:'08/11 · 12:00',desc:'אגם הררי שהוא אחד מסמלי Hakone. ביום בהיר אפשר לראות ממנו את Fuji, ועל שפתו נמצא Hakone Shrine.',tip:'אם הראות לפוג׳י טובה בבוקר, נותנים לה עדיפות לפני שהעננות מתפתחת.',map:G('Lake Ashi Hakone')},
    'Hakone Shrine':{name:'Hakone Shrine',icon:'⛩️',city:'Hakone / Fuji',cat:'מקדשים',schedule:'08/11 · 14:00',desc:'מקדש שינטו בתוך יער לצד Lake Ashi, עם שער Torii אדום ליד המים.',tip:'התור לצילום בשער שעל שפת האגם יכול להיות ארוך; המקדש והיער שווים גם בלי להמתין.',map:G('Hakone Shrine')},
    'Owakudani':{name:'Owakudani',icon:'🗻',city:'Hakone / Fuji',cat:'טבע',schedule:'09/11 · 09:00',desc:'עמק געשי פעיל עם אדים, ריח גופרית ונוף דרמטי. ביום בהיר יש לעיתים תצפית טובה ל-Fuji.',tip:'בודקים בבוקר שהגישה והרכבל פועלים בגלל רוח או מגבלות געשיות.',map:G('Owakudani Hakone')},
    'Hakone Ropeway':{name:'Hakone Ropeway',icon:'🚡',city:'Hakone / Fuji',cat:'אתרים',schedule:'09/11 · 10:30',desc:'רכבל מעל האזור הגעשי של Hakone, שהוא גם אמצעי תחבורה וגם אטרקציה נופית.',tip:'אם יש רוח חזקה, בודקים סטטוס לפני שמבנים את היום סביבו.',map:G('Hakone Ropeway')},
    'Kawaguchiko':{name:'Lake Kawaguchiko',icon:'🗻',city:'Hakone / Fuji',cat:'טבע',schedule:'09/11 · לפי הראות',desc:'אחד מחמשת אגמי Fuji ואחד המקומות הטובים לצפייה בהר מקרוב. בנובמבר יש גם שלכת.',tip:'נוסעים רק אם הראות מצדיקה את זה; ביום סגור עדיף להשקיע את הזמן ב-Hakone.',map:G('Lake Kawaguchiko Japan')},
    'Hakone Open-Air Museum':{name:'Hakone Open-Air Museum',icon:'🖼️',city:'Hakone / Fuji',cat:'מוזיאונים',schedule:'09/11 · אופציה',desc:'מוזיאון פתוח המשלב פסלים ואמנות עם נוף ההרים של Hakone.',tip:'חלופה טובה אם הראות לפוג׳י פחות מוצלחת או אם רוצים יום רגוע יותר.',map:G('Hakone Open-Air Museum')},
    'Gion':{name:'Gion',icon:'🏮',city:'Kyoto',cat:'אתרים',schedule:'10/11 + 11/11',desc:'הרובע המסורתי המפורסם של Kyoto, עם machiya, סמטאות, Hanamikoji ואזור Shirakawa.',tip:'הכי נעים לקראת ערב; שומרים על שקט וכבוד לתושבים ולא מצלמים אנשים באופן פולשני.',map:G('Gion Kyoto')},
    'Kyoto Gyoza enen Gion':{name:'Kyoto Gyoza enen · Gion',icon:'🥟',city:'Kyoto · Gion',cat:'מסעדות',optionalSchedule:'10/11 או 11/11 · על הדרך ב-Gion',desc:'מסעדת גיוזה ייעודית סמוך מאוד ל-Gion-Shijo, עם גיוזה בעבודת יד ווריאציות יצירתיות.',worth:'היא ממש באזור שבו אנחנו מסתובבים ב-Gion, ולכן אפשר לעצור לכמה גיוזות בלי להפוך אותה לארוחה מתוכננת.',tip:'אם היא פתוחה בזמן שאנחנו עוברים ואין תור חריג — נכנסים. לא צריך לקבוע את כל הערב סביבה.',map:G('Kyoto Gyoza enen Gion Honten'),type:'Gyoza / Dumplings'},
    'Gyoza Hohei Gion':{name:'Gyoza Hohei · Gion',icon:'🥟',city:'Kyoto · Gion',cat:'מסעדות',optionalSchedule:'10/11 או 11/11 · ערב Gion',desc:'מקום ותיק ומוכר שמתמחה בגיוזה בלב Gion, קרוב למסלול Hanamikoji ו-Gion-Shijo.',worth:'עוד אפשרות גיוזה חזקה ממש על מסלול הערב — בוחרים לפי מה שפתוח, התור והחשק באותו רגע.',tip:'לא צריך להספיק גם את enen וגם את Hohei. שניהם מסומנים כהזדמנויות בדרך.',map:G('Gyoza Hohei Gion Kyoto'),type:'Gyoza / Dumplings'},
    'Kiyomizu-dera':{name:'Kiyomizu-dera',icon:'🏯',city:'Kyoto',cat:'מקדשים',schedule:'11/11 · 09:00',desc:'מקדש מפורסם על צלע ההר עם מרפסת עץ ונוף לעיר.',tip:'להגיע מוקדם ואז לרדת ברגל דרך Sannenzaka ו-Ninenzaka.',map:G('Kiyomizu-dera Kyoto')},
    'Sannenzaka & Ninenzaka':{name:'Sannenzaka & Ninenzaka',icon:'🏘️',city:'Kyoto',cat:'אתרים',schedule:'11/11 · 10:30',desc:'רחובות היסטוריים עם בתי עץ, חנויות, תה ומדרגות בין Kiyomizu ל-Higashiyama.',tip:'השילוב הטוב הוא בירידה מהמקדש ולא כנסיעה נפרדת.',map:G('Sannenzaka Kyoto')},
    'Higashiyama':{name:'Higashiyama',icon:'🏞️',city:'Kyoto',cat:'אתרים',schedule:'11/11 · 12:30',desc:'אזור היסטורי במזרח Kyoto שמחבר מקדשים, סמטאות ורחובות מסורתיים.',tip:'זה יום שמתאים בעיקר להליכה; נעליים נוחות חשובות יותר מתכנון של רכבת לכל קטע.',map:G('Higashiyama Kyoto')},
    'Yasaka Pagoda':{name:'Yasaka Pagoda · Hōkan-ji',icon:'🗼',city:'Kyoto · Higashiyama',cat:'אתרים',optionalSchedule:'11/11 · בדרך בין Sannenzaka / Ninenzaka ל-Higashiyama',desc:'פגודה בת חמש קומות שמופיעה באחד המראות המזוהים ביותר עם Kyoto, בין הרחובות המסורתיים של Higashiyama.',worth:'זו עצירה קצרה כמעט בלי סטייה שנותנת את אחת מתמונות הרחוב היפות והקלאסיות ביותר של Kyoto.',tip:'לא צריך לבנות סביבה ביקור ארוך; מספיק לעבור בנקודת התצפית ברחוב ולצלם בדרך.',map:G('Yasaka Pagoda Hokanji Kyoto')},
    'Higashiyama Tea House':{name:'Tea House · Higashiyama / Gion',icon:'🍵',city:'Kyoto · Higashiyama / Gion',cat:'מסעדות',optionalSchedule:'11/11 · צהריים / אחה״צ',desc:'עצירת תה יפנית מסורתית באזור Higashiyama או Gion, עם matcha, wagashi וקינוחים יפניים באווירה של machiya.',worth:'זו דרך קלה להוסיף למסלול חוויית אוכל יפנית רגועה ולא רק עוד אתר, והיא משתלבת טבעית ביום ההליכה במזרח Kyoto.',tip:'לא לבחור מקום רק לפי תור ארוך; יש הרבה בתי תה טובים באזור. עדיף לעצור כשמתאים לקצב היום.',map:G('tea house Higashiyama Kyoto')},
    'Kyoto Kaiseki Dinner':{name:'Kaiseki Dinner · Gion / Pontocho',icon:'🍱',city:'Kyoto · Gion / Pontocho',cat:'מסעדות',optionalSchedule:'11/11 · ערב',desc:'ארוחת kaiseki היא ארוחה יפנית רב-שלבית עונתית, עם מנות קטנות, הגשה מוקפדת ודגש על חומרי גלם מקומיים.',worth:'זו אחת מחוויות האוכל היפניות המיוחדות ביותר ויכולה להפוך ערב אחד בקיוטו לחוויה בפני עצמה.',tip:'אם בוחרים Kaiseki, כדאי להזמין מראש ולבדוק שהתפריט מתאים להעדפה שלכם לאוכל מבושל ופחות דג נא.',map:G('kaiseki Gion Kyoto')},
    'Pontocho':{name:'Pontocho',icon:'🍜',city:'Kyoto',cat:'אתרים',schedule:'11/11 · 19:00',desc:'סמטת מסעדות צרה ליד נהר Kamo, יפה במיוחד בערב.',tip:'אפשר לאכול גם ברחובות הסמוכים אם המסעדות בסמטה עצמה מלאות.',map:G('Pontocho Alley Kyoto')},
    'Fushimi Inari':{name:'Fushimi Inari Taisha',icon:'⛩️',city:'Kyoto',cat:'מקדשים',schedule:'12/11 · 09:00',desc:'מקדש שינטו מפורסם בזכות אלפי שערי Torii אדומים לאורך שבילי הר Inari.',tip:'אין צורך להגיע לפסגה; נלך מספיק כדי לקבל את חוויית השערים והיער ואז נחזור.',map:G('Fushimi Inari Taisha Kyoto')},
    'Fushimi Sake District':{name:'Fushimi Sake District',icon:'🍶',city:'Kyoto · Fushimi',cat:'מסעדות',optionalSchedule:'12/11 · אחרי Fushimi Inari אם יש זמן',desc:'רובע מבשלות הסאקה של Fushimi, עם רחובות מסורתיים, תעלות, מבשלות וחנויות שבהן אפשר להכיר ולטעום סאקה מקומי.',worth:'זו חוויה שונה מהמקדשים של היום ומוסיפה אוכל ושתייה מקומיים באזור שמזוהה במיוחד עם ייצור סאקה.',tip:'זו סטייה מהמסלול הראשי, לכן נכנסים רק אם יש זמן. אם טועמים סאקה, לא חייבים לעשות טעימה גדולה כדי ליהנות מהאזור.',map:G('Fushimi Sake District Kyoto')},
    'Tofuku-ji':{name:'Tofuku-ji',icon:'🍁',city:'Kyoto',cat:'מקדשים',schedule:'12/11 · 11:30',desc:'מקדש זן גדול סמוך ל-Fushimi Inari, מפורסם בגשרים, גנים ושלכת.',tip:'באמצע נובמבר עלול להיות עמוס; נחליט במקום לפי התורים.',map:G('Tofuku-ji Kyoto')},
    'Sanjusangen-do':{name:'Sanjūsangen-dō',icon:'🏯',city:'Kyoto',cat:'מקדשים',schedule:'12/11 · 14:00',desc:'אולם עץ ארוך ובו 1,001 פסלי Kannon, אחד האתרים המרשימים והייחודיים בקיוטו.',tip:'הצילום בפנים מוגבל; מגיעים בשביל האולם והפסלים עצמם.',map:G('Sanjusangendo Kyoto')},
    'Kyoto Station':{name:'Kyoto Station',icon:'🚉',city:'Kyoto',cat:'אתרים',schedule:'12/11 · 16:00',desc:'תחנה מרכזית ענקית עם אדריכלות מודרנית, חנויות ומסעדות. מתאימה לעצירה לפני פעילות ערב.',tip:'אם נשאר זמן אפשר לשלב את Higashi Hongan-ji הסמוך.',map:G('Kyoto Station')},
    'Higashi Hongan-ji':{name:'Higashi Hongan-ji',icon:'🏯',city:'Kyoto',cat:'מקדשים',schedule:'12/11 · אופציה',desc:'מקדש בודהיסטי גדול במרחק הליכה קצר מ-Kyoto Station.',tip:'משלבים רק אם נשאר זמן לפני teamLab; לא צריך להעמיס.',map:G('Higashi Hongan-ji Kyoto')},
    'teamLab Biovortex Kyoto':{name:'teamLab Biovortex Kyoto',icon:'✨',city:'Kyoto',cat:'מוזיאונים',schedule:'12/11 · ערב',desc:'חוויית אמנות דיגיטלית immersive של teamLab בקיוטו, אחת מפעילויות החובה שסומנו לטיול.',tip:'להזמין מראש לשעת ערב מתאימה ולהשאיר מרווח מהפעילות הקודמת.',map:G('teamLab Biovortex Kyoto')},
    'Arashiyama / Okusaga':{name:'Arashiyama / Okusaga · חוויית במבוק',icon:'🎋',city:'Kyoto',cat:'טבע',schedule:'13/11 · 09:00',desc:'אזור טבע במערב Kyoto. אם Bamboo Grove המרכזי עמוס, ממשיכים ל-Okusaga, Giōji או Adashino לחוויה רגועה יותר.',tip:'לא לבזבז זמן על ניסיון לצלם את היער הראשי בלי אנשים; האלטרנטיבות השקטות עדיפות אם עמוס.',map:G('Arashiyama Kyoto')},
    'Tenryu-ji':{name:'Tenryu-ji',icon:'🏯',city:'Kyoto',cat:'מקדשים',schedule:'13/11 · בוקר',desc:'מקדש זן מרכזי ב-Arashiyama עם גן שמשתלב בנוף ההרים.',tip:'נוח לעבור דרך הגן ולהמשיך ממנו ישירות לכיוון אזור הבמבוק.',map:G('Tenryu-ji Kyoto')},
    'Togetsukyo Bridge':{name:'Togetsukyo Bridge',icon:'🌉',city:'Kyoto · Arashiyama',cat:'אתרים',optionalSchedule:'13/11 · בוקר',desc:'הגשר האייקוני של Arashiyama מעל נהר Katsura, עם הרים ונוף פתוח משני הצדדים.',worth:'הוא נמצא בלב אזור Arashiyama ולכן קל מאוד לשלב אותו, והנוף נותן הפסקה יפה מהבמבוק והמקדשים.',tip:'אם האזור עמוס, לא צריך להתעכב; מעבר קצר ותצפית מהגשר או מהטיילת מספיקים.',map:G('Togetsukyo Bridge Kyoto')},
    'Arashiyama Riverside Cafe':{name:'Riverside Café · Arashiyama',icon:'☕',city:'Kyoto · Arashiyama',cat:'מסעדות',optionalSchedule:'13/11 · בוקר / צהריים',desc:'עצירת קפה או קינוח ליד נהר Katsura באזור Arashiyama, עם אפשרות לשבת מול הנוף ולהוריד קצב בין האתרים.',worth:'אחרי הליכה בבמבוק ובמקדש, זו עצירה נעימה שנותנת גם חוויית אוכל וגם זמן ליהנות מהנוף במקום רק לעבור בו.',tip:'לבחור לפי מקום פנוי ונוף ולא להיתקע בתור ארוך; מספיק 30–45 דקות.',map:G('riverside cafe Arashiyama Kyoto')},
    'Ryoan-ji':{name:'Ryōan-ji',icon:'🪨',city:'Kyoto',cat:'מקדשים',optionalSchedule:'13/11 · בין Arashiyama ל-Kinkaku-ji',desc:'מקדש זן מפורסם בזכות גן הסלעים המינימליסטי שלו, בדרך הגיונית יחסית בין Arashiyama ל-Kinkaku-ji.',worth:'הוא מוסיף חוויה שונה לגמרי ממקדש הזהב ומהבמבוק: מקום שקט, מופשט ומאוד יפני באופי שלו.',tip:'להוסיף רק אם הקצב טוב; אם היום מתארך, Kinkaku-ji נשאר בעדיפות גבוהה יותר.',map:G('Ryoanji Kyoto')},
    'Kyoto Local Izakaya':{name:'Local Izakaya · Gion / Kawaramachi',icon:'🍢',city:'Kyoto · Gion / Kawaramachi',cat:'מסעדות',optionalSchedule:'13/11 · ערב',desc:'פאב-מסעדה יפני מקומי עם מנות קטנות לשיתוף, yakitori, ירקות, טופו, בשר ודגים מבושלים, באווירה לא פורמלית.',worth:'זו חוויית אוכל יומיומית ומקומית יותר מ-Kaiseki, ומתאימה לערב שבו רוצים פשוט לאכול טוב ולנסות כמה מנות.',tip:'אפשר לבחור מקום לפי החשק באותו ערב; עדיף izakaya עם תפריט מגוון כדי שיהיו מספיק אפשרויות מבושלות.',map:G('izakaya Gion Kawaramachi Kyoto')},
    'Kinkaku-ji':{name:'Kinkaku-ji · Golden Pavilion',icon:'🏯',city:'Kyoto',cat:'מקדשים',schedule:'13/11 · 12:30',desc:'מקדש הזהב, אחד הסמלים המפורסמים של Kyoto, סביב בריכה וגן מסודר.',tip:'הביקור קומפקטי; שעה בדרך כלל מספיקה.',map:G('Kinkaku-ji Kyoto')},
    'Nishiki Market':{name:'Nishiki Market',icon:'🛍️',city:'Kyoto',cat:'שווקים וקניות',schedule:'13/11 · 15:30',desc:'שוק מקורה ארוך עם אוכל, תה, תבלינים, ממתקים וכלי מטבח.',tip:'מתאים לשיטוט וטעימות; לא חייבים להפוך אותו לארוחה מלאה.',map:G('Nishiki Market Kyoto')},
    'JIJI GYOZA Nishiki':{name:'JIJI GYOZA · Nishiki',icon:'🥟',city:'Kyoto · Nishiki Market',cat:'מסעדות',optionalSchedule:'13/11 · תוך כדי Nishiki Market',desc:'מקום גיוזה בתוך אזור Nishiki Market, מתאים בדיוק לעצירה קטנה בזמן השיטוט בשוק.',worth:'זו כנראה עצירת הגיוזה הכי טבעית בקיוטו עבורנו — אנחנו עוברים ממש ליד ואין צורך לשנות את המסלול.',tip:'מעולה לנשנוש של כמה גיוזות גם באמצע אחר הצהריים, במיוחד אם לא רוצים ארוחה מלאה.',map:G('JIJI GYOZA Nishiki Kyoto'),type:'Gyoza / Street food'},
    'Giōji Temple':{name:'Giōji Temple',icon:'🌿',city:'Kyoto · Okusaga',cat:'טבע',optionalSchedule:'13/11',desc:'מקדש קטן ושקט עם גן טחב, במבוק ועצי מייפל באזור Okusaga.',tip:'האלטרנטיבה המועדפת אם Bamboo Grove המרכזי עמוס.',map:G('Gioji Temple Kyoto')},
    'Adashino Nenbutsu-ji':{name:'Adashino Nenbutsu-ji',icon:'🎋',city:'Kyoto · Okusaga',cat:'טבע',optionalSchedule:'13/11',desc:'מקדש באזור השקט של Okusaga עם אלפי פסלי אבן ושביל במבוק קטן.',tip:'מתאים אם יש זמן וכוח להמשיך מעט עמוק יותר לתוך Okusaga.',map:G('Adashino Nenbutsu-ji Kyoto')},
    '66tantan':{name:'66tantan (Rokuroku Tantan)',icon:'🍜',city:'Kyoto',cat:'מסעדות',optionalSchedule:'13/11 · ערב · Gion',desc:'Tantanmen קטן ומיוחד בגיון · 286-6 Gionmachi Kitagawa.',tip:'מקום קטן; אם יש תור חריג, לא לבזבז זמן רב על ההמתנה.',map:G('66tantan Rokuroku Tantan Kyoto'),rating:5.0,reviews:468,type:'Tantanmen / Dan Dan noodles'},
    'Nara Park':{name:'Nara Park',icon:'🦌',city:'Nara',cat:'טבע',schedule:'14/11 · סביב 12:00',desc:'פארק ירוק שבו מסתובבים איילי sika בחופשיות, בדרך לאתרים המרכזיים של Nara.',tip:'קונים shika-senbei רק כשבאמת רוצים להאכיל; האיילים מזהים את הקרקרים ומתקבצים מהר.',map:G('Nara Park')},
    'Tōdai-ji':{name:'Tōdai-ji',icon:'🏯',city:'Nara',cat:'מקדשים',schedule:'14/11 · צהריים',desc:'אחד המקדשים הבודהיסטיים החשובים ביפן, עם אולם Daibutsuden ופסל בודהה ברונזה ענק.',tip:'לא לוותר עליו בגלל האיילים; זה השיא התרבותי של יום Nara.',map:G('Todaiji Nara')},
    'Naramachi':{name:'Naramachi',icon:'☕',city:'Nara',cat:'אתרים',optionalSchedule:'14/11',desc:'רובע מסורתי עם בתי עץ, חנויות קטנות ובתי קפה.',tip:'אופציונלי בלבד; לא פוגעים בזמן של Tōdai-ji כדי להספיק אותו.',map:G('Naramachi Nara')},
    'Hozenji Yokocho':{name:'Hozenji Temple + Hozenji Yokocho',icon:'🏮',city:'Osaka',cat:'אתרים',schedule:'14/11 · 19:00',desc:'סמטת אבן קטנה ואטמוספרית ליד Namba עם מקדש Hozenji ופנסים.',tip:'מעבר קצר ומוצלח לפני Dotonbori; אין צורך להקדיש שעות.',map:G('Hozenji Yokocho Osaka')},
    'Dotonbori':{name:'Dotonbori',icon:'🌃',city:'Osaka',cat:'אתרים',schedule:'14/11 · 19:45 + 15/11 ערב',desc:'אזור הבילויים והאוכל המזוהה ביותר עם Osaka, סביב התעלה ושלטי הניאון, כולל Glico Running Man.',tip:'להגיע אחרי החשיכה. אם מסעדה אחת מלאה, יש המון חלופות ברחובות הסמוכים.',map:G('Dotonbori Osaka')},
    'Namba':{name:'Namba',icon:'🏙️',city:'Osaka',cat:'אתרים',schedule:'14/11 · ערב',desc:'מרכז התחבורה, הקניות והבילויים של דרום Osaka. Dotonbori, Kuromon ו-Shinsaibashi כולם בטווח הליכה.',tip:'אחרי שמגיעים ל-Namba עדיף לעבור ברגל בין האתרים ולא לחזור לרכבת לכל קפיצה קצרה.',map:G('Namba Osaka')},
    'Osaka Castle':{name:'Osaka Castle',icon:'🏰',city:'Osaka',cat:'אתרים',schedule:'15/11 · 09:00',desc:'טירה משוחזרת בתוך פארק גדול עם חפירים וגנים. אפשר ליהנות מהפארק ומהמבנה גם בלי להיכנס למוזיאון.',tip:'אם מוזיאון היסטורי פחות מעניין, נסתפק בחוץ ונחסוך את התור.',map:G('Osaka Castle')},
    'Umeda':{name:'Umeda',icon:'🏙️',city:'Osaka',cat:'אתרים',schedule:'15/11 · 12:30',desc:'מרכז מודרני של Osaka עם תחנות ענק, קניונים, גורדי שחקים ו-Grand Front.',tip:'מתאים לצהריים ולתצפית אם מזג האוויר טוב.',map:G('Umeda Osaka')},
    'Shinsaibashi':{name:'Shinsaibashi',icon:'🛍️',city:'Osaka',cat:'שווקים וקניות',schedule:'15/11 · 16:00',desc:'רחוב קניות מקורה ארוך שמוביל כמעט ישירות ל-Dotonbori.',tip:'המעבר ממנו ל-Dotonbori הוא טבעי ברגל, אין צורך בתחבורה.',map:G('Shinsaibashi Osaka')},
    'Kuromon Market':{name:'Kuromon Market',icon:'🍜',city:'Osaka',cat:'שווקים וקניות',optionalSchedule:'15/11',desc:'שוק מקורה באורך של כ-600 מטר עם דוכני אוכל, בשר, פירות, ממתקים, כלי בית וגם דגים ופירות ים.',tip:'עוברים קודם לאורך השוק ורק אחר כך מחליטים איפה לקנות או לאכול.',map:G('Kuromon Ichiba Market Osaka')},
    'Nihonbashi':{name:'Nihonbashi',icon:'🏮',city:'Tokyo',cat:'אתרים',schedule:'16/11 · 15:00',desc:'אזור המחבר Edo ישנה עם Tokyo המודרנית: Nihonbashi Bridge, רחובות ותיקים ו-COREDO Muromachi.',tip:'מתאים לשעתיים רגועות אחרי נסיעת ה-Shinkansen ולפני ערב Marunouchi.',map:G('Nihonbashi Bridge Tokyo')},
    'Gransta / Character Street':{name:'Tokyo Station · Gransta / Character Street',icon:'🛍️',city:'Tokyo',cat:'שווקים וקניות',schedule:'16/11 · 17:00',desc:'אזור קניות בתוך וסביב Tokyo Station עם מתנות, ממתקים, Character Street ו-Daimaru.',tip:'מקום מצוין להשלמות אחרונות בלי להתרחק מהמלון.',map:G('Tokyo Character Street')},
    'KITTE Marunouchi':{name:'KITTE + Marunouchi Naka-dori',icon:'🌃',city:'Tokyo',cat:'תצפיות',schedule:'16/11 · 18:30',desc:'Rooftop Garden של KITTE נותן מבט יפה לכיוון Tokyo Station, ומשם ממשיכים להליכה קצרה ב-Marunouchi Naka-dori.',tip:'אם התאורה העונתית כבר פעילה באמצע נובמבר, זה בונוס לערב האחרון.',map:G('KITTE Marunouchi Tokyo')},
    'Hamburg YOSHI':{name:'Hamburg YOSHI',icon:'🍽️',city:'Tokyo · Harajuku / Omotesando',cat:'מסעדות',optionalSchedule:'06/11',desc:'Hambāgu יפני — קציצות בשר עבות שמוגשות חמות עם אורז ותוספות. אופציה נוחה ליום Meiji, Harajuku, Omotesando ו-Shibuya.',tip:'מתאים כבחירת צהריים גמישה באותו יום; אם התור ארוך אפשר לבחור אחת מהחלופות באזור.',map:G('Hamburg YOSHI Harajuku Tokyo'),type:'Japanese Hamburg · Hambāgu'},
    'Shin-Okubo Koreatown':{name:'Shin-Okubo Koreatown',icon:'🇰🇷',city:'Tokyo · Shin-Okubo / Shinjuku',cat:'אתרים',optionalSchedule:'04/11',desc:'הרובע הקוריאני של Tokyo, עם מסעדות קוריאניות, street food, K-Beauty ו-K-Pop. מתאים לשילוב עם Shinjuku בלי להקדיש יום נפרד.',tip:'אפשר להגיע ברגל מאזור Shinjuku; משלבים רק אם נשאר כוח אחרי ההגעה וההתארגנות.',map:G('Shin-Okubo Koreatown Tokyo')},
    'Gyukatsu Motomura Shinjuku':{name:'Gyukatsu Motomura Shinjuku',icon:'🍽️',city:'Tokyo',cat:'מסעדות',optionalSchedule:'04/11',desc:'Gyukatsu בשינג׳וקו — בקר מצופה ומטוגן שמסיימים על אבן חמה.',tip:'לעיתים יש תורים; לבדוק סניף חלופי קרוב אם ההמתנה ארוכה.',map:G('Gyukatsu Motomura Shinjuku Main Branch'),rating:4.9,reviews:8231,type:'Gyukatsu · קאטסו בקר'},
    'AFURI Harajuku':{name:'AFURI Harajuku',icon:'🍽️',city:'Tokyo',cat:'מסעדות',optionalSchedule:'06/11',desc:'ראמן קליל המזוהה עם Yuzu Shio באזור Harajuku.',tip:'אפשרות טובה ביום Meiji / Harajuku אם רוצים ראמן פחות כבד.',map:G('AFURI Harajuku Tokyo'),rating:4.4,reviews:4980,type:'Ramen · Yuzu Shio'},
    'Katsukura Kyoto Porta':{name:'Katsukura Kyoto Porta',icon:'🍽️',city:'Kyoto',cat:'מסעדות',optionalSchedule:'12/11',desc:'Tonkatsu ליד Kyoto Station, נוח במיוחד ביום שעובר באזור התחנה.',tip:'מתאים אם רוצים ארוחה מבושלת ופשוטה יחסית.',map:G('Katsukura Kyoto Porta'),rating:4.4,reviews:1290,type:'Tonkatsu · קאטסו חזיר'},
    'Mizuno Dotonbori':{name:'Mizuno Dotonbori',icon:'🍽️',city:'Osaka',cat:'מסעדות',optionalSchedule:'14/11 או 15/11',desc:'מסעדת Okonomiyaki מוכרת באזור Dotonbori.',tip:'אם התור ארוך מאוד, יש הרבה חלופות טובות באזור.',map:G('Mizuno Dotonbori Osaka'),rating:3.8,reviews:3167,type:'Okonomiyaki'},
    '551 HORAI':{name:'551 HORAI Honten',icon:'🍽️',city:'Osaka',cat:'מסעדות',optionalSchedule:'14/11 או 15/11',desc:'הסניף הראשי של 551 HORAI, מפורסם ב-Butaman וב-Shumai.',tip:'טוב כנשנוש או ארוחה קלה באזור Namba.',map:G('551 HORAI Honten Osaka'),rating:4.2,reviews:4385,type:'Chinese · Butaman / Shumai'},
    'Namba Ramen Ichiza':{name:'Namba Ramen Ichiza',icon:'🍽️',city:'Osaka',cat:'מסעדות',schedule:'15/11 · אופציה לארוחה',desc:'מתחם ראמן בקומה 9 של EDION Namba עם כמה סגנונות ראמן במקום אחד.',tip:'נוח כשלא רוצים להחליט מראש על מסעדת ראמן אחת.',map:G('Namba Ramen Ichiza Osaka'),rating:3.9,reviews:1488,type:'Ramen food hall'}
  };

  const days = [
    {date:'03/11',dow:'שלישי',city:'ישראל → יפן',title:'עזרי ואיילי יוצאים לדרך ✈️',summary:'נתב״ג → Dubai → Tokyo · יום טיסה',stops:[
      {time:'13:50',icon:'✈️',title:'TLV → Dubai',text:'EK2269 / FZ1636 · Flydubai · Economy Flex · TLV Terminal 3 → DXB Terminal 3.'},
      {time:'18:55',icon:'🇦🇪',title:'נחיתה ב-Dubai',text:'קונקשן 3:50 שעות · אוכל, התרעננות והגעה רגועה לשער.'},
      {time:'22:45',icon:'✈️',title:'Dubai → Tokyo Narita',text:'EK320 · Emirates · מושבים: Azriel 48K · Ayala 48J · DXB T3 → Narita T2.',tag:'⭐ להיות בשער בזמן'},
      {time:'מחר 13:10',icon:'🇯🇵',title:'נחיתה Narita',text:'הנחיתה ביפן מופיעה בתחילת היום הבא.'}
    ],route:null},
    {date:'04/11',dow:'רביעי',city:'Tokyo',title:'נחיתה והתאקלמות',summary:'Narita → מלון → טיול ערב Shinjuku',hotel:'hotel-jr-kyushu-shinjuku',evening:'shinjuku',stops:[
      {time:'13:10',icon:'✈️',title:'נחיתה Narita',text:'ביקורת גבולות, מזוודות ויציאה לעיר.',place:'Narita Airport'}
    ],route:D('Narita International Airport','Shinjuku Prince Hotel Tokyo')},
    {date:'05/11',dow:'חמישי',city:'Tokyo',title:'Asakusa · Ueno · Akihabara',summary:'Kaminarimon → Nakamise → Sensō-ji → Ueno → Ameyoko → Akihabara',hotel:'hotel-jr-kyushu-shinjuku',evening:'asakusa',stops:[
      {time:'09:00',icon:'⛩️',title:'Kaminarimon',text:'שער הרעם והכניסה הסמלית לאסקוסה.',place:'Kaminarimon'},
      {time:'09:15',icon:'🛍️',title:'Nakamise',text:'רחוב שוק מסורתי עם דוכנים, מזכרות וממתקים.',place:'Nakamise'},
      {time:'09:30',icon:'🏯',title:'Sensō-ji',text:'המקדש הבודהיסטי המפורסם של Tokyo.',place:'Sensō-ji'},
      {time:'על הדרך',icon:'🥟',title:'Gyoza no Ousama · Asakusa',text:'עצירת גיוזה אופציונלית — גם אם זו לא שעת ארוחה.',place:'Gyoza no Ousama',optional:true,tag:'🥟 גיוזה על הדרך'},
      {time:'12:00',icon:'🌳',title:'Ueno',text:'מעבר לאזור Ueno והפסקת צהריים.',place:'Ueno'},
      {time:'13:00',icon:'🍜',title:'Ameyoko Market',text:'שוק רחוב תוסס — קניות, אוכל ואווירה מקומית.',place:'Ameyoko Market'},
      {time:'על הדרך',icon:'🥟',title:'Chuka Chinman · Okachimachi',text:'עוד הזדמנות לגיוזה בדרך ל-Akihabara.',place:'Chuka Chinman',optional:true,tag:'🥟 גיוזה על הדרך'},
      {time:'16:30',icon:'🎮',title:'Akihabara',text:'אלקטרוניקה, משחקים, אנימה ואווירת ערב.',place:'Akihabara'}
    ],route:D('Kaminarimon Tokyo','Akihabara Tokyo',['Nakamise Shopping Street Tokyo','Sensoji Tokyo','Gyoza no Ousama Asakusa Tokyo','Ueno Tokyo','Ameyoko Tokyo','Chuka Chinman Okachimachi Tokyo'])},
    {date:'06/11',dow:'שישי',city:'Tokyo',title:'Meiji · Harajuku · Shibuya',summary:'Meiji Shrine → Harajuku → Omotesando → Shibuya → תצפית לפי הראות → ערב Shibuya',hotel:'hotel-jr-kyushu-shinjuku',evening:'shibuya',stops:[
      {time:'09:00',icon:'⛩️',title:'Meiji Shrine',text:'מקדש שינטו בתוך יער גדול בלב העיר.',place:'Meiji Shrine'},
      {time:'10:45',icon:'🏙️',title:'Harajuku',text:'Takeshita Street והרחובות מסביב.',place:'Harajuku'},
      {time:'על הדרך',icon:'🥟',title:'Harajuku Gyoza Lou',text:'עצירת גיוזה אופציונלית בדרך ל-Omotesando.',place:'Harajuku Gyoza Lou',optional:true,tag:'🥟 גיוזה על הדרך'},
      {time:'12:30',icon:'☕',title:'Omotesando',text:'שדרה אלגנטית עם אדריכלות, בתי קפה וחנויות.',place:'Omotesando'},
      {time:'אופציה',icon:'👟',title:'Onitsuka Tiger Omotesando',text:'חנות יפנית על הציר שלנו ב-Omotesando.',place:'Onitsuka Tiger Omotesando',optional:true,tag:'🛍️ חנות אופציונלית'},
      {time:'15:00',icon:'🚦',title:'Shibuya Crossing',text:'מעבר החצייה האייקוני של Tokyo.',place:'Shibuya Crossing'},
      {time:'אחה״צ / ערב',icon:'🌇',title:'תצפית על Tokyo · בחירה באותו יום',text:'נחליט לפי הראות והחשק בין Tokyo Metropolitan Government Building, Roppongi Hills Tokyo City View או Shibuya Sky.',optional:true,tag:'לבחירה באותו יום'}
    ],route:D('Meiji Jingu Tokyo','Shibuya Scramble Crossing',['Takeshita Street Harajuku','Harajuku Gyoza Lou Tokyo','Omotesando Tokyo','Onitsuka Tiger Omotesando Tokyo'])},
    {date:'07/11',dow:'שבת',city:'Tokyo',title:'שווקים ומרכז Tokyo',summary:'Tsukiji → Ginza → Imperial Palace → Tokyo Station / Marunouchi',hotel:'hotel-jr-kyushu-shinjuku',stops:[
      {time:'09:00',icon:'🛍️',title:'Tsukiji Outer Market',text:'שוק אוכל, סכינים, כלי מטבח, תה ודוכנים.',place:'Tsukiji Outer Market'},
      {time:'11:30',icon:'🏙️',title:'Ginza',text:'שיטוט באזור הקניות האלגנטי ובתי הכלבו.',place:'Ginza'},
      {time:'אופציה',icon:'👕',title:'UNIQLO Ginza',text:'חנות דגל גדולה של UNIQLO.',place:'UNIQLO Ginza',optional:true,tag:'🛍️ חנות אופציונלית'},
      {time:'אופציה',icon:'👕',title:'GU Ginza',text:'אופנה יפנית זולה וטרנדית.',place:'GU Ginza',optional:true,tag:'🛍️ חנות אופציונלית'},
      {time:'אופציה',icon:'🧺',title:'MUJI Ginza',text:'חנות דגל של MUJI עם מוצרי נסיעות, בית וכלי כתיבה.',place:'MUJI Ginza',optional:true,tag:'🛍️ חנות אופציונלית'},
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
      {time:'אופציה A',icon:'🏞️',title:'Kawaguchiko',text:'אם הראות טובה — עדיפות לתצפיות Fuji באזור האגם.',place:'Kawaguchiko',optional:true,tag:'☀️ לבחור אם Fuji פתוח וברור'},
      {time:'אופציה B',icon:'🖼️',title:'Hakone Open-Air Museum',text:'חלופה טובה אם הראות פחות מוצלחת או אם רוצים להישאר באזור Hakone.',place:'Hakone Open-Air Museum',optional:true,tag:'☁️ חלופה ל-Kawaguchiko'}
    ],route:D('Owakudani Hakone','Hakone Open-Air Museum',['Hakone Ropeway','Lake Kawaguchiko'])},
    {date:'10/11',dow:'שלישי',city:'Kyoto',title:'Hakone / Fuji → Kyoto',summary:'החזרת רכב → Odawara → Shinkansen → Kyoto → Gion',hotel:'hotel-daiwa-kyoto-shijo',evening:'gion',stops:[
      {time:'בוקר',icon:'🚗',title:'החזרת רכב · Odawara',text:'החזרת הרכב ליד התחנה לפני ה-Shinkansen.',place:'Odawara'},
      {time:'צהריים',icon:'🚄',title:'Shinkansen → Kyoto',text:'Odawara → Kyoto. את השעה הסופית נבחר קרוב יותר לטיול.'},
      {time:'ערב',icon:'🏮',title:'Gion',text:'ערב ראשון ברובע המסורתי של Kyoto.',place:'Gion'}
    ],route:D('Odawara Station','Gion Kyoto',['Kyoto Station'])},
    {date:'11/11',dow:'רביעי',city:'Kyoto',title:'מזרח Kyoto',summary:'Kiyomizu-dera → Sannenzaka / Ninenzaka → Higashiyama → Gion → Pontocho',hotel:'hotel-daiwa-kyoto-shijo',evening:'pontocho',stops:[
      {time:'09:00',icon:'🏯',title:'Kiyomizu-dera',text:'מקדש מפורסם על צלע ההר עם תצפית על העיר.',place:'Kiyomizu-dera'},
      {time:'10:30',icon:'🏘️',title:'Sannenzaka & Ninenzaka',text:'רחובות היסטוריים עם בתי עץ, חנויות ותה.',place:'Sannenzaka & Ninenzaka'},
      {time:'אופציה',icon:'🗼',title:'Yasaka Pagoda · Hōkan-ji',text:'עצירה קצרה בדרך — אחד המראות הקלאסיים של Kyoto.',place:'Yasaka Pagoda',optional:true},
      {time:'אופציה',icon:'🍵',title:'Tea House · Higashiyama / Gion',text:'עצירת matcha, wagashi או קינוח יפני לפי הקצב והרעב.',place:'Higashiyama Tea House',optional:true},
      {time:'12:30',icon:'🏞️',title:'Higashiyama',text:'שיטוט באזור ההיסטורי.',place:'Higashiyama'},
      {time:'17:00',icon:'🏮',title:'Gion',text:'הרובע המסורתי יפה במיוחד לקראת ערב.',place:'Gion'},
      {time:'אם פתוח בדרך',icon:'🥟',title:'Kyoto Gyoza enen · Gion',text:'עצירת גיוזה אופציונלית ליד Gion-Shijo.',place:'Kyoto Gyoza enen Gion',optional:true,tag:'🥟 גיוזה על הדרך'},
      {time:'אם פתוח בדרך',icon:'🥟',title:'Gyoza Hohei · Gion',text:'חלופת גיוזה נוספת באזור — לא צריך להספיק את שתיהן.',place:'Gyoza Hohei Gion',optional:true,tag:'🥟 גיוזה על הדרך'},
      {time:'19:00',icon:'🍜',title:'Pontocho',text:'סמטת מסעדות ליד נהר Kamo.',place:'Pontocho'},
      {time:'אופציה בערב',icon:'🍱',title:'Kaiseki Dinner · Gion / Pontocho',text:'ארוחה יפנית רב-שלבית וחגיגית אם נרצה ערב אוכל מיוחד.',place:'Kyoto Kaiseki Dinner',optional:true}
    ],route:D('Kiyomizu-dera Kyoto','Pontocho Kyoto',['Sannenzaka Kyoto','Yasaka Pagoda Hokanji Kyoto','Higashiyama Kyoto','Gion Kyoto','Kyoto Gyoza enen Gion Honten','Gyoza Hohei Gion Kyoto'])},
    {date:'12/11',dow:'חמישי',city:'Kyoto',title:'Fushimi Inari · Tofuku-ji · Sanjūsangen-dō · teamLab',summary:'Fushimi Inari → Tofuku-ji → Sanjūsangen-dō → Kyoto Station → teamLab Biovortex Kyoto',hotel:'hotel-daiwa-kyoto-shijo',stops:[
      {time:'09:00',icon:'⛩️',title:'Fushimi Inari Taisha',text:'בוקר בין אלפי שערי Torii. אין צורך לעלות לפסגה.',place:'Fushimi Inari'},
      {time:'אופציה',icon:'🍶',title:'Fushimi Sake District',text:'אם יש זמן ורוצים חוויית אוכל/שתייה מקומית — מבשלות, תעלות וטעימות סאקה. דורש סטייה קצרה מהמסלול הראשי.',place:'Fushimi Sake District',optional:true},
      {time:'11:30',icon:'🍁',title:'Tofuku-ji',text:'מקדש זן סמוך ל-Fushimi Inari, חזק במיוחד בעונת השלכת.',place:'Tofuku-ji'},
      {time:'14:00',icon:'🏯',title:'Sanjūsangen-dō',text:'אולם עץ ארוך ובו 1,001 פסלי Kannon.',place:'Sanjusangen-do'},
      {time:'16:00',icon:'🚉',title:'Kyoto Station + Higashi Hongan-ji',text:'סיום רגוע באזור התחנה; Higashi Hongan-ji רק אם נשאר זמן.',place:'Kyoto Station'},
      {time:'ערב',icon:'✨',title:'teamLab Biovortex Kyoto',text:'אחת מחוויות החובה של הטיול. להזמין כרטיסים מראש.',place:'teamLab Biovortex Kyoto',tag:'⭐ חובה · להזמין מראש'}
    ],route:D('Fushimi Inari Taisha','teamLab Biovortex Kyoto',['Tofuku-ji','Sanjusangendo','Kyoto Station'])},
    {date:'13/11',dow:'שישי',city:'Kyoto',title:'Arashiyama · Kinkaku-ji · Nishiki',summary:'Arashiyama / Okusaga → Tenryu-ji → Kinkaku-ji → Nishiki → ערב Gion',hotel:'hotel-daiwa-kyoto-shijo',evening:'gionFood',stops:[
      {time:'09:00',icon:'🎋',title:'Arashiyama / Okusaga · חוויית במבוק',text:'אם ה-Bamboo Grove המרכזי סביר נעבור בו בקצרה; אם עמוס נמשיך ל-Giōji או Adashino.',place:'Arashiyama / Okusaga'},
      {time:'10:00',icon:'🏯',title:'Tenryu-ji',text:'מקדש וגן בסמוך לאזור הבמבוק.',place:'Tenryu-ji'},
      {time:'אופציה',icon:'🌉',title:'Togetsukyo Bridge',text:'הגשר והטיילת על נהר Katsura — קל לשלב בלי להתחייב לביקור ארוך.',place:'Togetsukyo Bridge',optional:true},
      {time:'אופציה',icon:'☕',title:'Riverside Café · Arashiyama',text:'קפה או קינוח מול הנהר אם מתחשק לעצור וליהנות מהאזור.',place:'Arashiyama Riverside Cafe',optional:true},
      {time:'אופציה',icon:'🪨',title:'Ryōan-ji',text:'גן הסלעים המפורסם; מתאים אם הקצב טוב בדרך מ-Arashiyama ל-Kinkaku-ji.',place:'Ryoan-ji',optional:true},
      {time:'12:30',icon:'🏯',title:'Kinkaku-ji',text:'מקדש הזהב — אחד האתרים האייקוניים של Kyoto.',place:'Kinkaku-ji'},
      {time:'15:30',icon:'🛍️',title:'Nishiki Market',text:'שוק מקורה עם אוכל, תה, תבלינים וכלי מטבח.',place:'Nishiki Market'},
      {time:'על הדרך',icon:'🥟',title:'JIJI GYOZA · Nishiki',text:'כמה גיוזות תוך כדי השיטוט בשוק — לא חייב להיות בזמן ארוחה.',place:'JIJI GYOZA Nishiki',optional:true,tag:'🥟 גיוזה על הדרך'}
    ],route:D('Arashiyama Kyoto','JIJI GYOZA Nishiki Kyoto',['Tenryu-ji Kyoto','Kinkaku-ji Kyoto','Nishiki Market Kyoto'])},
    {date:'14/11',dow:'שבת',city:'Kyoto · Nara · Osaka',title:'Kyoto → Nara → Osaka',summary:'מזוודות → AONIYOSHI → Nara → Osaka-Namba → Hozenji → Dotonbori',hotel:'hotel-royal-classic-osaka',stops:[
      {time:'בוקר',icon:'🧳',title:'Check-out + טיפול במזוודות',text:'נבדוק עם Daiwa אפשרות לשליחה באותו יום ל-Hotel Royal Classic Osaka. אם השירות לא מאושר בפועל, ניקח אותן איתנו/נשתמש בפתרון חלופי.'},
      {time:'10:55',icon:'🚆',title:'AONIYOSHI · Kyoto → Kintetsu-Nara',text:'רכבת התיירות המיוחדת. לפי לוח מרץ 2026: 10:55 → 11:31; נוודא שוב סמוך לפתיחת המכירה.',tag:'⭐ Twin Seats מומלצים לזוג'},
      {time:'אם צריך',icon:'🧳',title:'Coin Locker · Kintetsu-Nara · גיבוי',text:'רק אם המזוודות נשארות איתנו: מכניסים trolley ללוקר ויוצאים לטייל בידיים חופשיות.',optional:true,tag:'Fallback בלבד'},
      {time:'12:00',icon:'🦌',title:'Nara Park',text:'Nara Park → Tōdai-ji → ארוחת צהריים. Naramachi רק אם נשאר זמן.',place:'Nara Park'},
      {time:'13:00',icon:'🏯',title:'Tōdai-ji',text:'אולם הבודהה הגדול והמקדש המרכזי של Nara.',place:'Tōdai-ji'},
      {time:'16:00–16:30',icon:'🚆',title:'Kintetsu-Nara → Osaka-Namba',text:'Kintetsu Express / Rapid Express רגילה וישירה, בערך 40 דקות.'},
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
      {time:'15:00',icon:'🏮',title:'Nihonbashi · Tokyo של פעם',text:'Nihonbashi Bridge, רחובות ותיקים ו-COREDO Muromachi.',place:'Nihonbashi'},
      {time:'אופציה',icon:'⚡',title:'Pokémon Center Tokyo DX',text:'חנות Pokémon גדולה באזור Nihonbashi, קרובה למסלול שלנו.',place:'Pokemon Center Tokyo DX',optional:true,tag:'🛍️ חנות אופציונלית'},
      {time:'17:00',icon:'🛍️',title:'Tokyo Station · Gransta / Character Street',text:'מתנות, ממתקים והשלמות אחרונות בלי להתרחק מהמלון.',place:'Gransta / Character Street'},
      {time:'על הדרך',icon:'🥟',title:'Tokyo Gyoza Stand Oolong',text:'גיוזה בתוך Gransta — עצירה קצרה בזמן שעוברים בתחנה.',place:'Tokyo Gyoza Stand Oolong',optional:true,tag:'🥟 גיוזה על הדרך'},
      {time:'18:30',icon:'🌃',title:'KITTE + Marunouchi Naka-dori',text:'Rooftop Garden של KITTE והליכה קצרה ב-Marunouchi.',place:'KITTE Marunouchi'},
      {time:'אופציה',icon:'🛍️',title:'Ginza · רק אם נשאר משהו לקנות',text:'קרובה מאוד ל-Tokyo Station; רק אם יש קנייה ספציפית שלא הספקנו.',place:'Ginza'}
    ],route:D('Hotel Metropolitan Tokyo Marunouchi','Marunouchi Naka-dori Tokyo',['Nihonbashi Bridge Tokyo','Pokemon Center Tokyo DX Nihonbashi','Tokyo Station','Tokyo Gyoza Stand Oolong Gransta Tokyo Station','KITTE Marunouchi'])},
    {date:'17/11',dow:'שלישי',city:'Tokyo',title:'יום אחרון וטיסה',summary:'בוקר חופשי → JINS / השלמות → Narita → טיסה',hotel:'hotel-metropolitan-marunouchi',stops:[
      {time:'בוקר',icon:'🏨',title:'Check-out · Hotel Metropolitan Tokyo Marunouchi',text:'Check-out והשארת מזוודות אם צריך עד היציאה ל-Narita.'},
      {time:'בוקר',icon:'☕',title:'בוקר חופשי',text:'לפי מה שנשאר ומה שמתחשק.'},
      {time:'גיבוי',icon:'👓',title:'JINS Shinjuku · איסוף רק אם לא הושלם קודם',text:'עדיף לאסוף לפני שעוזבים את Shinjuku ב־8/11 אם המשקפיים מוכנים. חוזרים לכאן ב־17/11 רק אם עדיין צריך.',place:'JINS Shinjuku',optional:true,tag:'גיבוי ליום האחרון'},
      {time:'אחה״צ',icon:'🚆',title:'יציאה ל-Narita',text:'להשאיר מרווח נדיב לנסיעה ולבידוק.',place:'Narita Airport'},
      {time:'21:30',icon:'✈️',title:'Narita → Dubai',text:'EK321 · Emirates · מושבים: Azriel 32K · Ayala 32J · Narita T2 → DXB T3.'}
    ],route:D('Hotel Metropolitan Tokyo Marunouchi','Narita International Airport')}
  ];

  const eveningWalks = {
    shinjuku:{title:'Shinjuku First Night',start:'17:30',primary:true,duration:'כ־2.5–3.5 שעות, גמיש לפי העייפות אחרי הטיסה',out:'🚶 מתחילים מהמלון / JINS באזור Shinjuku. כל המסלול ברובו בהליכה קצרה בין נקודות מרכזיות בשכונה.',back:'🚶 מסיימים באזור Omoide Yokocho / Shinjuku Station וחוזרים למלון ברגל.',stops:[['JINS Shinjuku','בדיקת ראייה והזמנת משקפיים בתחילת הטיול.'],['Cross Shinjuku Vision · 3D Cat','עצירת חובה קצרה מול המסך המעוקל ליד East Exit.'],['Godzilla Head · Kabukicho','צילום קצר בדרך בתוך Kabukicho.'],['Don Quijote Shinjuku Kabukicho','🛍️ חנות אופציונלית — נכנסים רק אם יש כוח ורוצים קניות.'],['Hanazono Shrine','אופציונלי — מקדש קטן ונעים אם נשאר כוח.'],['Golden Gai','אופציונלי — מעבר קצר בסמטאות והאווירה.'],['Omoide Yokocho','אופציונלי — מתאים במיוחד לארוחת ערב או לסיום הערב.']],dinner:'🍽️ ארוחת ערב: Omoide Yokocho / Kabukicho / ליד המלון — לפי החשק והעייפות.',map:'https://www.google.com/maps/dir/?api=1&origin=JINS+Shinjuku+Tokyo&destination=Omoide+Yokocho+Tokyo&waypoints=Cross+Shinjuku+Vision+Tokyo%7CGodzilla+Head+Shinjuku%7CDon+Quijote+Shinjuku+Kabukicho%7CHanazono+Shrine+Tokyo%7CShinjuku+Golden+Gai+Tokyo&travelmode=walking'},
    asakusa:{title:'Asakusa Lights',duration:'כ־3–3.5 שעות כולל נסיעות וארוחת ערב',out:'🚆 יציאה 19:30 מהמלון · Shinjuku → Kanda ב-JR Chuo Line, החלפה ל-Tokyo Metro Ginza Line → Asakusa. כ־30–35 דק׳.',back:'🚆 חזרה · Asakusa → Kanda ב-Ginza Line, החלפה ל-JR Chuo Line → Shinjuku. כ־30–35 דק׳.',stops:[['Sensō-ji','המקדש והאזור המואר בלילה.'],['Nakamise & side streets','סמטאות Asakusa באווירת ערב רגועה.'],['Sumida River Promenade','הליכה לאורך הנהר והגשרים.'],['Skytree view','סיום מול ה-Skytree המואר.']],dinner:'🍽️ ארוחת ערב: באזור Asakusa.',map:'https://www.google.com/maps/dir/?api=1&origin=Senso-ji+Tokyo&destination=Sumida+Park+Tokyo&waypoints=Nakamise+Shopping+Street+Tokyo&travelmode=walking',image:'images/evening-walks/asakusa.jpg'},
    ueno:{title:'Ueno → Akihabara',duration:'כ־3–3.5 שעות כולל נסיעות וארוחת ערב',out:'🚆 יציאה 19:30 מהמלון · Shinjuku → Ueno ב-JR Yamanote Line. כ־25 דק׳.',back:'🚆 חזרה · Akihabara → Shinjuku ב-JR Chuo-Sobu Line. כ־20 דק׳.',stops:[['Ueno Park','מתחילים בפארק Ueno כשהאזור כבר מואר.'],['Ameyoko Market','השוק והרחובות התוססים.'],['Okachimachi','הליכה דרומה ברחובות המקומיים.'],['Akihabara Electric Town','מסיימים בניאון, אלקטרוניקה ואנימה.']],dinner:'🍽️ ארוחת ערב: Ameyoko או Akihabara.',map:'https://www.google.com/maps/dir/?api=1&origin=Ueno+Park+Tokyo&destination=Akihabara+Electric+Town&waypoints=Ameyoko+Shopping+District+Tokyo%7COkachimachi+Station&travelmode=walking',image:'images/evening-walks/ueno-akihabara.jpg'},
    shibuya:{title:'Shibuya After Dark',start:'18:30',duration:'כ־2.5–3 שעות כולל קניות אופציונליות וארוחת ערב',out:'🚶 ממשיכים ישירות מהיום ב-Shibuya — אין צורך לחזור למלון ולנסוע שוב. מתחילים סביב Hachikō / Crossing.',back:'🚆 חזרה · Shibuya → Shinjuku ב-JR Yamanote Line. כ־7 דק׳.',stops:[['Hachikō + Shibuya Crossing','פתיחה בכיכר ובמעבר החצייה כשהמסכים מוארים.'],['Shibuya LOFT','🛍️ חנות אופציונלית — עדיף בערב הזה כי אנחנו כבר באזור.'],['Hands Shibuya','🛍️ חנות אופציונלית — נכנסים רק אם יש זמן ועניין.'],['Center-gai','רחובות צפופים, אוכל ואנרגיה עירונית.'],['Nonbei Yokocho','סמטת ברים קטנה ליד פסי הרכבת.'],['Miyashita Park','סיום באזור המודרני.']],dinner:'🍽️ ארוחת ערב: Shibuya — לפי החשק אחרי הקניות והסיור.',map:'https://www.google.com/maps/dir/?api=1&origin=Hachiko+Memorial+Statue&destination=Miyashita+Park&waypoints=Shibuya+Loft+Tokyo%7CHands+Shibuya+Tokyo%7CShibuya+Center-gai%7CNonbei+Yokocho&travelmode=walking',image:'images/evening-walks/shibuya.jpg'},
    gion:{title:'Gion · Yasaka · Shirakawa',duration:'כ־2.5–3 שעות כולל ארוחת ערב',out:'🚶 יציאה 19:30 מהמלון · Daiwa Roynet Hotel Kyoto Shijo Karasuma → Gion/Yasaka כ־20–25 דק׳ הליכה. אם לא רוצים ללכת: מונית/תחבורה קצרה עד Shijo-Kawaramachi/Gion.',back:'🚶 חזרה · Gion-Shijo / Shijo-Kawaramachi → Daiwa Roynet Hotel Kyoto Shijo Karasuma כ־20–25 דק׳ הליכה; אפשר גם מונית קצרה.',stops:[['Yasaka Shrine','פתיחה באזור המקדש והפנסים.'],['Hanamikoji','רחוב Gion המסורתי.'],['Gion Shirakawa','תעלה, גשרים ובתי machiya.'],['Shijo-Kawaramachi','סיום באזור מרכזי עם אוכל ותחבורה.']],dinner:'🍽️ ארוחת ערב: Gion או Shijo-Kawaramachi.',map:'https://www.google.com/maps/dir/?api=1&origin=Yasaka+Shrine+Kyoto&destination=Shijo+Kawaramachi+Kyoto&waypoints=Hanamikoji+Street%7CGion+Shirakawa&travelmode=walking'},
    gionFood:{title:'Gion · Food Evening',start:'18:30',duration:'כ־2.5–3 שעות כולל ארוחת ערב',out:'🚶 אחרי Nishiki ממשיכים לכיוון Gion. זה ערב אוכל ושיטוט, בלי להחזיר את 66tantan לאמצע יום Arashiyama.',back:'🚶 חזרה · Gion-Shijo / Shijo-Kawaramachi → המלון כ־20–25 דק׳ הליכה; אפשר גם מונית קצרה.',stops:[['Yasaka Shrine','פתיחה קצרה באזור המקדש והפנסים.'],['66tantan (Rokuroku Tantan)','🍜 אופציה לארוחת ערב — Tantanmen קטן ומיוחד בגיון.'],['Local Izakaya · Gion / Kawaramachi','🍢 חלופה ל-66tantan — מנות קטנות ומבושלות באווירה מקומית.'],['Hanamikoji','שיטוט ברחוב Gion המסורתי.'],['Gion Shirakawa','סיום רגוע ליד התעלה ובתי machiya.']],dinner:'🍽️ בוחרים באותו ערב: 66tantan או Izakaya מקומי — לא שניהם כחובה.',map:'https://www.google.com/maps/dir/?api=1&origin=Yasaka+Shrine+Kyoto&destination=Shijo+Kawaramachi+Kyoto&waypoints=66tantan+Kyoto%7CHanamikoji+Street%7CGion+Shirakawa&travelmode=walking'},
    pontocho:{title:'Pontocho · Kiyamachi · Kawaramachi',duration:'כ־2.5–3 שעות כולל ארוחת ערב',out:'🚶 יציאה 19:30 מהמלון · כ־20 דק׳ הליכה מ-Daiwa Roynet Hotel Kyoto Shijo Karasuma ל-Shijo-Kawaramachi/Pontocho; אין צורך ברכבת.',back:'🚶 חזרה · Kawaramachi → Daiwa Roynet Hotel Kyoto Shijo Karasuma כ־20 דק׳ הליכה לאורך Shijo-dori.',stops:[['Shijo Bridge','פתיחה על נהר Kamo.'],['Pontocho Alley','הסמטה הצרה והמפורסמת.'],['Kiyamachi','הליכה לאורך התעלה.'],['Shijo-Kawaramachi','סיום באזור הקניות והאוכל.']],dinner:'🍽️ ארוחת ערב: Pontocho / Kawaramachi.',map:'https://www.google.com/maps/dir/?api=1&origin=Shijo+Bridge+Kyoto&destination=Shijo+Kawaramachi+Kyoto&waypoints=Pontocho+Alley%7CKiyamachi+Street&travelmode=walking'},
    umeda:{title:'Umeda Night Lights',duration:'כ־3 שעות כולל נסיעות וארוחת ערב',out:'🚆 יציאה 19:30 מהמלון · Namba → Umeda ב-Osaka Metro Midosuji Line. כ־9 דק׳, ללא החלפה.',back:'🚆 חזרה · Umeda → Namba ב-Midosuji Line. כ־9 דק׳.',stops:[['Osaka Station','מתחם התחנה המודרני.'],['Grand Front Osaka','אזור עירוני מואר.'],['Umeda Sky Building','הבניין והרחבה.'],['Umeda','חזרה לכיוון התחנה והמסעדות.']],dinner:'🍽️ ארוחת ערב: Umeda / Grand Front.',map:'https://www.google.com/maps/dir/?api=1&origin=Osaka+Station&destination=Umeda+Osaka&waypoints=Grand+Front+Osaka%7CUmeda+Sky+Building&travelmode=walking'},
    marunouchi:{title:'Marunouchi → Ginza',duration:'כ־2.5–3 שעות כולל ארוחת ערב',out:'🚶 יציאה 19:30 מהמלון · Hotel Metropolitan Tokyo Marunouchi מחובר ל-Tokyo Station; כ־10–15 דק׳ הליכה לצד Marunouchi.',back:'🚶 חזרה · Ginza → Hotel Metropolitan Tokyo Marunouchi כ־15–20 דק׳ הליכה; אם עייפים, Marunouchi Line היא תחנה אחת.',stops:[['Tokyo Station · Marunouchi','חזית התחנה המוארת.'],['Marunouchi Lights','רחובות אלגנטיים ומוארים.'],['Imperial Palace Outer Gardens','קטע רגוע ליד הארמון והחפיר.'],['Ginza','סיום ברחובות המוארים.'],['GU Ginza','🛍️ גיבוי בלבד — אם לא הספקנו ב־7/11.'],['MUJI Ginza','🛍️ גיבוי בלבד — אם לא הספקנו ב־7/11.']],dinner:'🍽️ ארוחת ערב: Ginza.',map:'https://www.google.com/maps/dir/?api=1&origin=Tokyo+Station+Marunouchi&destination=Ginza+Tokyo&waypoints=Marunouchi+Naka-dori%7CImperial+Palace+Outer+Gardens+Tokyo&travelmode=walking',image:'images/evening-walks/marunouchi-ginza.jpg'}
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
    version:'10.3.15', title:'Japan Trip', year:2026, travelers:'עזרי ואיילי',
    tripStart:'2026-11-03', tripEnd:'2026-11-18', rateJpyIls:RATE_JPY_ILS,
    hotels, places, days, eveningWalks, flights, bookings, takeDefault, shoppingDefault, expenseDefaults, trains,
    maps:{search:G,directions:D}
  };
})();
