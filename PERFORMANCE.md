# Airview 2.2.0 — validation et performances

## Moteurs et ressources

La carte des vols conserve Canvas 2D et ses tuiles visibles mises en cache, avec quatre requêtes simultanées au maximum. L’espace orbital utilise une projection 3D orthographique calculée sans moteur WebGL supplémentaire : positions en latitude/longitude/altitude, caméra orbitale et occultation terrestre. Les orbites et les altitudes sont exprimées à l’échelle du rayon terrestre de 6 371 km.

La surface NASA éclairée jour/nuit est calculée dans un Worker à 448 × 448 pixels, indépendamment du dessin de l’interface. Elle est recalculée seulement si l’orientation ou la minute astronomique change. SGP4 reste dans un second Worker, toutes les cinq secondes. La sélection isolée est dessinée à 30 images/s au maximum ; le catalogue complet à 15 images/s. Les objets des cibles de clic sont réutilisés entre images. Aucun taux universel de fluidité n’est garanti.

La carte des vols ne se redessine pas et ne demande pas de nouveaux relevés pendant que l’utilisateur explore Espace. L’application masquée suspend les calculs orbitaux et les dessins. Les métadonnées des appareils restent chargées à la sélection ; les listes affichent au plus 200 avions ou 100 résultats orbitaux. Le cache cartographique, l’index des aéroports et les sprites de silhouettes sont conservés de 2.1.2.

## Budget réseau

Le budget aérien est persistant et tient compte de la source, du coût global, du quota restant, de la réserve de 5 % et du temps avant la prochaine journée UTC locale. La cadence augmente ou diminue selon cette estimation ; elle ne constitue pas un droit d’accès. Les réponses de quota plus basses et les délais HTTP s’imposent au budget local. Un délai fournisseur traversant minuit reste actif. Il n’y a aucune rotation d’IP, de comptes ou de sources pour contourner un refus.

Les anciennes positions ne sont extrapolées que 15 secondes ; elles restent consultables grises et datées jusqu’à 24 heures dans la session, avec une phase inconnue après vieillissement. Le catalogue orbital et la prochaine tentative CelesTrak sont en cache portable au moins deux heures. Aucun catalogue orbital n’est inclus au ZIP.

## Validation

51 tests automatisés réussis : normalisation aérienne, filtres et export, phases, projection et interpolation, références SGP4, sécurité des appels réseau, tuiles et cache, démarrage, géométrie du globe, altitude physique et occultation, réserve et planification du quota, persistance et temporisation traversant minuit. Essais d’interface sur données publiques réelles : catalogue de plus de 16 000 satellites, ISS sélectionnée et trajectoire, séparation des espaces et cycle jour/nuit. Le portable Windows est contrôlé avant publication.

Le dernier relevé par source est conservé dans deux fichiers de cache au maximum (pas de pile historique). Une relance restaure le relevé daté et respecte le délai existant, sans refaire de requête. Un test supplémentaire vérifie cette restauration sans consommation. Les services publics peuvent renvoyer des erreurs : un HTTP 500 CelesTrak a été rencontré lors du test Windows ; le globe reste utilisable et le catalogue déjà présent en cache sert de repli.
