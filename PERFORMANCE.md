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
