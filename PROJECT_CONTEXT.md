# Japan Trip — Project Context

> **Purpose:** Durable source of context for future work on the Japan Trip app.  
> **Verified against:** rewritten main after the v10.3.18 security cleanup on 2026-09-27.
> **Current app version:** **v10.3.18**.  
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

---

## 2. Current architecture

The app is a **static, mobile-first PWA** hosted on GitHub Pages.

- `index.html` — app shell and script loading.
- `trip-data.js` — canonical base itinerary/place/hotel data.
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

Current release: **v10.3.18**

Current service-worker cache:
`japan-trip-v10-3-18-security`

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
TLV → Dubai → Narita.

### 04/11 · Tokyo
Narita → Shinjuku Prince Hotel → **Shinjuku First Night**.

Evening walk:
JINS → 3D Cat → Godzilla Head → optional Don Quijote → Hanazono → Golden Gai → Omoide Yokocho.

### 05/11 · Tokyo
Asakusa → Ueno → Ameyoko → Akihabara.

Current optional additions:
- Asakusa Culture Tourist Information Center viewpoint,
- Gyoza no Ousama,
- Chuka Chinman,
- Kikanbo Kanda Honten.

Evening: **Asakusa Lights**.

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

### 16/11 · Tokyo
Osaka → Tokyo → Hotel Metropolitan → Nihonbashi → optional Pokémon Center Tokyo DX → Tokyo Station / Gransta / Character Street → optional Tokyo Gyoza Stand Oolong → KITTE / Marunouchi → optional Ginza backup.

Evening walk: **Marunouchi → Ginza**.

GU and MUJI are backup shopping stops only if not completed on 7/11.

### 17/11 · Tokyo
Free morning → JINS backup only if still needed → Narita → departure.

Preferred plan is to collect JINS before leaving Shinjuku earlier in the trip if ready, rather than return to Shinjuku on the final day.

### 18/11
Arrival in Israel.

---

## 12. Evening walks currently defined

- `shinjuku` — assigned 04/11.
- `asakusa` — assigned 05/11.
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

