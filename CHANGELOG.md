# Versions

## 2.1.1 — 17 novembre 2026

Correctif de performance et de présentation : logo minimaliste original, écran de démarrage animé avec sortie automatique et bouton pour passer, réduction des animations respectée, interface plus compacte, transitions de sélection et de calques. Projection et interpolation orbitales avec buffers réutilisés ; formateurs numériques mémorisés ; suppression des reconstructions de liste sans changement visible ; recherche temporisée. Correction des phases anciennes, de la remise à zéro du filtre de phase et du cache de route lors d’un changement d’indicatif. 33 tests automatisés, dont projection réutilisable, antiméridien orbital et sécurité de sortie du démarrage.


## 2.1.0 — 17 novembre 2026

Carte 2D uniquement : retrait du globe et de Three.js. Satellites, ISS, traces orbitales projetées, fonds NASA / relief coloré et jour/nuit intégrés au radar 2D. Carte d’identité par aéronef, données inconnues explicites, phase estimée et raisonnement visibles, filtre par phase. Catégories de silhouettes 2D, recherche mondiale d’aéroports, historique soumis à l’accès OpenSky et activité proche en repli. Filtres, favoris, export et relecture conservés. Phases mises en cache et calculées à l’heure du relevé en relecture. Conservation grisée des positions anciennes jusqu’à cinq minutes, sans extrapolation au-delà de 15 secondes.


## 2.0.0 — 17 novembre 2026

Globe 3D, terrain NASA, imagerie / carte / relief, jour/nuit, satellites et ISS par SGP4 dans un Worker, orbites sélectionnées, trafic OpenSky mondial par défaut, modèles symboliques par catégorie, suivi caméra, métadonnées et routes indicatives, annuaire mondial OurAirports et historique aéroport sous réserve d’accès OpenSky. Activité observée à proximité lorsque l’historique aéroport est refusé. Contrôles de calques, qualité et animations. Cache des relevés entre les vues et catalogue orbital limité à une actualisation par deux heures. Fuseau civil local et correction d’horloge à partir des dates HTTPS. Sources gratuites et limites explicitées dans l’aide. La carte 2D de la 1.1 est conservée.

## 1.1.0

Optimisation du moteur 2D, regroupement mondial, animations lissées, diagnostics et données portables dans Airview-data.
