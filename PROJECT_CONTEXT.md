# Japan Trip — Project Context

> **Purpose:** Durable source of context for future work on the Japan Trip app.  
> **Verified against:** current main after the v10.3.34 private offline Visit Japan QR wallet update on 2026-10-29.
> **Current app version:** **v10.3.34**.  
> **Repo:** `azrism-code/Japan` · branch `main` is the source of truth.  
> **Live PWA:** https://azrism-code.github.io/Japan/

---

## 1. Working rules — MUST preserve

1. **Before making any repo change, first explain the recommendation and proposed changes.**
2. **Do not modify the repo or create a new app version until the user explicitly writes `בצע`.**
3. `עצור` means stop immediately.
4. Before every write, inspect the current `main` branch again; do not rely only on chat memory.
5. After a write:
   - verify the files from `main`,
   - run syntax/JSON checks on edited code,
   - verify version/cache alignment when app assets changed,
   - check the GitHub Pages deployment,
   - summarize exactly what changed.
6. **Never delete, reset, or reinitialize localStorage without explicit approval.**
7. Do not rebuild the app from scratch unless explicitly requested.
8. Do not change the visual design beyond what the requested feature needs.
9. This repository is **public**. Do not add new passwords, private tokens, passport details, booking references, personal IDs, or other secrets to this file.

10. **Place-detail UX rule:** day cards stay concise. Detailed explanation belongs inside **“מדריך וטיפים”** only. Do not repeat the same descriptive paragraph in the day card, Places card and guide modal.
11. Every itinerary place that has a guide button should have a real guide: what the place is, why it is worth our time, how it fits this trip, a practical tip, and a suggested visit duration.
12. **Dinner rhythm:** default dinner target is around **21:00**. Earlier dinner is an exception only when fatigue, a booked experience, transport, or local closing hours make it necessary.

---

## 2. Current architecture

The app is a **static, mobile-first PWA** hosted on GitHub Pages.

- `index.html` — app shell and script loading.
- `trip-data.js` — canonical base itinerary/place/hotel data.
- `entry-qr.js` and `entry-qr.css` — device-only, PIN-encrypted Visit Japan Web QR images, with no backend upload.
- `app.js` — deterministic rendering of itinerary, places, tools, hotels, lists, etc.
- `styles.css`, `place-content.css`, `expenses-ui.css`, `station-guides.css` — presentation.
- `manifest.json` + `service-worker.js` — PWA/offline cache.
- Firebase Auth + Firestore — shared state, roles, sync.
- Google Drive integration — reservation documents / PDFs / images.
- localStorage — local state and offline-first working data.

### Important runtime patch files

Some final trip facts are still applied by runtime modules rather than being fully merged into `trip-data.js`:

- `shinjuku-prince-update.js` — replaces the original Tokyo hotel with **Shinjuku Prince Hotel**.
- `kyoto-hotel-update.js` — replaces the original Kyoto hotel with **SAKURA TERRACE THE GALLERY**.
- `romancecar-update.js` — injects the exact 8/11 Romancecar plan.
- `car-rental.js` — replaces the old rental placeholder with the confirmed rental.
- `romancecar-booking-update.js` — updates booking planner details for the Romancecar.

**Do not infer final rendered hotel/rental truth only from the raw canonical objects in `trip-data.js`.**

### Known architecture debt

- Canonical `trip-data.js` still contains older hotel objects for Tokyo/Kyoto; runtime patch files override them.
- Future cleanup could merge stable patch data into the canonical model, but only with explicit approval.

---

## 3. Versioning and cache rules

Current release: **v10.3.34**

Current service-worker cache:
`japan-trip-v10-3-34-offline-qr`

When app code/assets change:

- bump the app version consistently,
- update version query strings in `index.html`,
- update `manifest.json` icon query versions,
- update `service-worker.js` CORE URLs and cache name,
- keep `trip-data.js`, `app.js`, `expenses-ui.js`, `index.html`, `manifest.json`, and `service-worker.js` aligned.

The cache-busting behavior added in v10.3.13 must not regress.

A documentation-only change such as this file does **not** require an app-version bump.

---

## 4. Permissions, Firestore, viewer behavior

Configured model:

- Owner account = full write access.
- One configured Editor account = write access.
- Everyone else = **Viewer / read-only**.
- **Public source no longer contains the Owner/Editor email allowlist.**
- Owner/Editor role is resolved from the existing private trip document using `ownerUid`, `editorUids`, and the existing private `editorEmails` fallback.

Behavior in `firestore-sync.js` (v10.3.18):

- `canWrite()` is true only for `owner` or `editor`.
- booking/Reference [redacted] are expected only from the private Firestore document and are cached locally under `japanTrip_privateSecrets_v1`.
- the public source contains blank hotel booking/Reference [redacted], blank flight booking/seat fields, and a blank rental booking field.
- public Viewer sync now receives only a minimal viewer-safe state (currently completion state + timestamp).
- Expenses are hidden in Viewer mode and are not written into the new public share state.
- the public share ID moved from the legacy trip ID to `public-view-v2`.
- on the first Owner/Editor session after v10.3.18, the app writes a sanitized share to both the new and legacy share documents, then attempts to delete the legacy share.

Firestore rule model in the repository:

- `trips/{tripId}` and its `shared` / `private` subcollections require Owner/Editor authorization.
- client-side creation of a new trip root document is disabled.
- `shares` supports document `get` but explicitly blocks collection `list`.
- legacy short share IDs are denied for public reads.
- share deletion validates authorization from `resource.data.tripId`.

### Important deployment state

The **repository rule file has been hardened**, but Firestore rules are not deployed by GitHub Pages. Until the rules are explicitly deployed to Firebase, the previously deployed rule set may still be active.

Also, the sanitized legacy share is written only when an authenticated Owner/Editor opens the updated app and successfully completes Firestore bootstrap.

Therefore a security release is not considered fully complete until:
1. v10.3.18 is deployed on GitHub Pages,
2. an Owner opens the updated app once while signed in, and
3. the updated `firestore.rules` file is deployed to Firebase.

### Public-link expectation

A friend opening the app URL should see the static trip content in **read-only Viewer mode**. Private booking references, seat assignments, account emails, reservation documents, and budget data must not be exposed through Viewer state.

---
## 5. Google Drive integration

`drive.js` uses Google Drive with `drive.file` scope.

Key behavior:

- reservation documents can be linked/stored as Drive-backed metadata,
- the app stores document metadata under `japanTrip_docs_v1`,
- unlinking in the app removes the app metadata link; it should **not** delete the actual Drive file,
- viewers must not be able to use reservation-document write controls,
- authorizing a viewer's own Drive account does not grant access to the owner's Drive.

Do not broaden Drive permissions without explicit approval.

---

## 6. localStorage state — preserve

Important keys include:

- `japanTrip_take_v2`
- `japanTrip_shop_v2`
- `japanTrip_expenses_v1`
- `japanTrip_expense_settings_v1`
- `japanTrip_expenses_trash_v1`
- `japanTrip_docs_v1`
- `japanTrip_settings_v1`
- `japanTrip_completion_v1`
- `japanTrip_firestoreMigration_v1`
- booking filter/type filter keys
- Drive sync/token metadata keys

Expense deletion writes a backup entry to `japanTrip_expenses_trash_v1` before removal. There is no confirmed visible Undo UI.

**Never clear these keys as a troubleshooting shortcut.**

---

## 7. Trip scope and planning constraints

Trip dates: **3–18 November 2026**.

Sequence:
**Israel → Tokyo → Hakone/Fuji → Kyoto → Nara → Osaka → Tokyo → Israel**

Planning preferences:

- couple trip,
- no rental car except the Hakone/Fuji segment,
- Shinkansen between major cities,
- hotel rooms: one Double/Queen/King, **not Twin**,
- preferred room size: **18 m² or larger**,
- assume two large suitcases,
- user does **not** want very early mornings; **08:00 is the earliest acceptable start when really justified**,
- food preference leans toward cooked food; less interest in raw seafood,
- optional/on-route food stops are welcome even outside normal lunch/dinner times,
- do not remove attractions just because a day looks busy; optional items can stay for same-day decisions.

Travel-time formatting preference:
`🚶 walking | 🚆 transit | 🔄 transfers | ⏱ total`

Walking-only time should be stated explicitly as `🚶 N min walking`.

---

## 8. Current hotel truth

### Tokyo · 4–8 Nov
**Shinjuku Prince Hotel**

Rendered by `shinjuku-prince-update.js`.

- Deluxe King, about 30.6 m²
- breakfast included
- near Shinjuku / Seibu-Shinjuku / Kabukicho
- final rendered hotel should be treated as Shinjuku Prince, not the older canonical JR Kyushu object.

### Hakone / Fuji · 8–10 Nov
**Hakone Kowakien TEN-YU (箱根小涌園 天悠)**

Confirmed booking:
- 8–10 Nov 2026,
- 2 adults,
- Superior Room with Open Air-Bath,
- Non-Smoking,
- Large Bed,
- breakfast + Wi-Fi included,
- total shown on the confirmation: **US$1,036.91**,
- payment is due later,
- bathing tax is not included and is paid at the property,
- address: 1297 Ninotaira, Hakone, Ashigarashimo-gun, Kanagawa 250-0407, Japan.

Public-repo rule:
- do **not** add the booking reference, guest reference, card details or other private confirmation identifiers to public source files.
- the hotel uses the existing private/document slot `hotel-hakone`.

The itinerary now explicitly includes TEN-YU on 8/11 and check-out on 10/11. The hotel mini-card appears automatically on 8/11 and 9/11 from `hotel:'hotel-hakone'`.

Now that the hotel is fixed, the next planning task is to re-optimize:
- 8/11 afternoon/evening after Hakone Shrine,
- 9/11 route from/to TEN-YU,
- actual driving times,
- whether **Lake Yamanakako** is worth adding,
- whether Kawaguchiko/Oishi Park remain sensible from this exact base.

### Kyoto · 10–14 Nov
**SAKURA TERRACE THE GALLERY**

Rendered by `kyoto-hotel-update.js`.

- Deluxe King with balcony
- 25 m²
- room only
- near Kyoto Station, Hachijo / south side, about 2 minutes walking
- use this as the hotel truth, not the older Daiwa canonical object.

### Osaka · 14–16 Nov
**Hotel Royal Classic Osaka**

- Namba
- booked
- Queen / one double-bed room
- breakfast included.

### Tokyo final night · 16–17 Nov
**Hotel Metropolitan Tokyo Marunouchi**

- at/next to Tokyo Station / Sapia Tower
- Queen room
- 18 m²
- room only.

---

## 9. Rental car — Hakone/Fuji

Rental is already booked and paid.

- Supplier: **Nippon Rent A Car**
- Pickup: **8 Nov · 11:00 · Odawara Station Shinkansen side**
- Return: **10 Nov · 11:00 · same branch**
- Vehicle class: Nissan Note e-POWER or similar compact
- Full-to-full fuel
- unlimited mileage
- GPS included

Required pickup documents are listed in `car-rental.js`.

Do not revert the rental to “not booked” just because the base `trip-data.js` booking placeholder is stale; `car-rental.js` replaces it at runtime.

---

## 10. Key train plans

### Romancecar · 8/11

Planned train:
**Hakone 7 · Shinjuku 09:20 → Odawara 10:35**

- hotel checkout: about 08:50,
- rental pickup: 11:00,
- target seats: **C + D**,
- D = window on the Fuji side; C = adjacent aisle,
- outbound preference: odd-numbered row for the larger panoramic window / fewer frame obstructions,
- the Odakyu website reservation covers Limited Express / reserved-seat component; Basic Fare is separate via Suica/IC.

### Shinkansen · 10/11
Odawara → Kyoto. Exact train/time still to be finalized.

### AONIYOSHI · 14/11
Planned:
**Kyoto 10:55 → Kintetsu-Nara 11:31**

- Twin Seats are the preferred train seats for the couple,
- this “Twin” preference is only for the train and does not conflict with the no-Twin hotel preference,
- special/limited-express seat component is booked separately from Basic Fare.

### Shinkansen · 16/11
Shin-Osaka → Tokyo. Exact train/time still to be finalized; consider Fuji-side seating if useful.

---

## 11. Current day-by-day itinerary

### 03/11 · Israel → Japan
TLV → Abu Dhabi → Narita.

Confirmed Etihad itinerary from tickets shared on 25 Oct 2026, with **EY800 rescheduled according to the airline change email received 27 Oct 2026**:
- EY594 · 03/11 TLV 14:00 → AUH 19:10 · Airbus A321neo, Terminal 3 TLV.
- Abu Dhabi outbound connection is now **3:10** (EY594 arrival 19:10 → EY800 departure 22:20); confirm other legs have not changed in Etihad Manage Booking.
- **EY800 changed** · 03–04/11 AUH Terminal A **22:20** → NRT **13:15** (+1), duration **9:55** · Airbus A380-800, Narita **Terminal 1**. Previous 21:05 / 11:40 times are obsolete.
- 17/11 EY801 · NRT 17:20 → AUH 00:40 on 18/11, Narita **Terminal 1**.
- Abu Dhabi return connection 2:45.
- 18/11 EY595 · AUH 03:25 → TLV 05:05, Terminal 3.
- Ticket displays 30 kg checked baggage per traveler on all four Etihad legs. Other cabin bag allowances are not assumed.

### 04/11 · Tokyo · Shinjuku First Day
Narita Terminal 1, **13:15** → immigration and baggage → previously booked Booking taxi (pickup timing must be reconfirmed) → Shinjuku Prince Hotel check-in → shorter and flexible Shinjuku evening.

Airport transfer:
- Free Booking.com taxi was **confirmed for the original EY800 arrival at 11:40**, service provider **xiooh travel**, People Carrier for 2 travelers, tracking inbound EY800. The flight now lands at **13:15 on 04/11**. **No evidence that the actual Booking/supplier pickup has been adjusted.** The user must contact Booking or the provider and verify pickup and 45-minute wait rules; do not claim the booking was changed remotely.
- Meeting point needs to be confirmed as Narita Terminal 1 and the 45-minute waiting-window conditions checked with provider; do not invent a pickup pin or exact taxi ETA.
- The airport itinerary sequence is: Narita arrival → immigration/baggage → **one** booked Booking taxi → **check-in at Shinjuku Prince Hotel** → JINS and the evening.
- The previous `shinjuku-prince-update.js` second transfer labeled `אחרי המכס` and its Narita Express advice were removed; N'EX is a backup only.
- No extra train stop or duplicate paid transfer should be inserted; hotel mini-card remains for accommodation information.


Afternoon:
JINS after hotel check-in **only if time and opening hours permit**, otherwise reschedule early in Tokyo (5–7 Nov). 3D Cat → Godzilla Head → optional Tokyu Kabukicho Tower in the evening, with times kept flexible.

Evening walk starts only after hotel check-in and is deliberately short (about 1–2 hours), with no duplicated daytime stops:
optional Don Quijote → Hanazono Shrine → Golden Gai → Omoide Yokocho.
Dinner target is around **21:00**; only on arrival day may it move earlier if fatigue/hunger requires it.

### 05/11 · Tokyo
Asakusa → Ueno → Ameyoko → 2k540 → Akihabara through the evening.

Current flow:
- Kaminarimon → Nakamise → Sensō-ji,
- optional Asakusa Culture Tourist Information Center,
- optional Gyoza no Ousama,
- Ueno → Ameyoko,
- optional Chuka Chinman,
- optional **2k540 AKI-OKA ARTISAN**,
- Akihabara Electric Town,
- **Akihabara Radio Kaikan**,
- Akihabara after dark,
- optional **Yodobashi Akiba**,
- optional **GiGO Akihabara**,
- Kikanbo only if timing/queue work,
- dinner around **21:00** in Akihabara/Kanda.

**No separate Asakusa evening walk is assigned.** Asakusa is already visited in the morning, so the day deliberately finishes in Akihabara/Kanda rather than doubling back.

### 06/11 · Tokyo
Meiji Shrine → Harajuku → Omotesando → Shibuya → viewpoint choice → **Shibuya After Dark**.

Current guidance:
- Takeshita Street = short pass-through,
- spend more time in side streets / Omotesando,
- Harajuku Gyoza Lou,
- Age.3xQ,
- The Matcha Tokyo,
- Onitsuka Tiger optional,
- **Shibuya Sky is the preferred viewpoint if visibility is good**,
- Tokyo Metropolitan Government Building remains the free/flexible backup.

Shibuya evening:
Hachikō/Crossing → optional LOFT → optional Hands → Center-gai → Nonbei Yokocho → Miyashita Park.

### 07/11 · Tokyo
Tsukiji → Ginza → Imperial Palace → Tokyo Station / Marunouchi.

Optional:
- Ginza Kagari,
- Glitch Coffee,
- UNIQLO / GU / MUJI.

**No dedicated evening route is currently assigned to 7/11.**
The old Shibuya evening was moved to 6/11 because 6/11 already ends in Shibuya.

### 08/11 · Hakone
08:50 checkout → Romancecar 09:20 → Odawara 10:35 → rental 11:00 → Lake Ashi → Hakone Shrine → **Hakone Kowakien TEN-YU**.

The itinerary includes an explicit TEN-YU check-in stop and the day map ends at the hotel. The remaining afternoon/evening can now be optimized around the exact hotel location and onsen time.

### 09/11 · Hakone / Fuji
**TEN-YU →** Owakudani → Hakone Ropeway.

Weather branch:
- **Option A, clear Fuji:** Kawaguchiko + Oishi Park + optional Oishi Park Cafe.
- **Option B, poorer Fuji visibility:** Hakone Open-Air Museum / stay in Hakone.

Potential future option after hotel is known:
- short stop at **Lake Yamanakako** if it sits naturally on the drive and Fuji visibility is excellent.

Do not attempt to “collect all five Fuji lakes”; that would turn the day into mostly driving.

### 10/11 · Hakone/Fuji → Kyoto
**Check-out TEN-YU** → return rental at 11:00 → Odawara → Shinkansen → Kyoto → SAKURA TERRACE THE GALLERY → Gion evening.

### 11/11 · Kyoto
Kiyomizu-dera → Sannenzaka/Ninenzaka → optional Yasaka Pagoda → optional tea house → Higashiyama → Gion → Pontocho.

Optional Gion gyoza:
- Kyoto Gyoza enen,
- Gyoza Hohei.

Evening: Pontocho / Kiyamachi / Kawaramachi.

### 12/11 · Kyoto
**08:00** Fushimi Inari → optional Fushimi Sake District → Tofuku-ji → Sanjūsangen-dō → Kyoto Station / Higashi Hongan-ji → teamLab Biovortex Kyoto.

08:00 is intentionally the earliest planned start; do not shift earlier unless the user explicitly changes the constraint.

### 13/11 · Kyoto
Arashiyama / Okusaga → Tenryu-ji → optional Togetsukyo → optional riverside café → **Otagi Nenbutsu-ji preferred optional** → optional Gion Duck Noodles → Ryōan-ji secondary optional → Kinkaku-ji → Nishiki → MOTOI Gyoza optional → Gion Food Evening.

Priority rule:
If choosing between Otagi and Ryōan-ji, **Otagi is preferred**.

Gion Food Evening:
- Yasaka Shrine,
- choose **66tantan OR a local izakaya**,
- Hanamikoji,
- Gion Shirakawa.

### 14/11 · Kyoto → Nara → Osaka
AONIYOSHI → Nara Park → Tōdai-ji → optional **Wakakusayama Hill** if weather/time are good → Osaka-Namba → Hozenji → Dotonbori.

If Wakakusayama is chosen, Naramachi is first to drop.

Food options near Hozenji/Namba:
- Hanamaruken Hozenji,
- Takotako King.

### 15/11 · Osaka
Osaka Castle → Umeda → Shinsaibashi → Dotonbori.

Evening: Umeda Night Lights is still defined/assigned.

Do not add Himeji unless the user explicitly chooses to replace part of this Osaka day; do not stack it on top.

### 16/11 · Osaka → Tokyo · confirmed hotel night
- Preserve Osaka → Tokyo Shinkansen on 16/11.
- Check in / drop bags at **Hotel Metropolitan Tokyo Marunouchi**, confirmed for **16–17/11**.
- Afternoon around Nihonbashi/Tokyo Station, optional Pokémon / Gransta / gyoza, and the existing Marunouchi → Ginza evening. There is **no flight on 16/11**.

### 17/11 · confirmed return day from Narita
- Check out from Hotel Metropolitan Tokyo Marunouchi; short morning near Tokyo Station.
- JINS Shinjuku is emergency pickup backup only; strongly prefer collecting before the last day.
- Indicative hotel/Tokyo Station departure around **12:15**, with actual rail timing still to be chosen. Aim for check-in by **14:20** at **Narita Terminal 1**.
- Confirmed **EY801 · NRT 17:20 → AUH 00:40 (+1)**, Etihad Airways.
- No superseded Emirates EK321/Dubai flights and no old alternative date.

### 18/11 · arrival in Israel
- Abu Dhabi connection 2:45.
- Confirmed **EY595 · AUH 03:25 → TLV 05:05**, Terminal 3.
- This is a distinct 18/11 itinerary day, with arrival home on 18 Nov.


---

## 12. Evening walks currently defined

- `shinjuku` — assigned 04/11.
- `asakusa` — still defined but currently not assigned (removed from 05/11 to avoid repeating Asakusa).
- `ueno` — still defined but currently not assigned.
- `shibuya` — assigned 06/11.
- `gion` — assigned 10/11.
- `pontocho` — assigned 11/11.
- `gionFood` — assigned 13/11.
- `umeda` — assigned 15/11.
- `marunouchi` — assigned 16/11.

An unused evening definition is not automatically a bug.

---

## 13. Known map-route issue still open

The user noticed that opening a walking route does not always show every place that is displayed in the app.

Previously identified examples that still need deliberate cleanup:

- **Asakusa evening:** displayed stops include Sumida River Promenade and Skytree view, but the current Google Maps URL does not explicitly include every displayed stop.
- **Marunouchi → Ginza evening:** GU Ginza and MUJI Ginza appear as backup stops in the displayed list but are not explicit waypoints in the current map URL.
- **Gion Food Evening:** the generic “Local Izakaya” is not a concrete business, so it cannot be mapped precisely until a real venue is chosen.

Rule for future fixes:
- evening walking maps should include all concrete displayed stops,
- daytime routes should not blindly force every optional stop into a single transit route if that creates bad zig-zag routing,
- weather branches and meaningful detours should remain separate options where appropriate.

---

## 14. Food / snack strategy

Food places can be included as **optional on-route stops**, even outside lunch/dinner hours.

Current notable optional additions:

### Tokyo
- Gyoza no Ousama · Asakusa
- Chuka Chinman · Okachimachi
- Harajuku Gyoza Lou
- Tokyo Gyoza Stand Oolong · Gransta
- Kikanbo Kanda Honten
- Age.3xQ Harajuku
- The Matcha Tokyo
- Ginza Kagari
- Glitch Coffee Ginza
- Hamburg YOSHI

### Kyoto
- Kyoto Gyoza enen · Gion
- Gyoza Hohei · Gion
- MOTOI Gyoza
- Gion Duck Noodles · Arashiyama
- 66tantan
- Local Izakaya alternative

### Osaka
- Hanamaruken Hozenji
- Takotako King
- Namba Ramen Ichiza

**Kameido Gyoza is intentionally not included.**

---

## 15. Booking planner — current important items

Treat `booking-planner.js` and runtime modules as the practical booking checklist.

Key items:

- Hakone Kowakien TEN-YU — **booked**; 8–10/11; Superior Room with Open Air-Bath; breakfast included; US$1,036.91; payment later.
- teamLab Biovortex Kyoto — open, required.
- Romancecar — planned 8/11 09:20; sales open one month before.
- Odawara → Kyoto Shinkansen — open.
- AONIYOSHI — planned 14/11 10:55; reserve when sales open.
- Shin-Osaka → Tokyo Shinkansen — open.
- Shibuya Sky — optional, book only if chosen.
- Odawara rental car — **already booked and paid**.

Do not let stale placeholders in base `trip-data.js` override confirmed runtime state.

---

## 16. Expenses

Expense UI supports:

- compact cards,
- edit,
- include/exclude from budget,
- paid/booked/estimate totals,
- budget remaining,
- stacked usage bar,
- train estimates seeded from booking-planner items,
- safe delete backup to the expense trash localStorage key.

Current train estimate seeds for the couple are maintained in `expenses-ui.js`.

The Hakone hotel expense is now **Hakone Kowakien TEN-YU · US$1,036.91 · מוזמן · תשלום מאוחר**. `expenses-ui.js` includes a non-destructive migration that replaces the old Hakone placeholder after local or Firestore state is applied, without clearing other expense data.

Do not remove user expense data or reseed destructively.

---

## 16A. Tablet responsive layout — v10.3.19

The same PWA now adapts automatically to tablets; there is no separate tablet app.

- Phone layout below 760px remains unchanged.
- Tablet portrait widens content, uses two-column grids on suitable secondary pages, and shows larger imagery/modals.
- From 900px, the daily itinerary adds a sticky companion panel with day summary, hotel access, route link and evening shortcut while keeping the timeline readable.
- Tablet landscape from 1024px moves the four primary navigation items into a fixed left-side rail and removes the phone bottom-navigation footprint.
- Hotels, flights, bookings, tools and expenses use two-column layouts where practical; Places uses a two-column card grid.
- The manifest orientation is now `any`, so installed PWA works in both portrait and landscape.
- Mobile behavior and data model are unchanged.


## 16B. Interactive budget breakdown filters — v10.3.25

- Existing paid / booked / estimate utilization bar and legend now filter the expense list by payment status.
- A second stacked bar and legend summarize expenses by category and filter the same list.
- Status and category choices combine (logical AND); clicking a selected choice again clears it; a clear-all control appears when filters are active.
- The separate expense category filter button row is hidden to save space.
- All totals and chart percentages always reflect **all expenses included in the budget**, not just the selected subset.
- Category amounts are converted to ILS using current configured FX rates; excluded expenses stay visible in the list when they match the filters but do not contribute to chart totals.
- Existing expense storage and Firestore synchronization schemas are unchanged. No user data is reset.

---

## 16C. Expense screen readability — v10.3.26

- Enlarged chart titles to responsive 13–15px, status/category labels to 13–14px, and corresponding amount/percentage captions to 11–12px.
- Enlarged secondary text within individual expense cards (category, payment status, payment method and optional note) to responsive 13–14px.
- Enlarged small KPI labels and expense action/filter text, with wrapping/minimum touch targets to reduce clipping on narrow mobile screens.
- Changes are scoped to the Expenses page; existing layouts on other app pages remain unchanged.
- Typography scales within bounds across phone and tablet viewports. The dual filter behavior, expense data and sync schema are preserved.

---

## 16D. App-wide readable typography — v10.3.27

- New `readability.css` is the single, targeted override layer for text readability across the PWA, loaded last in `index.html` and included in the offline CORE cache.
- Regular descriptions, notes and card details are **16px**; secondary text is **15px**; headings are usually **18px**. The expense chart headings are **17px**.
- Expense cards use 16px for status/category/payment and free-text notes. The two chart legends have 16px category/status names and 15px values/percentages.
- Also targets itinerary timelines, place listings, booking planner, hotel/flight cards, station guides, modals, tools, nav labels and tablet companion panel.
- Narrow card text may wrap. Expense edit-button tap targets are enlarged. The bottom navigation has increased reserved height; tablet landscape retains its left-side rail.
- No change to business logic, expense data, Firestore schema, booking truth, or interactive expense filtering. Never reset localStorage to apply typography changes.
- Future app-wide text size adjustments should be made in `readability.css` rather than adding more runtime overrides.

---

## 16E. Balanced font sizes — v10.3.28

- Based on the compact v10.3.26 layout after the v10.3.27 global typography enlargement caused oversized cards and clipped information.
- The `readability.css` rules were replaced by selective, moderate font overrides: about 15px regular text, 14px secondary text, 16px card titles, 13–14px small labels; expense category names 15px, amounts and percentages 13px.
- Restored original geometry for the day strip, timeline, bottom navigation, buttons, expense cards and graph columns; no broad 16px forced type or global padding/height changes.
- Applied balanced typography to itinerary, hotels, places, booking planner, station guides and Expenses without altering features or private/shared storage.
- Two expense chart filters still combine; status/category selections, expense amounts, and persisted settings are unchanged.
- Verify visually at phone widths and tablet layouts before any future typography increase.

---

## 16F. Compact itinerary without timeline rail — v10.3.29

- Removed the small stop icons and vertical timeline connector from the day itinerary. This applies to normal stops, logistics, hotel mini-cards, and evening walk cards.
- The itinerary `.stop` CSS grid now has two columns: a 52px time/label column and a flexible `minmax(0,1fr)` stop card with an 8px gap. Compared with the former 54px + 24px rail and two gaps, cards gain about 32px on phones.
- The time remains outside the card on the right in RTL, in its existing orange treatment (logistics times retain their distinctive blue).
- The rail's DOM markup and unused CSS rules are gone rather than only hidden; the larger card width also applies to tablet layouts.
- No changes to itinerary content/times, optional flags, guides, map links, budget logic, stored data, or balanced typography from v10.3.28.

---

## 16G. Firebase login / role lifecycle — v10.3.30

- Fixed a race where the public-view Firestore snapshot subscription survived authentication and could later demote a signed-in Owner/Editor to Viewer, or apply public-only completion state over an authenticated session.
- All public and private Firestore subscriptions are removed when Firebase Auth changes users or signs out. Async callbacks and permission lookups check the current auth-generation and account UID before changing state.
- While account privileges are being checked, the runtime remains in Viewer (read-only) mode with an explicit "checking permissions" status. Write operations do not begin until private state hydration completes.
- On initial publish failure, show a sync warning and retain the authenticated Owner/Editor role; a failed publish does not mark the private migration verified.
- Google sign-in explicitly requests persistent LOCAL Firebase session where supported. Popup-blocked and unsupported-popup environments fall back to redirect login. Browser/device data cleanup can still require a new login.
- Fixed noisy Viewer write-denied popups from background state notifications; explicit Viewer actions remain blocked.
- **Security boundary:** Owner is determined solely by equality of the current authenticated UID with `trips/japan-2026.ownerUid` in trusted Firestore. Editors are authorized according to configured UID/email allowlists. Client code does not auto-promote Editor to Owner.
- **Unresolved backend check:** the authenticated account currently showing Editor may have a different UID from Firestore `ownerUid`. The app cannot safely alter that trusted root field; it must be verified using Firebase Authentication and Firestore with authenticated admin access. No permission or Firestore security rules were changed.
- Regression tested in a mocked Firebase lifecycle (Viewer → Owner → logout → Editor, stale public callbacks ignored); no localStorage wipe, data migration, or expense/itinerary changes.

---

## 16H. Confirmed Etihad flights, taxi, and trip end — v10.3.31

- Canonical `trip-data.js` now has final EY594 / EY800 / EY801 / EY595 flight legs with local times and Narita Terminal 1.
- On 04/11, Booking taxi is confirmed (EY800, xiooh travel, People Carrier, free); check-in is immediately after the taxi; obsolete "after customs" rail stop is removed by `shinjuku-prince-update.js`.
- 16/11 stays as Osaka → Tokyo + Metropolitan Marunouchi night / evening; 17/11 is the actual flight home; 18/11 adds Abu Dhabi transfer and Israel arrival.
- Booking planner marks the taxi and flights confirmed, with their non-sensitive details.
- The historic expense named "טיסות Emirates / Flydubai" is renamed to "טיסות Etihad Airways" in defaults and locally / when applying Cloud state, without changing price, currency, paid status, or user notes.
- `place-content.js` Narita guide now matches Terminal 1 and the booked taxi. Removed the old Terminal 2 stock image rather than wrongly portraying the terminal.
- `firestore-sync.js` deliberately does not map legacy return-flight seat values (from old Emirates legs) to new Etihad return flight records. Private persisted seat records remain intact.
- Removed stale runtime version overwrites from `place-content.js` and `car-rental.js`, which were resetting `TRIP_DATA.version`/`appReady` to older versions after load.
- No booking/PNR or personal identifier was inserted into public GitHub. No Firebase permissions, login behavior, private document contents, or trip budget totals were changed.
- Arrival/return travel times in the itinerary are indicative; do not present unbooked train times or pickup pins as confirmed.

---

## 16I. Confirmed 7G eSIM purchase for two travelers — v10.3.32

- User confirmed the purchase of **two 7G eSIMs** for the Japan trip. The receipt dated **27 Oct 2026** confirms **USD 37.18 total paid**. The receipt does **not** list the GB capacity of either eSIM, so no data allowance is asserted.
- The two previous `📱 תקשורת` defaults (`eSIM עזרי`, `eSIM איילי`, both USD 12 estimates) are replaced by one **`7G eSIM × 2`, status `שולם`, currency `USD`, amount `37.18`, included in budget**, note `2 חבילות eSIM · נרכש ב-27/10/2026`.
- Existing local / Firestore expense arrays are migrated in `app.js` when cloud state is applied: remove only those two exact legacy estimate names, keep exactly one new shared purchase row (preserving its existing ID if possible), and notify normal `japan:stateChanged` for authorized Owner/Editor to publish Firestore state.
- Migration is idempotent. If the combined purchase row already exists, its user-edited financial details are kept and the two old estimates alone are removed. Unrelated expenses and customized entries are unchanged. If the legacy rows were previously manually removed, do not resurrect deleted expenses.
- `📱 תקשורת` totals should show the new **USD 37.18 paid** once rather than two **USD 12 estimates**. The rest of the itinerary, flight totals, app permissions, and costs remain unchanged.
- The publicly hosted repository contains **no receipt number, charge reference, card details, personal email, purchase token, or eSIM activation codes**.
- The repository code is updated on `main`; the user's existing remote Firestore document is updated through the normal authenticated app sync when the user opens the new version, not directly by editing the public Git repo.

---

## 16J. EY800 rescheduled flight · v10.3.33

- **Source:** screenshot of an Etihad Airways change notice on 27 Oct 2026. EY800 from Abu Dhabi Terminal A departs **03/11 at 22:20** (instead of 21:05), arrives Tokyo Narita Terminal 1 **04/11 at 13:15** (instead of 11:40), Airbus A380-800, flight duration **9:55**. Both travelers have seats shown as unassigned ('-') on this notice; seat assignments should be checked with the airline, not fabricated or stored in public repo.
- If EY594 continues to arrive AUH at 19:10 as in the last ticket, the outbound layover becomes **3h10**. Other leg timings and hotel dates remain unchanged; airline full itinerary should be checked for other changes.
- Arrival on 04/11 shifts later: immigration → luggage → Booking taxi → Shinjuku Prince Hotel check-in → short optional Shinjuku outing. JINS 15:30 is removed and becomes **conditional / after hotel check-in**; if closed or tired, choose another Tokyo day early in the trip. 3D Cat and Godzilla stops have flexible evening labels. Evening walk no longer assumes all afternoon stops already happened.
- **Critical booking follow-up:** xiooh travel / Booking.com pickup was booked on the original EY800 **11:40** arrival; the new **13:15** pickup is *not verified*. The itinerary and booking planner warn to check the supplier, meeting point and 45-minute wait policy. We did **not** change the external Booking reservation.
- Updated Narita place guide and removed an obsolete Terminal 2 photo fallback in app.js. Terminal remains **Narita Terminal 1**.
- Bumped `app.js`, `trip-data.js`, `booking-planner.js`, `shinjuku-prince-update.js`, `place-content.js` and PWA version/cache to 10.3.33; no changes to Firebase login/authorization, private booking identifiers, other flights, expenses, or trip end.
- The previous idea to include Craft Dining Upit as an optional restaurant for the Kyoto 11/11 Pontocho evening was **only proposed**, not part of this flight-schedule release. Implement separately upon specific approval.

---

## 16K. Visit Japan Web QR — local encrypted offline wallet · v10.3.34

- Two separate QR screenshots for Japan immigration/customs, labeled for each of the two travelers, can be selected directly from the phone's photo gallery, replaced, deleted, previewed, or expanded to a white-screen scan view.
- Entry points: compact **🛂 QR** shortcut in the sticky app header, QR button in the side menu, a first "🛂 קודי כניסה ליפן" card in Tools, and a button in the first arrival/immigration stop on **4 Nov, Narita Terminal 1**, and a QR shortcut at the top of the **Bookings / documents** page.
- QR screenshots are saved **only on the device** in a new origin-scoped IndexedDB database `JapanTripEntryQR_v1`, store `wallet`. They are encrypted with AES-GCM using a key derived from a **user-chosen 6-digit PIN** with PBKDF2-SHA256 and a random salt (310,000 iterations); unique IVs for saved images. The PIN itself is never stored. The encryption key is held only in memory while the current app page is active (quick re-open without re-entering the PIN), and cleared on explicit lock, reload or pagehide. A forgotten PIN can be reset via a two-confirmation destructive reset of the two local QR images and verifier; the user must have copies of the original images.
- **First-time setup requires Owner/Editor authentication.** After setup, displaying stored QR images requires the PIN even when Firebase auth is temporarily unavailable, enabling offline access. A public Viewer on another device sees no saved QR images; a person with access to this particular unlocked phone and the PIN can display them. 6-digit PIN deters casual access but is not a substitute for a strong device screen lock.
- **Do not add actual QR images, encoded QR content, screenshots, activation keys or immigration details to public GitHub, Firestore, Google Drive, docs metadata, or service-worker cache.** `entry-qr.js` uses no network upload, and these entries are never included in other synced localStorage keys or backup JSON.
- Because IndexedDB is strictly local, **not synced between devices**, people must separately save the relevant QR screenshots on each phone if desired. Browser data removal/reinstallation can erase them; recommend keeping original QR screenshots as an offline gallery backup. Losing the PIN requires replacing the wallet data from originals, not password recovery.
- The new JS/CSS app assets themselves are included in the PWA service worker's offline CORE list; sensitive image files are **not**. Test access in airplane mode after first installation.
- Preserves existing Firebase Owner/Editor auth, reservation documents on Google Drive, original itinerary, purchases and all prior localStorage state. No backend schema or public permissions changes.
- Previous Kyoto Craft Dining Upit restaurant proposal is outside this scoped change; only QR feature was approved here.

---

## 17. UI / logo

Current logo direction:

- minimalist Japan icon,
- Fuji + red sun + white winding path,
- no “AS” initials,
- app icon = symbol only,
- header = icon + “Japan Trip” + year/version.

Key assets:
- `assets/icons/app-icon-192.png`
- `assets/icons/app-icon-512.png`
- `assets/icons/apple-touch-icon.png`
- `assets/icons/header-icon.png`

Do not change the logo unless explicitly requested.

---

## 18. Next planning follow-ups

### Highest priority
1. Re-optimize 8/11 and 9/11 around **Hakone Kowakien TEN-YU**:
   - afternoon/evening usage,
   - onsen timing,
   - actual drive times,
   - whether Yamanakako makes sense,
   - whether Oishi Park/Kawaguchiko still fit cleanly.
2. Keep the hotel synchronized across itinerary, Hotels, Bookings and Expenses; the budget entry is **US$1,036.91 · מוזמן · תשלום מאוחר**.

### Other open planning points
- 7/11 currently has no dedicated evening route; decide later if another area is worth adding.
- Fix the known evening walking-map waypoint mismatches.
- Finalize teamLab ticket.
- Finalize Shinkansen times.
- Reserve Romancecar / AONIYOSHI when booking windows open.
- Decide whether Shibuya Sky will be used based on forecast/visibility and ticket availability.

---

## 19. Security status — v10.3.18

The current `main` tree was hardened after a public-repository review.

Current-tree actions completed:
- removed hotel booking/Reference [redacted] from public `trip-data.js`,
- removed the flight booking reference, passenger names and seat assignments from public trip data,
- removed the rental booking reference from `car-rental.js`,
- removed Owner/Editor email addresses from `firebase-config.js`,
- made private Firestore state the source for sensitive booking/Reference [redacted],
- hid Expenses from Viewer mode and stopped putting budget data in new public share state,
- blocked Firestore share collection listing in the repository rule file,
- fixed the share-delete rule to authorize against existing resource data,
- introduced `public-view-v2` and a migration path that sanitizes the legacy share.

Security enforcement and remaining follow-ups:
- **Repository history:** old backup branches were removed; `main` is the only remaining remote branch and the only source of truth.
- **Booking identifiers are forbidden in Git.** Flight PNRs, hotel booking/reference numbers, provider references, and rental booking identifiers live **only in Firestore private documents**.
- **Flight PNR/booking references must never be rendered in the app UI**, even for the owner/editor. They may remain stored in the private Firestore/local cache, but `firestore-sync.js` must not inject them into `TRIP_DATA.flights.booking`, and `renderFlights()` must not display a Booking field.
- `trip-data.js`, `car-rental.js`, and all other repository files must contain display-safe fields only.
- Seat numbers are not treated as secrets; they may exist in display-safe trip data if desired.
- `.gitleaks.toml` contains custom travel-booking rules.
- `.githooks/pre-commit` runs gitleaks before local commits.
- `.github/workflows/gitleaks.yml` runs a repository secret scan on pushes to `main` and pull requests.
- Personal email addresses, card information, passport information, and private document URLs are forbidden in the public repository.
- **GitHub cached objects:** pre-cleanup/orphaned commit SHAs can remain directly retrievable after a history rewrite. GitHub Support must be asked to purge eligible cached/unreachable sensitive objects.
- **Firestore rules deployment:** the updated rule file still needs to be deployed to Firebase.
- **Public-share migration:** an Owner/Editor must open v10.3.18 once after deployment so the sanitized share is written.
- Previously exposed booking references should still be treated as exposed even after repository cleanup; provider-side rotation or additional verification should be considered where supported.

---

## 20. Safety against stale context

When a future chat starts:

1. read this file for continuity,
2. **still verify `main` before answering “latest state/version” or making edits**,
3. if this file conflicts with code on `main`, code on `main` wins,
4. update this file after meaningful changes to itinerary, hotels, architecture, permissions, or current release state.

