# Airview 2.1 — tout sur la carte 2D

Radar mondial portable et gratuit pour Windows 10/11 x64. Carte 2D uniquement : le globe, les modèles 3D et Three.js ont été retirés. Aucun compte ni clé API, aucune souscription.

## Télécharger

Dans [Releases](https://github.com/Boyhood-D/Boyhood-Project-Airview/releases), télécharger **Airview-2.1.0-Windows-x64.zip**, extraire tout le ZIP, puis ouvrir **Airview.exe**. Vérifier l’empreinte SHA-256 fournie. L’exécutable n’est pas signé commercialement ; Windows peut afficher un avertissement d’origine. Internet est nécessaire pour les relevés récents.

## Carte et calques

- Carte mondiale et radar ATC d’observation ; zoom, déplacement, secteurs et navigation par coordonnées.
- Fonds au choix : carte épurée Natural Earth, imagerie NASA embarquée, relief coloré NASA/GEBCO. Le relief est une représentation 2D, sans géométrie 3D ni bâtiments. Les images globales sont rééchantillonnées et ne remplacent pas une carte de terrain détaillée.
- Cycle jour/nuit astronomique, grille, repères d’aéroport, labels, traînées observées et routes indicatives sélectionnées.
- Trafic OpenSky mondial par défaut. Source ADS-B.lol de proximité (250 NM) facultative. Couverture du réseau, jamais tous les aéronefs garantis.
- Satellites actifs publics CelesTrak et ISS : positions calculées par SGP4 dans un Worker, interpolation, trace orbitale projetée au sol à la sélection. Bouton pour isoler le satellite sélectionné et garder la carte lisible. La fiche indique l’altitude réelle calculée en kilomètres ; les symboles sont placés à leur latitude/longitude, sans représentation 3D.
- Annuaire mondial OurAirports : recherche par code, nom, ville ou pays. Les grands aéroports servent de repères sur la carte ; toute installation de l’annuaire peut être sélectionnée par recherche.

Le bouton **Calques** ouvre les options et le filtre de phase de vol. Les onglets **Avions / Satellites / Aéroports** utilisent le même champ de recherche. Une recherche de satellite ou d’aéroport ne filtre pas le trafic aérien affiché. Les listes sont plafonnées à 200 avions ou 150 résultats d’exploration pour limiter le DOM ; affiner la recherche pour retrouver les autres objets.

## Carte d’identité de chaque appareil

Cliquer sur un avion ouvre une fiche claire : indicatif reçu, adresse ICAO 24 bits, immatriculation, constructeur, modèle, propriétaire déclaré, pays associé à l’ICAO, phase estimée, altitude, vitesse, cap, variomètre, coordonnées, heure locale, squawk, source et ancienneté. Les compléments ADSBdb sont chargés uniquement à la sélection. Les champs inconnus restent explicitement non communiqués. Le pays de l’ICAO n’est pas une provenance du vol, et le propriétaire déclaré n’est pas nécessairement l’exploitant du vol actuel.

Silhouettes 2D par catégorie : avion de ligne, gros porteur, avion léger, hélicoptère, planeur et ballon. Ce sont des silhouettes indicatives, pas des livrées exactes. La catégorie ou le type peuvent manquer.

## Phases de vol : des estimations expliquées

La phase n’est pas un champ opérationnel confirmé par les sources publiques. Chaque fiche indique son raisonnement et distingue l’état au sol transmis des estimations :

- **Au sol / immobile** : état au sol et vitesse ≤ 3 kt. Sans vitesse, simplement « Au sol ».
- **Roulage probable / déplacement rapide au sol** : état au sol, vitesse supérieure à 3 kt ; aucune piste ni procédure confirmée.
- **Montée / descente** : variomètre au-delà de ±300 ft/min. À défaut, variation d’altitude entre deux observations espacées de 15 à 180 secondes, indiquée comme telle.
- **Vol stabilisé** : variomètre dans ±300 ft/min. **Croisière probable** seulement si altitude ≥ 18 000 ft et vitesse ≥ 200 kt ; cette règle n’identifie pas la mission réelle.
- **Approche probable** : descente, aérodrome à moins de 12 NM et altitude inférieure à 3 000 ft au-dessus de son élévation. Cette proximité ne confirme pas la destination. L’altitude barométrique et l’élévation peuvent différer ; cette estimation n’est pas une hauteur de navigation.
- **Décollage probable** : transition récente sol → vol, montée, aérodrome à moins de 3 NM, altitude inférieure à 2 000 ft au-dessus de son élévation.
- **Atterrissage probable** : transition récente vol → sol, vitesse supérieure à 20 kt et aérodrome à moins de 3 NM. Aucun atterrissage confirmé à partir du seul mouvement vertical.
- **Phase indéterminée / données anciennes** : mesures insuffisantes ou position âgée de plus de 90 secondes. Aucune croisière inventée à partir de la seule altitude.

Les phases sont visibles dans la liste et la fiche, filtrables dans les calques. Le filtre « Au sol » désactive le filtre « En vol uniquement ». En relecture, la phase est calculée à l’heure du relevé sélectionné. Les satellites restent explicitement calculés à l’heure actuelle, indépendamment de l’historique des avions.

## Suivi et données de vol

Suivi 2D, favoris, filtres d’altitude / vitesse / codes spéciaux, tri, thèmes nuit / phosphore / jour, unités métriques ou aviation, export CSV/JSON attribué, pause et relecture de la session. L’historique est limité à 40 relevés / 120 000 rapports, sans historique antérieur à l’ouverture. Les traînées conservent jusqu’à 120 positions par appareil sur 20 minutes.

Les routes ADSBdb sont indicatives : elles peuvent être anciennes et ne pas correspondre au vol actuel. Les pointillés dessinent une liaison géométrique, pas une trajectoire effectivement parcourue. L’ETA éventuelle utilise distance orthodromique / vitesse sol ; elle ignore vent, route et attentes. Heure réelle de départ, horaires commerciaux, retards et annulations non disponibles. Aucune base de routes n’est embarquée ni exportée.

Le panneau d’aéroport permet de demander les arrivées / départs observés J−1 UTC via OpenSky. Lors des essais, cet accès anonyme a renvoyé HTTP 403. Dans ce cas, Airview indique la limite et affiche l’activité observée en montée / descente à moins de 30 NM, sous 12 000 ft au-dessus de l’élévation de l’aéroport. L’aéroport réel n’est pas confirmé.

## Réseau et gratuité

OpenSky anonyme : environ 400 crédits/jour/IP, 4 par requête mondiale, soit environ 100 relevés quotidiens. Actualisation mondiale au minimum toutes les 120 secondes ; ce quota ne permet pas une journée entière de fonctionnement continu à cette cadence. Airview respecte les délais HTTP et indique les données anciennes. Extrapolation visuelle limitée à 15 secondes ; conservation grisée jusqu’à cinq minutes en cas d’interruption. Les valeurs anciennes ne sont pas présentées comme de nouvelles observations.

CelesTrak : catalogue actif public au plus toutes les deux heures, cache portable, attente de deux heures après une erreur. L’âge des éléments est indiqué. Les positions SGP4 sont des prédictions, pas de la télémétrie en direct. Aucun catalogue de débris ou objets classifiés exhaustif n’est promis.

Flightradar24 n’est pas connecté : son API officielle est payante. Aucun abonnement ni contournement. Les fonctions premium et la couverture des services commerciaux ne sont pas reproduites intégralement. Tous les composants et services utilisés ici restent gratuits dans leur accès public, soumis à leurs conditions et limites.

## Portable, confidentialité et performances

Préférences, catalogue orbital et cache technique dans **Airview-data**, à côté de l’exécutable. Historique des avions et compléments sélectionnés en mémoire, sauf export explicite. Aucun compte, télémétrie, installation système ni mise à jour automatique. Fermer Airview et supprimer son dossier retire l’application et ses données portables. Les appels HTTPS communiquent naturellement l’IP aux fournisseurs ; la sélection d’un avion communique son ICAO / indicatif à ADSBdb, et la consultation d’un historique communique le code d’aéroport à OpenSky.

Le rendu Canvas réutilise le fond et les sprites, regroupe les avions en vue mondiale, borne les traînées et met en cache les phases et les compléments. Les propagations orbitales s’effectuent hors du thread d’interface. Images globales rééchantillonnées localement, sans abonnement de tuiles ni CDN de code. Les animations et calculs s’arrêtent lorsque la fenêtre est masquée. Voir PERFORMANCE.md.

## Développer et compiler

Node.js récent ; Windows x64 pour produire le portable :

    npm ci
    npm run prepare:assets
    npm run build
    npm test
    npm run preview
    npm start
    npm run package

Le script de préparation télécharge les images NASA et l’annuaire OurAirports et enregistre les sources et SHA-256 dans assets/sources.json. Les bundles, images et annuaire générés ne sont pas versionnés ; ils sont embarqués dans le ZIP. Aucun workflow GitHub Actions payant requis : compilation locale. Sources et conditions dans THIRD_PARTY_NOTICES.md. Code Airview sous MIT.

**Loisir et observation personnelle uniquement. Aucun usage de navigation, contrôle aérien, séparation ou sécurité des vols.**
