# Release history

## 2.2.1 — 18 November 2026

- Aircraft are rendered individually at every zoom. Numbered traffic clusters and their setting are removed.
- CelesTrak GP now uses compressed OMM CSV, with six-digit identifier support and strict schema validation.
- A dated starter catalogue of 100 popular objects from independent TLE API is bundled for first launch and outages. Limited coverage and element age remain explicit. This is not the complete CelesTrak active catalogue.
- Successful elements remain cached for two hours. Server errors pause checks at least fifteen minutes; retry scheduling honours backend cooldowns. Existing dated caches remain usable, without synthetic positions.
- Maintained documentation, interface, source comments and generated package instructions are in English.
- 56 automated tests, including CSV quoting and six-digit identifiers, TLE-to-OMM conversion, offline first launch and persisted provider backoff.

## 2.2.0 — 18 November 2026

Separate Flights and Space workspaces. Rotating Earth globe with calculated satellite positions, altitude, selected trajectories, occultation and day/night shading. Simplified navigation and radar-aircraft introduction. Persistent adaptive traffic budget, provider reserve and latest-report restoration. Fifty-one automated tests.

## 2.1.2 — 18 November 2026

Detailed OpenStreetMap, global Sentinel-2 and Switzerland HD basemaps; viewport tile scheduling and portable cache. Progressive airfield display and updated worldwide directory. Clearer identity cards, removal of decorative ATC mode and startup timing tied to the visible native window. Forty-one automated tests.

## 2.1.1 — 17 November 2026

Original minimal logo, startup screen and reduced-motion support. More compact interface, restrained selection transitions, reusable orbital buffers, cached number formatters and stable list updates. Corrected stale flight phases, phase reset and callsign-dependent route cache. Thirty-three automated tests.

## 2.1.0 — 17 November 2026

2D-only map release. Satellite ground tracks, NASA imagery, relief and day/night layers. Identity cards, estimated flight phases and symbolic aircraft categories. Worldwide airport search, access-dependent airport history and nearby observed activity. Filters, favorites, session playback and exports retained.

## 2.0.0 — 17 November 2026

Initial 3D globe, NASA terrain and imagery, day/night cycle, satellite and ISS propagation in a worker. Worldwide OpenSky traffic, category symbols, identity enrichment and indicative routes, airport directory and access-dependent history. UTC correction from HTTPS response dates and portable caches.

## 1.1.0

Improved 2D rendering, worldwide traffic grouping, smoother transitions, diagnostics and portable application data. Grouping was subsequently removed in 2.2.1.

## 1.0.0

Initial portable Windows aviation observation application with public traffic sources and a 2D map.
