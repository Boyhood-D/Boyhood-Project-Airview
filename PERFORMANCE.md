# Airview 2.1.2 — validation et performances

Carte 2D uniquement, Canvas, sans Three.js ni scène WebGL.

## Correctif 2.1.1

La boucle satellite réutilise deux buffers (position orbitale et position écran), au lieu de créer de nouveaux tableaux pour chaque objet. La projection courante est obtenue une fois par dessin. Les valeurs des cibles de clic restent copiées, pour ne pas aliaser un buffer réutilisé. Les appels de dessin et le nombre de satellites affichés restent dépendants du calque activé.

La liste des avions ne remplace son HTML que si les valeurs affichées changent. Sa clé inclut la phase, les métadonnées, le thème et le mode, pour conserver des valeurs et couleurs correctes. La recherche est temporisée de 140 ms. Les phases anciennes ont une échéance explicite à 90 secondes. Les formateurs de nombres sont réutilisés.

Les animations de démarrage et de panneaux portent sur opacité et transformation. L’introduction ne dépend pas du réseau et possède une sortie de secours après 3,5 secondes visibles (garde de secours de 8 s pour l’IPC), en plus du bouton pour passer. Réduction des animations système et option de l’application respectées.

Aucun pourcentage d’accélération globale n’est revendiqué sans benchmark comparable. Les tests supplémentaires vérifient le buffer de projection, l’interpolation à l’antiméridien et la sortie du démarrage avec ou sans signal de disponibilité.

## Optimisations

- Fond de carte et grille mis en cache ; nouveau calcul uniquement au déplacement / changement des calques, ou une fois par minute pour le terminateur solaire.
- Textures globales reprojetées une fois en Mercator, largeur de travail plafonnée à 2048 pixels ; ces fonds embarqués ne téléchargent aucune tuile.
- Sprites de silhouettes par catégorie / couleur / orientation mis en cache. Regroupement des avions en vue mondiale.
- Phases mémorisées par observation, avec invalidation au chargement des aéroports, changement d’observation ou passage à des données anciennes. Index géographique pour la proximité des aéroports.
- Métadonnées uniquement à la sélection, cache de 500 identifiants maximum ; annuaire local mondial et listes DOM bornées.
- SGP4 dans un Web Worker : positions à cinq secondes d’écart et interpolation visuelle. Une seule orbite sélectionnée à 181 points ; possibilité d’isoler le satellite choisi.
- Repos du dessin sans mouvement, arrêt de l’animation et des calculs orbitaux lorsque la page est masquée.
- Traînées limitées à 20 minutes / 120 points par appareil ; relecture bornée à 40 relevés et 120 000 rapports.
- Catalogue orbital en cache deux heures minimum ; trafic mondial à 120 secondes minimum et backoff HTTP.

## Validation

41 tests automatisés, dont huit nouveaux contrôles cartographiques / démarrage : les 22 tests de la version 2.0 et six tests de classification de phase, couvrant état au sol, données manquantes, vieillissement, proximité / élévation des aéroports, transition de décollage, transition d’atterrissage et variomètre dérivé. La référence Vallado vérifie également le calcul SGP4 à l’époque.

Essais visuels sur données publiques réelles : carte d’identité, phase expliquée, recherche par indicatif, ISS et projection de son orbite sur la carte 2D. Les limites de l’historique aéroport (HTTP 403 anonyme) sont affichées, sans inventer de tableau commercial.

Les FPS dépendent du matériel, du nombre de satellites affichés, du zoom et des autres applications. Aucune garantie de cadence universelle ni de couverture exhaustive des données. Les phases sont des estimations documentées, pas une donnée opérationnelle confirmée.


## Correctif 2.1.2

Les cartes détaillées utilisent des tuiles de 256 pixels, uniquement à l’écran. Le cache de fond Canvas est conservé entre les images des avions. Quatre requêtes au maximum et 128 images décodées ; pas de chargement de zones voisines invisibles. Les requêtes attendent 160 ms après un mouvement de vue, la file suit la vue courante et les tuiles parentes déjà vues servent de transition. Les tuiles HTTP sont en cache portable au moins sept jours avec ETag / Last-Modified, et restent utilisables si la connexion échoue. Refus 403 : pause fournisseur de 24 heures ; 429 : pause au moins 60 secondes.

Les aérodromes sont indexés par cellules géographiques de 1°, puis filtrés selon le champ visible ; leur liste projetée est réutilisée tant que la vue ne change pas. Les labels sont espacés. La grille est limitée à l’étendue visible même à très fort zoom. Le balayage ATC et ses redessins continus ont été retirés.

Microbenchmark CPU local du tri de distance, 10 000 appareils synthétiques, médiane de neuf essais le 18 novembre 2026 : 15,302 ms pour le comparateur recalculant les distances contre 6,855 ms pour le tri indexé existant. Ce contrôle confirme une optimisation conservée ; il ne mesure ni une accélération globale de 2.1.2, ni la cadence du portable, ni la latence des fournisseurs.
