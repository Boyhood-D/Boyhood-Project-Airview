<p align="center"><img src="assets/logo.svg" width="88" alt="Airview logo"></p>
<h1 align="center">Airview</h1>
<p align="center"><strong>Explore aircraft on a detailed map and satellites on a rotating globe.</strong><br>Portable Windows application · English interface · Free</p>
<p align="center"><a href="https://github.com/Boyhood-D/Boyhood-Project-Airview/releases/latest"><strong>Download for Windows</strong></a> · <a href="docs/USER_GUIDE.md">User guide</a> · <a href="CHANGELOG.md">Release notes</a> · <a href="https://github.com/Boyhood-D/Boyhood-Project-Airview/issues">Report an issue</a></p>

## A clearer view of the sky

Airview brings public aviation and orbital data into two focused workspaces. Select an object to inspect its identity, measurements and clearly labelled estimates.

| Flights | Space |
| --- | --- |
| Combined global + nearby observations, without duplicate aircraft | Rotating Earth with astronomical day/night shading |
| Identity cards and estimated flight phases | Calculated satellite positions and selected orbital trajectories |
| Following, favorites and observed session trails | Search by name, NORAD or COSPAR |
| Worldwide airport and airfield directory | ISS shortcut and isolated selection |
| Filters, session playback and CSV/JSON export | Dated starter catalogue for first launch and outages |

## Get started

1. Download the Windows ZIP from the latest release.
2. Extract the **entire ZIP** into a writable folder.
3. Open **Airview.exe**.

Windows 10/11 x64. No account or paid subscription. Internet is required for new reports. The app is not commercially signed. A SHA-256 file accompanies the download.

To upgrade while preserving preferences and the traffic budget, close Airview and keep your existing **Airview-data** folder beside the new executable. All application data remain portable in that folder.

## Version 2.3.0

A quieter interface introduces a new Airview mark, refined navigation, a minimal launch animation, and clearer scrolling lists. Space now opens with all available satellites visible: ISS is no longer automatically selected and isolated. The overview button restores the full scene. Combined traffic is the default, merging worldwide OpenSky observations with the ADS-B.lol 250 NM area around the chosen map center. Aircraft are deduplicated by ICAO identity, use the freshest complete position, and retain available identity details. Each provider keeps its own quota and cooldown; one source can continue if the other fails. CelesTrak uses its recommended compressed CSV format. The portable includes a dated starter selection of **100 popular orbital objects**, obtained from the independent TLE API listed in the NASA API catalogue. The starter is a limited fallback, not the full active catalogue. Airview checks CelesTrak for the full catalogue when access permits, respects provider errors and preserves cached data.

## Honest data, visible limitations

Traffic coverage depends on public receivers and quotas. Airview does not access the paid Flightradar24 API and cannot guarantee all commercial flights. Combined coverage adds the selected nearby area to the worldwide public report; it does not request every regional area. Adaptive refresh spreads the remaining estimated budget across the UTC day with a reserve; it cannot provide permanent worldwide ten-second live data. Old observations remain labelled and dimmed. Motion is projected for at most 15 seconds. Flight phases are estimates, routes are indicative, and commercial schedules are unavailable.

Satellite positions are **SGP4 calculations**, not live telemetry. Element epoch, age and fallback notices remain visible. Public catalogues are incomplete and providers can be unavailable. Sentinel-2 global imagery is approximately 10 m/pixel; Switzerland HD covers Switzerland only. No Google Earth level of detail is promised worldwide.

## Sources

OpenSky Network · ADS-B.lol · ADSBdb · CelesTrak · TLE API / Ivan Stanojevic · OurAirports · OpenStreetMap · EOX · swisstopo · NASA / GEBCO / Natural Earth.

See [third-party notices](THIRD_PARTY_NOTICES.md) for attribution and data-specific restrictions. EOX Sentinel-2 2025 imagery is for noncommercial use under CC BY-NC-SA 4.0; the Airview code licence does not replace provider licences.

## Development

Electron · JavaScript · Canvas · satellite.js · esbuild

```sh
npm ci
npm run prepare:assets
npm run build
npm test
npm start
```

Build the Windows package on Windows with `npm run package`. See [the guide](docs/USER_GUIDE.md), [performance notes](PERFORMANCE.md) and [contribution guidelines](CONTRIBUTING.md).

**By [Boyhood-D](https://github.com/Boyhood-D)** · Original code under the [MIT licence](LICENSE).

> Personal observation only. Never use Airview for navigation, aircraft separation or operational air traffic control.
