# Airview 2.3 quick changes

**Combined** is the default traffic source. It merges a worldwide OpenSky report with a 250 NM ADS-B.lol report around the selected observation area. Each provider retains its own adaptive budget. The freshest observation wins for duplicate ICAO identifiers; available registration, type and country can be enriched from the other source. Public coverage is incomplete and not equivalent to a commercial tracking subscription.

Space opens with the available catalogue visible. Selecting a satellite shows its details and predicted orbit while other objects remain visible. **Selected only** is optional. Use **Show all satellites** in the globe controls to clear selection and restore the overview. Earth hides objects on its far side; rotate the globe to explore them. The dated fallback is still limited to 100 popular objects when CelesTrak is unavailable.

The new startup animation is skippable, respects reduced motion, and never waits for network data.

---

# Airview 2.2.1 user guide

## Installation and updates

Download the Windows ZIP from GitHub Releases, extract the entire archive and open Airview.exe. Windows 10/11 x64 and a writable folder are required. Do not run inside the ZIP or a protected installation folder. The app is not commercially signed. Compare its SHA-256 against the release file before running it.

For upgrades, close Airview and keep the previous Airview-data directory beside the new executable. It stores preferences, provider budget, the latest report per traffic source, orbital data, map tiles and technical logs. No permanent background service is installed. Closing the app and removing its extracted directory removes its application data.

## Flights

Every received aircraft is drawn individually at every zoom. There are no numbered aircraft groups. Small symbols keep the world view manageable; zoom for detail. Search callsign, ICAO address or available registration, choose favorites, filter measurements or limit the list to the viewport. The list shows at most 200 matching reports; this limit does not hide aircraft from the map.

Select an aircraft for its identity card, reported speed, altitude, heading, vertical rate, source and age. Additional ADSBdb details are queried only on selection. A silhouette is indicative, not a guaranteed exact aircraft model. Follow recenters the map; favorites persist. Trails contain observations from the current session only.

Flight phases use received ground state, vertical rate, recent transitions and nearby airfields. Approach, departure, landing and cruise remain estimates; a reason is shown. Old or insufficient data produce an unknown phase. No phase is inferred from altitude alone.

ADSBdb routes are indicative and unconfirmed for the current flight. A dashed geometric connection is not the actual flown track. Any geometric ETA ignores actual routing, wind and holding. No commercial departure time, cancellation, delay or passenger data are invented.

## Maps and airports

Layers provides the detailed OpenStreetMap plan, global Sentinel-2 2025 imagery and Switzerland HD aerial imagery. The plan reaches level 19; Switzerland HD reaches level 20 within its coverage. Global imagery stops adding detail at level 14, approximately 10 m/pixel. Overzooming cannot create additional precision. NASA overview and relief textures are bundled for an offline overview. Day/night shading uses the astronomical Sun position.

Only visible tiles are requested, at most four simultaneously, after a short navigation delay. Decoded image memory is bounded. The portable disk cache keeps tiles for at least seven days; cleanup targets 128 MiB but may temporarily exceed it to respect minimum retention. No region downloading or prefetching is provided. Attribution remains visible and opens provider information.

The bundled OurAirports directory includes 72,705 non-closed installations at build time. Search remains available at all zoom levels. Small airfields and heliports appear progressively from local zoom; at level 13 visible facilities are no longer spatially thinned. This public directory is not a guaranteed complete operational publication.

## Space and satellite recovery

Space opens the Earth globe. Drag to rotate, scroll or use +/− to zoom, and use arrow keys while the globe is focused. Select a satellite by name, NORAD or COSPAR, or use the ISS shortcut. Isolate selection keeps the display clear; turning it off shows all objects in the loaded catalogue within view. The Earth hides objects on the far side. Altitude uses a 6,371 km reference radius.

Satellite positions are calculated with SGP4 locally every five seconds and interpolated between calculations. The trajectory shows one predicted revolution in the Earth-fixed frame. These are predictions from dated elements, not current telemetry. Inspect epoch and age in the identity card. Data older than seven days receive a reduced-accuracy warning; a cache older than 30 days is not used as an outage fallback.

CelesTrak GP is requested as compressed OMM CSV. Successful data are retained at least two hours. HTTP 500/503 and connection failures pause checks for at least fifteen minutes; other non-success responses pause direct access at least two hours. Persisted provider delays survive restart. No repeated requests or domain rotation bypass a refusal.

The portable includes **100 popular objects** from TLE API / Ivan Stanojevic, dated at build time. This independent service is listed in the NASA API directory and serves CelesTrak-derived records. The starter makes first launch and offline inspection possible. It is a limited selection, not the complete active catalogue. Its limitation is reported in the interface. The complete CelesTrak catalogue is checked automatically after startup, subject to its cooldown. An independent fallback check may refresh a limited catalogue after one day. No satellite positions are fabricated to fill coverage gaps.

## Adaptive traffic refresh

The local budget estimates OpenSky anonymous access as 400 credits/day/IP, with four credits for a worldwide report. ADS-B.lol announces 500 anonymous requests/day/IP. The planner distributes remaining estimated requests across the rest of the UTC day and reserves 5 percent. Actual server limits, remaining-balance headers and Retry-After take priority, including delays spanning midnight.

The budget and latest dated report survive restart. Clicking refresh, changing sectors or relaunching does not refill credits. Other users sharing an IP may consume the same provider budget. There is no guarantee of unlimited live access. The map and last observations remain inspectable while requests are paused.

Old reports are dimmed, source age remains visible, flight phase becomes unknown and movement stops after at most 15 seconds of projection. Reports may remain inspectable for up to 24 hours. A paused or old report is not a current aircraft position. Session trails and playback history are not written as an accumulating archive.

## Keyboard and export

Flights: / search, Space pause/resume, R recenter, F full screen, H help, +/− zoom, Escape clear selection. Space: / satellite search, arrows rotate the focused globe, +/− zoom, H help and Escape clear selection. Reduced-motion system preferences are respected by interface transitions and the introduction.

CSV/JSON exports follow active filters. File units remain ft, kt and ft/min; timestamps use Unix milliseconds. Exports include source attribution. Route databases are not exported.

## Build and verify

Run npm ci, npm run prepare:assets, npm run build and npm test. Asset preparation needs network access and retrieves public image, airport and dated starter data. Generated assets and bundles are excluded from source control. On Windows, npm run package produces the ZIP and SHA-256 file. Do not publish an unverified build or generated personal caches. See THIRD_PARTY_NOTICES.md for data terms.
