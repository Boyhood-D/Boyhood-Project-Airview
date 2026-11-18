<p align="center"><img src="assets/logo.svg" width="88" alt="Logo Airview"></p>

<h1 align="center">Airview</h1>
<p align="center"><strong>Deux espaces pour explorer le ciel : les vols sur une carte, les satellites sur un globe.</strong><br>Application Windows portable · Interface française · Gratuite</p>
<p align="center"><a href="https://github.com/Boyhood-D/Boyhood-Project-Airview/releases/latest"><strong>Télécharger pour Windows</strong></a> · <a href="docs/USER_GUIDE.md">Guide complet</a> · <a href="CHANGELOG.md">Nouveautés</a> · <a href="https://github.com/Boyhood-D/Boyhood-Project-Airview/issues">Signaler un problème</a></p>

---

## Explorer le ciel

Airview est un poste d’observation pour les passionnés d’aviation et d’espace. Il rassemble des données publiques dans une interface sobre, avec des calques personnalisables et des informations dont les limites restent visibles.

| Aviation | Espace & cartographie |
| --- | --- |
| Trafic mondial reçu par OpenSky | Satellites actifs publics et ISS |
| Fiches d’identité et phases de vol estimées | Globe orientable, positions SGP4 et trajectoires orbitales |
| Suivi, favoris et traînées de session | Plan détaillé, satellite mondial et Suisse HD |
| Recherche mondiale d’aéroports | Cycle jour/nuit et calques indépendants |
| Filtres, relecture et exports CSV/JSON | Interface personnalisable et animations discrètes |

## Démarrer en trois étapes

1. Ouvrir la [dernière release](https://github.com/Boyhood-D/Boyhood-Project-Airview/releases/latest) et télécharger le ZIP Windows.
2. **Extraire tout le ZIP** dans un dossier accessible en écriture.
3. Lancer **Airview.exe**.

**Windows 10/11 x64** · Internet nécessaire aux données récentes · Aucun compte ni clé API requis.

Le fichier `.sha256` de la release permet de vérifier le téléchargement. L’application est non signée commercialement : Windows peut afficher un avertissement d’origine. Préférences et cache restent dans `Airview-data`, à côté du programme.

## Des données présentées avec transparence

La couverture dépend des réseaux publics et de leurs quotas : Airview ne garantit pas tous les vols. Les phases sont **estimées**, les routes **indicatives**, et les satellites **calculés** à partir d’éléments orbitaux. Les horaires commerciaux, retards et annulations ne sont pas fournis. Les limitations détaillées et les critères d’estimation sont documentés dans le [guide](docs/USER_GUIDE.md).

| Source | Usage |
| --- | --- |
| OpenSky Network / ADS-B.lol | Positions et mesures aériennes disponibles |
| ADSBdb | Identification complémentaire et routes indicatives |
| CelesTrak | Éléments orbitaux publics |
| OpenStreetMap / EOX / swisstopo | Fonds détaillés en ligne |
| NASA / GEBCO / Natural Earth | Imagerie, relief et fond de carte |
| OurAirports | Annuaire d’installations aéronautiques |

**Version 2.2.0** : navigation Vols / Espace, globe orbital avec jour/nuit, ISS et sélection isolée, interface simplifiée, introduction radar-avion et actualisation aérienne adaptative. Le budget des fournisseurs persiste après fermeture. La cadence peut être de plusieurs minutes ; les positions anciennes restent explicitement signalées.

L’imagerie mondiale Sentinel-2 (~10 m/pixel, mosaïque 2025) ne remplace pas la très haute résolution de Google Earth. Suisse HD couvre la Suisse ; hors de cette zone, choisir le plan ou le satellite mondial. Le calque EOX est réservé à un usage non commercial (CC BY-NC-SA 4.0).

Voir les [sources et licences](THIRD_PARTY_NOTICES.md). Aucun service payant n’est activé.

## Développement

Electron · JavaScript · Canvas 2D · satellite.js · esbuild

```sh
npm ci
npm run prepare:assets
npm run build
npm test
npm start
```

Compilation Windows : `npm run package`. Les fichiers générés sont préparés localement ; consulter le [guide de développement](docs/USER_GUIDE.md#développer-et-compiler) et les [notes de performance](PERFORMANCE.md).

## Participer

Un bug reproductible, une suggestion d’interface ou une amélioration de documentation ? Les [issues](https://github.com/Boyhood-D/Boyhood-Project-Airview/issues) et contributions sont les bienvenues. Lire [CONTRIBUTING.md](CONTRIBUTING.md) avant de proposer un changement.

**Projet porté par [Boyhood-D](https://github.com/Boyhood-D)** · Code sous [licence MIT](LICENSE).

> Airview est destiné au loisir et à l’observation personnelle. Aucun usage de navigation, de contrôle aérien ou de sécurité des vols.
