# Japan Trip 2026 — v10.0.0

Clean mobile-first PWA for the November 2026 Japan trip.

## Clean architecture

This branch is a ground-up rebuild. It does **not** load the old `index.htm`, merge patch modules, rewrite hotel names at runtime, or depend on MutationObservers.

The application has one canonical data source and a small set of files:

- `index.html` — application shell
- `trip-data.js` — itinerary, hotels, places, restaurants, flights, bookings and defaults
- `app.js` — deterministic UI rendering and local features
- `drive.js` — Google Drive sync and reservation-document picker
- `styles.css` — all application styling
- `service-worker.js` — simple offline cache
- `manifest.json` — PWA metadata
- `assets/` and `images/` — reusable static media

## Data and compatibility

The current hotel list is canonical: JR Kyushu Hotel Blossom Shinjuku, Daiwa Roynet Hotel Kyoto Shijo Karasuma, Hotel Royal Classic Osaka, and Hotel Metropolitan Tokyo Marunouchi. Hakone / Fuji remains unbooked.

Existing local data keys for Take, Shopping, reservation documents, expenses and expense settings are retained so an existing installation can continue to use its saved data. The old Kyoto reservation-document key is migrated once to the Daiwa key.

## Editing the trip

Trip facts should be edited in `trip-data.js`. UI code should not contain replacement rules for trip facts. This keeps one source of truth and prevents old/cancelled hotels or duplicated place badges from returning.

## Sharing / deployment

The branch is self-contained and suitable for GitHub Pages. Point Pages at this branch for testing, or merge it to the production branch after validation. The PWA starts at `./` and does not require query-string cache-busting.

## Release note

`v10.0.0` replaces the legacy patch stack with a clean deterministic build while preserving the current itinerary, hotel details, Places, evening walks, flights, Take/Shopping lists, Pocket tools, budget/expenses, Google Drive sync and reservation confirmations.
