# Airview 2.0 — Earth & Orbit

Application Windows portable gratuite pour explorer le trafic aérien public et les orbites des satellites. Interface française, globe 3D local, carte 2D et radar ATC d’observation. Aucun abonnement, clé API ou compte requis.

## Télécharger

Dans [Releases](https://github.com/Boyhood-D/Boyhood-Project-Airview/releases), télécharger **Airview-2.0.0-Windows-x64.zip**, extraire **tout** le ZIP, puis ouvrir **Airview.exe**. Windows 10/11 x64. Internet nécessaire pour les données récentes. Le fichier SHA-256 permet de vérifier le téléchargement. Exécutable non signé commercialement : Windows peut afficher un avertissement d’origine.

## Explorer

- Globe Three.js avec imagerie NASA embarquée, fond épuré, altitude, grille et éclairage jour/nuit astronomique.
- Relief terrestre réellement déplacé avec le DEM NASA/GEBCO, résolution globale 8 km/pixel et géométrie simplifiée. Exagération réglable ×1 à ×15 ; aucune précision de terrain locale ni bâtiments.
- Relevés mondiaux OpenSky par défaut, sans découpage en secteurs. Couverture du réseau public, jamais tous les aéronefs garantis. Actualisation à 120 secondes, quotas et erreurs respectés.
- Modèles 3D symboliques : jet, gros porteur, petit avion, hélicoptère, planeur et ballon selon catégorie disponible. Métadonnées chargées uniquement à la sélection. Aucune livrée réelle ni identification exacte garantie.
- Sélection et caméra de suivi, traînée des positions observées pendant la session, route indicative en pointillés, vitesse, altitude, cap, variomètre, heure dans le fuseau local et ETA géométrique si une destination est connue.
- Catalogue CelesTrak des objets actifs publiés, ISS incluse ; positions SGP4 calculées dans un Web Worker, interpolation sur 5 secondes, orbite affichée à la sélection. Le catalogue ne comprend pas tous les débris ou objets classifiés. Éléments actualisés au plus toutes les deux heures, âge visible.
- Annuaire OurAirports mondial : aéroports, aérodromes, héliports et autres installations non fermées. Recherche par code, ville, pays ou nom. Seuls les grands aéroports sont affichés sur le globe pour limiter l’encombrement.
- Arrivées / départs historiques de la journée UTC précédente via OpenSky, sous réserve d’accès de la source. Ce sont des vols observés, pas un tableau commercial en temps réel.
- Calques indépendants, qualité 20/30/60 images/s, transitions désactivables, prise en compte du réglage de réduction des animations de Windows, pause du rendu et des calculs orbitaux lorsque la fenêtre est masquée.
- Mode 2D conservé : filtres, favoris, thèmes, tri, export CSV/JSON, relecture limitée à la session et source de proximité ADS-B.lol facultative.

Glisser pour tourner, molette pour zoomer, clic pour sélectionner, bouton maison pour retrouver la Terre, bouton ISS pour retrouver la station. La liste limite le DOM à 120 résultats ; préciser la recherche pour retrouver un autre objet. Les données complètes reçues restent présentes sur le globe.

## Données gratuites : limites explicites

OpenSky anonyme fournit environ 400 crédits/jour/IP ; une requête mondiale en consomme 4, soit environ 100 relevés quotidiens. Le quota est partagé par IP et peut évoluer. Un relevé toutes les deux minutes ne peut donc pas fonctionner toute la journée sans atteindre ce plafond. En cas de quota, Airview conserve le dernier relevé, indique son ancienneté et attend la reprise autorisée. Les coordonnées sont extrapolées pendant 15 secondes maximum, puis figées. Une navigation 2D/3D réutilise le relevé en mémoire au lieu de redemander immédiatement les données.

Les avions sans position et les reports dépassant 90 secondes à la date du relevé sont ignorés. Les types et immatriculations peuvent rester inconnus. Le pays associé à l’adresse ICAO n’est pas une provenance de vol. Les altitudes et silhouettes sont agrandies pour la lisibilité : ce n’est pas une scène à échelle intégralement réelle.

ADSBdb fournit des informations indicatives pour le callsign : la route peut être ancienne ou ne pas correspondre à l’appareil actuel. Elle ne confirme ni départ ni arrivée du vol présent. L’ETA = distance orthodromique restante / vitesse sol actuelle ; elle ignore route, attentes et météo. Heure réelle de départ, horaires programmés, retards et annulations restent indisponibles. Les routes sont affichées individuellement en mémoire ; aucune base de routes n’est embarquée ou redistribuée.

Flightradar24 est une référence d’ergonomie, pas une source connectée : son API officielle est payante. Aucun abonnement ni collecte contournant ses restrictions n’est utilisé. La couverture, l’historique et les fonctions premium de services commerciaux ne sont pas reproduits intégralement.

Les dates HTTP des sources permettent de compenser un décalage de l’horloge du PC pour les orbites et le cycle solaire, sans modifier Windows. À défaut, l’horloge du système est utilisée. Les positions orbitales sont des prédictions SGP4, pas des mesures télémétriques en direct.

## Portable et confidentialité

Les préférences, le cache Chromium et le catalogue orbital restent dans **Airview-data**, à côté du programme. Aucun compte, télémétrie, installation système ou mise à jour automatique. L’historique aérien et les métadonnées sélectionnées restent en mémoire, sauf export explicite dans la vue 2D. Fermer Airview et supprimer son dossier suffit à retirer l’application et ses données portables. Les appels HTTPS communiquent naturellement l’adresse IP aux fournisseurs ; la sélection d’un vol communique son ICAO/callsign à ADSBdb, et la consultation d’un historique communique le code d’aéroport à OpenSky.

Un pilote WebGL2 est nécessaire pour le globe. Si la 3D échoue, choisir la carte 2D. En cas de problème de pilote au démarrage, lancer Airview.exe avec l’argument --software-rendering pour utiliser le rendu logiciel, moins rapide. Le sandbox Chromium et l’isolation de l’interface restent activés.

## Développer et compiler gratuitement

Node.js récent et Windows x64 pour le paquet Windows :

    npm ci
    npm run prepare:assets
    npm run build
    npm test
    npm run preview
    npm start
    npm run package

Les images NASA et l’annuaire OurAirports sont préparés par le script, sans clé ni abonnement ; les URL et empreintes sont enregistrées dans assets/sources.json. Les fichiers générés (bundles, images et annuaire) ne sont pas versionnés. Le paquet Windows les embarque et fonctionne sans CDN de code. Conserver les notices de assets/licenses et celles d’Electron/Chromium. Les sources et conditions figurent dans THIRD_PARTY_NOTICES.md. Aucun workflow GitHub Actions payant n’est nécessaire : ce paquet a été compilé localement.

## Usage

Observation personnelle de loisir uniquement. Airview ne doit jamais servir au contrôle aérien, à la navigation ou à la sécurité des vols. Gratuit ne signifie ni disponibilité garantie ni droit illimité de redistribution des données. Code Airview sous MIT ; données selon les conditions de leurs fournisseurs.
