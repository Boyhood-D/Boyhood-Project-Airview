# Sources et composants

## Electron / Chromium / Node.js

Electron 45.3.3 : https://github.com/electron/electron — MIT. La distribution conserve ses fichiers `LICENSE` et `LICENSES.chromium.html` avec l'ensemble des notices tierces de Chromium et des autres composants. Node.js et ses composants sont distribués avec leurs notices dans Electron.

## Carte

Natural Earth, `ne_110m_admin_0_countries.geojson`, téléchargé puis arrondi à trois décimales, limité aux géométries et noms, et compressé en `assets/world.geojson.gz`, depuis :
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson

Natural Earth est dans le domaine public. https://www.naturalearthdata.com/about/terms-of-use/
Cette carte généralisée ne convient pas à une navigation ou à une interprétation juridique des frontières.

## ADS-B.lol

Les données ADS-B.lol et les contributions de ses récepteurs sont fournies sous Open Database License (ODbL) 1.0 : https://opendatacommons.org/licenses/odbl/1-0/

Source : https://www.adsb.lol — API : https://www.adsb.lol/docs/open-data/api
Attribution visible dans l'application et dans les exports. L'application ne distribue pas un jeu de données aériennes préenregistré. La redistribution d'exports peut être soumise aux obligations de la licence de données.

## OpenSky Network

Source : The OpenSky Network, https://opensky-network.org
Documentation : https://openskynetwork.github.io/opensky-api/rest.html
L'accès aux données est soumis aux conditions d'utilisation et à l'autorisation du fournisseur. L'application vise l'observation personnelle non commerciale et n'accorde aucune sous-licence sur les données OpenSky.

## Code et graphismes de l'application

Code propre à Airview : MIT, voir LICENSE. Silhouette d'avion et éléments graphiques dessinés pour cette application. Les quelques coordonnées d'aéroports servent uniquement de repères géographiques.


## satellite.js et tz-lookup

satellite.js 7.2.0 (MIT), https://github.com/shashwatak/satellite-js ; tz-lookup 6.1.25 (CC0-1.0), https://github.com/darkskyapp/tz-lookup. Textes des licences inclus dans assets/licenses. Les bibliothèques sont compilées localement ; aucune exécution de scripts distants. esbuild 0.28.2 (MIT) est uniquement un outil de compilation.

## NASA : imagerie et élévation

Image terrestre NASA Blue Marble diffusée dans les exemples officiels Three.js : https://github.com/mrdoob/three.js/blob/master/examples/textures/planets/earth_atmos_2048.jpg. Élévation globale NASA / GEBCO, 5400 × 2700, 0–6400 m : https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/topography-bathymetry-maps/ ; imagerie par Jesse Allen, NASA Earth Observatory, données GEBCO / British Oceanographic Data Centre. Image téléchargée depuis assets.science.nasa.gov ; URL et SHA-256 dans assets/sources.json. Usage des images selon https://www.nasa.gov/nasa-brand-center/images-and-media/ ; aucun logo NASA, aucune affiliation ou approbation implicite. Les couleurs et projections sont adaptées localement dans Canvas 2D. Three.js ne fait plus partie du code de la version 2.1 ; son dépôt officiel reste la source de diffusion de l’image NASA utilisée.

## CelesTrak

https://celestrak.org/NORAD/documentation/gp-data-formats.php ; https://celestrak.org/usage-policy.php. Catalogue GP actif au format OMM JSON, téléchargé à l’exécution et mis en cache au minimum deux heures. En cas d’erreur, pas de nouvelles tentatives pendant deux heures. Aucun catalogue orbital ni base de données CelesTrak n’est embarqué dans la distribution. Gratuité d’accès, pas de déclaration de domaine public sur ces données. Le calcul SGP4 fournit une estimation, sensible à l’âge des éléments.

## OurAirports

https://ourairports.com/data/ — données dans le domaine public. Source airports.csv : https://github.com/davidmegginson/ourairports-data. Transformation en JSON, suppression des installations fermées et sélection de champs pour la recherche locale ; fichier préparé à la compilation et embarqué. Les informations peuvent être incomplètes ou anciennes.

## ADSBdb et routes indicatives

https://www.adsbdb.com ; documentation https://github.com/mrjackwills/adsbdb. Consultation personnelle d’un appareil et d’un callsign à la sélection ; cache de session en mémoire. Selon le fournisseur, les données de routes sont le travail de David Taylor (Edinburgh) et Jim Mason (Glasgow) et ne doivent pas être copiées, publiées ou incorporées dans une autre base sans leur autorisation explicite. Airview n’embarque, ne publie et n’exporte aucune base de routes. Les routes indicatives ne constituent pas une validation du vol actuel. Le code de la bibliothèque ou de l’API n’accorde pas une licence implicite sur toutes les données.

## Identité Airview 2.1.1

Le logo assets/logo.svg et son icône assets/icon.png sont des créations géométriques originales pour Airview, distribuées sous la licence MIT du projet. Ils ne représentent aucune affiliation avec NASA, OpenSky ou CelesTrak.
