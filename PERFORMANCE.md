# Airview 2.0 — performances et validation

Mesures locales du 17 novembre 2026, environnement de test Windows / navigateur intégré. Pas une garantie pour toutes les machines.

## Globe

Le paquet portable a également démarré sous Windows avec son sandbox actif ; le compteur a affiché 29 images/s sur plus de 10 000 appareils réels.

Environ 11 300 états réels OpenSky et 16 900 éléments orbitaux CelesTrak reçus pendant la vérification. Le compteur visible a affiché environ 28–29 images/s sur le réglage plafonné à 30, avec 3 à 8 appels de dessin GPU selon les calques et la sélection. Cette observation n’est ni un benchmark matériel universel ni une comparaison de performance avec Flightradar24.

- Aéronefs regroupés dans des InstancedMesh par catégorie ; une matrice par objet, sans composant DOM par appareil.
- Satellites rendus dans un seul nuage de points ; modèle symbolique uniquement pour l’objet sélectionné. SGP4 hors du thread d’interface, pas de calcul d’orbite pour tout le catalogue à chaque image.
- Deux positions orbitales à cinq secondes d’écart, interpolation visuelle et nouvelles propagations toutes les cinq secondes ; le calcul s’arrête lorsque la fenêtre est masquée.
- Géométrie terrestre fixe 384 × 192 ; déplacement recalculé uniquement au changement du relief. Texture jour 2048 pixels, DEM échantillonné dans une grille de lecture 1536 × 768.
- Échelle de pixels plafonnée à 1,5 (1 en économie). Plafonds 20/30/60 images/s. Le rendu s’arrête quand la page est masquée.
- Liste limitée à 120 résultats, recherche temporisée de 100 ms. Métadonnées chargées à la sélection et mises en cache en mémoire (500 clés au maximum).
- Traînées limitées à 20 minutes / 120 points par objet. Orbite de sélection à 181 points. Pas de milliers d’orbites simultanées.
- Relevés mémorisés pour le passage 2D/3D ; requêtes mondiales espacées de 120 secondes dans le globe, délais HTTP respectés. Catalogue orbital en cache deux heures minimum.

## Validation automatisée

22 tests : normalisation / valeurs manquantes, géométrie et antiméridien, filtres / export CSV, projection et interpolation 2D, bornage mémoire, quota HTTP 429, calcul solaire aux solstices, ETA inconnue à faible vitesse, catégories, référence Vallado SGP4 à l’époque, cache orbital, validation des identifiants réseau et compensation de l’horloge du PC.

## Limites

Le GPU, le pilote, le zoom et les applications concurrentes influencent la cadence. Les modèles sont symboliques. La latence et la couverture des sources gratuites ne sont pas des problèmes que le rendu peut corriger. Les historiques aéroport et les métadonnées peuvent rester indisponibles. Ne pas interpréter les prédictions visuelles comme une observation fraîche.

---

# Airview 1.1 — performances et validation

Mesures locales du 16 novembre 2026. Elles ne constituent pas une garantie sur toutes les machines.

## Tri CPU sur 10 000 appareils

`node tests/performance.bench.cjs` : jeu déterministe, graine 42, 9 passages, médiane.

- Tri initial : 13,571 ms ; 239 572 calculs de distance par tri.
- Distances mises en cache : 6,302 ms ; 10 000 calculs par tri.
- Gain sur cette opération : 2,15 fois. Ce chiffre ne mesure pas toute l’application.

## Rendu Windows natif, données synthétiques

Le banc `tests/browser-fixture.js` affiche un bandeau TEST SYNTHÉTIQUE ; il n’est pas inclus dans le paquet Windows. Le test porte sur 10 000 appareils synthétiques répartis sur le monde, mode radar et rendu logiciel.

Avant regroupement mondial : environ 25–28 FPS et 32–38 ms de dessin p95 observés. Après regroupement : environ 48 FPS et 3,6–3,9 ms de dessin p95 observés après échauffement. Les relevés proviennent du compteur visible de l’application, pas d’un échantillonnage de performance externe. Les autres applications et le système influencent les FPS.

Les cercles numérotés regroupent les appareils proches à faible zoom ; les données restent individuelles dans la liste. Cliquer zoome sur le groupe. Les appareils sélectionnés, favoris et codes spéciaux restent individuels. Le regroupement est désactivable.

## Autres changements

- Géométrie et mouvements préparés une fois par relevé ; sprites mis en cache.
- Réutilisation des formateurs numériques et réduction des reconstructions de panneaux.
- Lissage sur 900 ms entre relevés, projection bornée à 15 secondes.
- Repos du rendu en l’absence de mouvement ; fenêtre masquée : aucun dessin.
- Historique plafonné à 40 relevés et 120 000 rapports (le relevé courant est toujours conservé). Les snapshots ne dupliquent pas les objets du relevé.
- 14 tests automatisés réussis : y compris continuité à l’antiméridien, limites de projection, tri et bornage mémoire.

Les temps réseau et les quotas publics restent indépendants de ces optimisations. La version précédente a été vérifiée sur données ADS-B réelles ; les mesures graphiques comparatives de cette mise à jour utilisent exclusivement le banc synthétique explicitement identifié.
