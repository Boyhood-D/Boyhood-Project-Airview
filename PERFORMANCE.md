# Airview 2.2.1 validation and performance

## Individual aircraft

Numbered clusters are disabled unconditionally, including when migrating saved preferences. All matching received aircraft are drawn separately at every zoom. Symbols become smaller in wide views, orientation sprites remain cached, label collisions are managed and off-screen objects are skipped. The list limit does not limit map objects. No universal frame-rate claim is made.

## Orbital startup and recovery

Primary input is compressed CelesTrak OMM CSV. The parser validates identifiers, dates, mean motion and eccentricity; HTML error pages cannot be treated as a catalogue. It supports quoted fields and six-digit identifiers. A dated starter selection of 100 popular objects is bundled from TLE API / Ivan Stanojevic. It is limited coverage and is labelled as such. TLE records are converted to OMM while preserving epoch and orbital fields. The complete CelesTrak source remains preferred when reachable.

Fresh successful data are cached at least two hours. Server failures pause direct checks at least fifteen minutes; other refusals pause at least two hours. Persistent retry state survives restart and the frontend follows the returned cooldown. A valid starter/cache prevents an empty globe on first launch or during a provider outage. There is no promise of unlimited provider availability.

## Retained optimizations

Earth texture lighting runs in a dedicated worker at 448 × 448 pixels and is cached between orientation or minute changes. SGP4 runs in a separate worker every five seconds. Selected-only drawing is capped at 30 fps and full-catalogue drawing at 15 fps. Click targets are reused. Hidden views stop drawing and hidden windows suspend orbital work. Traffic requests pause while exploring Space.

The 2D map retains viewport-only tile requests, four-request concurrency, bounded image memory, portable HTTP caching and indexed airport lookup. Adaptive traffic budgets and the latest dated report persist. Motion extrapolation stops after 15 seconds. Old observations remain explicitly old.

## Verification

56 automated tests cover normalization, filters, exports, phases, projection, interpolation, reference SGP4 values, map caching, orbital geometry and occultation, startup, quota persistence, cross-midnight cooldown, CSV parsing, TLE conversion, offline starter availability and server-error backoff. The Windows portable is visually checked before publication. See the release notes for actual provider availability encountered during testing.

## 2.3.0 changes

Combined traffic uses a linear ICAO map to deduplicate two reports. It preserves source cooldowns instead of re-requesting cached observations, coalesces simultaneous combined calls, and expires combined observations after fifteen minutes. Background traffic polling pauses while the document is hidden. Rendering retains cached map surfaces, per-aircraft sprites, workers for SGP4 and Earth textures, viewport culling, bounded histories and 200 sidebar rows. UI transitions use opacity and transforms; reduced-motion preferences are respected.
