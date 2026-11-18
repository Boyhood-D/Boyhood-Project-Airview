# Versions

## 2.1.2 — 18 novembre 2026

- Interface clarifiée, calques refermables, surfaces et fiches plus lisibles, meilleur espace pour les listes sur les petits écrans. Retrait du mode ATC décoratif. Animations brèves, focus clavier et réduction des mouvements respectés.
- Plan OpenStreetMap avec villes, rues et frontières jusqu’au zoom 19 ; satellite mondial Sentinel-2 cloudless 2025 EOX (niveau 14, ~10 m/pixel, usage non commercial) et photographies aériennes Suisse HD swisstopo jusqu’au niveau 20. Fonds embarqués conservés. Attribution et limite de résolution affichées.
- Chargement des seules tuiles visibles, quatre requêtes simultanées, temporisation des déplacements, réutilisation des tuiles déjà vues, mémoire de 128 images. Cache portable et requêtes conditionnelles ; arrêt des accès après refus fournisseur. Aucun téléchargement de régions hors ligne.
- Annuaire OurAirports actualisé : 72 705 installations non fermées. Index spatial, points et étiquettes sélectionnés selon le zoom ; petits aérodromes, hydroports et héliports inclus. Tous les points visibles au zoom 13, annuaire entièrement recherchable à chaque zoom. Les installations fermées ne sont pas incluses.
- Silhouette distincte pour les turbopropulseurs identifiés, gros-porteurs élargis, contour pour mieux distinguer les appareils sur les fonds clairs. Les modèles restent indicatifs et dépendent des métadonnées disponibles.
- Démarrage mesuré après affichage de la fenêtre, introduction visible au moins 1,1 s (statique si mouvements réduits), bouton pour passer et sortie de secours indépendante des données réseau.
- 41 tests automatisés : démarrage, coordonnées et antiméridien, niveaux de zoom, index d’aérodromes, validation réseau, dédoublonnage et persistance des tuiles, refus fournisseur, tests aviation et orbites conservés.


## 2.1.1 — 17 novembre 2026

Correctif de performance et de présentation : logo minimaliste original, écran de démarrage animé avec sortie automatique et bouton pour passer, réduction des animations respectée, interface plus compacte, transitions de sélection et de calques. Projection et interpolation orbitales avec buffers réutilisés ; formateurs numériques mémorisés ; suppression des reconstructions de liste sans changement visible ; recherche temporisée. Correction des phases anciennes, de la remise à zéro du filtre de phase et du cache de route lors d’un changement d’indicatif. 33 tests automatisés, dont projection réutilisable, antiméridien orbital et sécurité de sortie du démarrage.


## 2.1.0 — 17 novembre 2026

Carte 2D uniquement : retrait du globe et de Three.js. Satellites, ISS, traces orbitales projetées, fonds NASA / relief coloré et jour/nuit intégrés au radar 2D. Carte d’identité par aéronef, données inconnues explicites, phase estimée et raisonnement visibles, filtre par phase. Catégories de silhouettes 2D, recherche mondiale d’aéroports, historique soumis à l’accès OpenSky et activité proche en repli. Filtres, favoris, export et relecture conservés. Phases mises en cache et calculées à l’heure du relevé en relecture. Conservation grisée des positions anciennes jusqu’à cinq minutes, sans extrapolation au-delà de 15 secondes.


## 2.0.0 — 17 novembre 2026

Globe 3D, terrain NASA, imagerie / carte / relief, jour/nuit, satellites et ISS par SGP4 dans un Worker, orbites sélectionnées, trafic OpenSky mondial par défaut, modèles symboliques par catégorie, suivi caméra, métadonnées et routes indicatives, annuaire mondial OurAirports et historique aéroport sous réserve d’accès OpenSky. Activité observée à proximité lorsque l’historique aéroport est refusé. Contrôles de calques, qualité et animations. Cache des relevés entre les vues et catalogue orbital limité à une actualisation par deux heures. Fuseau civil local et correction d’horloge à partir des dates HTTPS. Sources gratuites et limites explicitées dans l’aide. La carte 2D de la 1.1 est conservée.

## 1.1.0

Optimisation du moteur 2D, regroupement mondial, animations lissées, diagnostics et données portables dans Airview-data.
