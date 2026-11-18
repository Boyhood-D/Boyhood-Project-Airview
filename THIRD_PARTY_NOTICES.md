# Third-party sources and notices

## Application and runtime

Original Airview code, logo, icon and symbolic artwork are MIT-licensed; see LICENSE. Electron 45.3.3 is MIT-licensed: https://github.com/electron/electron. Its distribution retains LICENSE, LICENSES.chromium.html and runtime third-party notices for Chromium, Node.js and their components. satellite.js 7.2.0 is MIT: https://github.com/shashwatak/satellite-js. tz-lookup 6.1.25 is CC0-1.0: https://github.com/darkskyapp/tz-lookup. Their licence texts are included in assets/licenses. esbuild 0.28.2 is an MIT-licensed build tool. No remote scripts run in the app.

## Natural Earth

Public-domain simplified country geometry is rounded, reduced to geometry/names and compressed in assets/world.geojson.gz. Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson. Terms: https://www.naturalearthdata.com/about/terms-of-use/. Generalized boundaries are unsuitable for legal interpretation or navigation.

## Aircraft data

ADS-B.lol and receiver contributions: https://www.adsb.lol; API https://www.adsb.lol/docs/open-data/api. Data use Open Database License 1.0: https://opendatacommons.org/licenses/odbl/1-0/. Attribution appears in the app and exports; redistribution can carry data-licence obligations.

The OpenSky Network: https://opensky-network.org; API documentation https://openskynetwork.github.io/opensky-api/rest.html. Access remains subject to provider terms and authorization. Airview targets personal noncommercial observation and grants no sublicence to OpenSky data. Anonymous quotas and response headers remain authoritative.

ADSBdb: https://www.adsbdb.com; documentation https://github.com/mrjackwills/adsbdb. Individual aircraft and callsign queries are made on selection and cached in session memory. Route information is the work of David Taylor (Edinburgh) and Jim Mason (Glasgow); the provider prohibits copying, publication or incorporation into another database without explicit permission. Airview does not bundle or export a route database. Routes are indicative and not confirmation of the current flight. A code licence does not automatically license all underlying data.

## Orbital elements

CelesTrak GP: https://celestrak.org/NORAD/documentation/gp-data-formats.php and https://celestrak.org/usage-policy.php. Airview requests compressed OMM CSV, caches successful data at least two hours and pauses requests after errors. HTTP 500/503 require at least fifteen minutes for server recovery. No domain rotation bypasses blocks. Free access is not a blanket public-domain declaration. SGP4 estimates depend on element age.

Independent TLE API by Ivan Stanojevic: https://tle.ivanstanojevic.me and https://github.com/ivanstan/tle-api, also listed at https://api.nasa.gov/ under TLE API. It serves CelesTrak-derived elements, updated daily. The dated starter file contains a limited selection of 100 popular records, converted from TLE to OMM for compatibility. Source, retrieval time and partial-catalogue status remain in the file. The starter and cached provider data are attributed data, not original Airview orbital measurements; the project MIT code licence does not replace applicable data terms. No NASA endorsement or operation of this third-party service is implied.

## Airport directory

OurAirports data are public domain: https://ourairports.com/data/ and https://github.com/davidmegginson/ourairports-data. Build preparation filters closed facilities and selects fields for local search. The bundled directory is not a guaranteed complete or current operational publication.

## NASA imagery and elevation

NASA Blue Marble Earth image redistributed through the official Three.js examples: https://github.com/mrdoob/three.js/blob/master/examples/textures/planets/earth_atmos_2048.jpg. Three.js is not an application dependency. Global elevation: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/topography-bathymetry-maps/; image by Jesse Allen, NASA Earth Observatory, data GEBCO / British Oceanographic Data Centre. Images are adapted for local colouring/projection. Build URLs and SHA-256 hashes appear in assets/sources.json. NASA imagery terms: https://www.nasa.gov/nasa-brand-center/images-and-media/. No NASA logo, affiliation or endorsement is claimed.

## Online basemaps

Map imagery remains subject to provider terms; the application MIT licence does not cover third-party tiles. No online map tiles are bundled in the source or release.

- OpenStreetMap: © OpenStreetMap contributors, ODbL data. https://www.openstreetmap.org/copyright and https://operations.osmfoundation.org/policies/tiles/. Official tile endpoint, identifying User-Agent, visible attribution, viewport-only requests, no prefetch, at least seven-day caching and conditional requests after expiration. Community service without an SLA.
- EOX::Maps / Sentinel-2 cloudless 2025: EOX IT Services GmbH, containing modified Copernicus Sentinel data 2025. https://maps.eox.at/ and https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml. CC BY-NC-SA 4.0: https://creativecommons.org/licenses/by-nc-sa/4.0/. Personal noncommercial use; annual imagery is not a live photograph.
- SWISSIMAGE: © swisstopo. https://www.swisstopo.admin.ch/en/swissimage-the-digital-colour-orthophotomosaic. XYZ documentation: https://docs.geo.admin.ch/visualize-data/xyz.html. Free access and fair-use terms: https://www.geo.admin.ch/en/general-terms-of-use-fsdi. Switzerland coverage only; availability and resolution vary.
