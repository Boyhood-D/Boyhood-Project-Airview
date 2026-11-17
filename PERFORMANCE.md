# Airview 2.1 — validation et performances

Carte 2D uniquement, Canvas, sans Three.js ni scène WebGL.

## Optimisations

- Fond de carte et grille mis en cache ; nouveau calcul uniquement au déplacement / changement des calques, ou une fois par minute pour le terminateur solaire.
- Textures globales reprojetées une fois en Mercator, largeur de travail plafonnée à 2048 pixels ; aucun téléchargement de tuiles à chaque déplacement.
- Sprites de silhouettes par catégorie / couleur / orientation mis en cache. Regroupement des avions en vue mondiale.
- Phases mémorisées par observation, avec invalidation au chargement des aéroports, changement d’observation ou passage à des données anciennes. Index géographique pour la proximité des aéroports.
- Métadonnées uniquement à la sélection, cache de 500 identifiants maximum ; annuaire local mondial et listes DOM bornées.
- SGP4 dans un Web Worker : positions à cinq secondes d’écart et interpolation visuelle. Une seule orbite sélectionnée à 181 points ; possibilité d’isoler le satellite choisi.
- Repos du dessin sans mouvement, arrêt de l’animation et des calculs orbitaux lorsque la page est masquée.
- Traînées limitées à 20 minutes / 120 points par appareil ; relecture bornée à 40 relevés et 120 000 rapports.
- Catalogue orbital en cache deux heures minimum ; trafic mondial à 120 secondes minimum et backoff HTTP.

## Validation

28 tests automatisés : les 22 tests de la version 2.0 et six tests de classification de phase, couvrant état au sol, données manquantes, vieillissement, proximité / élévation des aéroports, transition de décollage, transition d’atterrissage et variomètre dérivé. La référence Vallado vérifie également le calcul SGP4 à l’époque.

Essais visuels sur données publiques réelles : carte d’identité, phase expliquée, recherche par indicatif, ISS et projection de son orbite sur la carte 2D. Les limites de l’historique aéroport (HTTP 403 anonyme) sont affichées, sans inventer de tableau commercial.

Les FPS dépendent du matériel, du nombre de satellites affichés, du zoom et des autres applications. Aucune garantie de cadence universelle ni de couverture exhaustive des données. Les phases sont des estimations documentées, pas une donnée opérationnelle confirmée.
