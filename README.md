# Boyhood Radar

Une application Windows portable et gratuite pour explorer le trafic aérien public. Interface française, carte mondiale embarquée, ambiance radar et aucune clé API requise.

## Télécharger et démarrer

Dans **Releases**, télécharger `BoyhoodRadar-1.0.0-Windows-x64.zip`, extraire **tout** le ZIP puis ouvrir `BoyhoodRadar.exe` dans le dossier extrait. Windows 10/11 x64 ; connexion Internet nécessaire pour recevoir les avions. Aucune installation, aucun abonnement. L'exécutable n'est pas signé commercialement : Windows peut afficher un avertissement d'origine. Vérifier le SHA-256 fourni avant utilisation.

L'application crée `BoyhoodRadar-data` à côté de l'exécutable pour ses préférences et son cache Chromium. Extraire dans un dossier accessible en écriture. Pour désinstaller, fermer l'application et supprimer son dossier. Aucun enregistrement dans le registre, aucune télémétrie. L'historique de trafic reste en mémoire et disparaît à la fermeture, sauf export explicite.

## Ce qui fonctionne

- Carte mondiale Natural Earth intégrée, zoom à la molette, déplacement, navigation par coordonnées et 15 secteurs prédéfinis.
- Mode radar ATC d'observation, balayage optionnel et cercles de distance en milles nautiques.
- Données réelles ADS-B.lol sur 250 NM autour du centre de la vue ; alternative mondiale OpenSky.
- Indicatif, ICAO, position, altitude barométrique, vitesse sol, cap vrai, vitesse verticale, squawk ; immatriculation, modèle, Mach et mesures de vent/température si fournis par la source.
- Recherche multichamp, tri, altitude et vitesse, appareils en vol, codes spéciaux et filtre de visibilité.
- Sélection, suivi de l'appareil, favoris persistants, traînées de positions réellement reçues.
- Pause et relecture des 40 derniers relevés de la session. Pas d'historique antérieur au démarrage.
- Export CSV / JSON des appareils filtrés avec attribution et unités explicites.
- Thèmes nuit, phosphore, jour ; unités aviation ou métriques ; animations désactivables ; cadence 15/30/60 images/s.
- Application isolée : pas de Node dans l'interface, pas de navigation distante, pas d'automise à jour ni de code téléchargé à l'exécution.

## Comprendre les sources gratuites

**ADS-B.lol** : réseau communautaire, sans clé ; requête de proximité de rayon 250 NM ; une requête au plus toutes les 15 secondes dans cette application. Déplacer la carte change la zone demandée à la prochaine actualisation. La carte est mondiale mais la réception ADS-B.lol est sectorielle. La limite géographique de la requête est dessinée en pointillés.

**OpenSky Network** : états du réseau mondial, sans garantie de couverture exhaustive. Accès anonyme : 400 crédits quotidiens par IP ; une requête mondiale coûte 4 crédits, soit environ 100 relevés. Actualisation minimale de 60 secondes, résolution temporelle de la source de 10 secondes. Les quotas sont partagés au niveau de l'IP. Le fournisseur peut répondre 429 ou devenir indisponible ; l'application respecte les délais de reprise et conserve le dernier relevé avec son ancienneté. Les champs non fournis restent inconnus, jamais inventés.

La couverture dépend des récepteurs, de l'altitude, des pays et des politiques de chaque source. Les appareils sans position valide ou dont le dernier report dépasse 90 secondes ne sont pas affichés en direct. Une extrapolation visuelle, désactivable, utilise le cap et la vitesse pendant **15 secondes maximum** ; elle n'est pas une nouvelle mesure. Le petit cercle du vol sélectionné marque la position observée.

Les aéroports sont une sélection de repères, sans pistes ou procédures. Aucun horaire, itinéraire commercial, identité de passager, plan de vol ou séparation réglementaire n'est déduit. Le pays OpenSky est celui associé à l'adresse ICAO, pas une provenance du vol. Les couleurs classent l'altitude ; les codes 7500/7600/7700 sont les valeurs transpondeur reçues, non des alertes opérationnelles validées.

**Usage personnel d'observation. Ce logiciel n'est pas un système de contrôle aérien et ne doit jamais servir à la navigation ou à la sécurité des vols.** Les données restent soumises aux licences et conditions de leurs fournisseurs ; gratuit ne signifie pas disponibilité garantie.

## Raccourcis

| Touche | Action |
|---|---|
| `/` | Rechercher |
| Espace | Pause / retour au direct |
| R | Recentrer sur le secteur |
| F | Plein écran |
| + / − | Zoom |
| H | Aide |
| Échap | Fermer un panneau ou désélectionner |

## Développement et construction locale gratuite

Node.js récent (22+) et npm, puis :

```sh
npm ci
npm test
npm start
npm run package
```

La construction Windows x64 copie la distribution officielle Electron et assemble l'application dans `dist`. Elle ne demande pas de certificat commercial ou d'outil payant. Le script refuse d'écraser un paquet déjà existant. Aucun workflow GitHub Actions n'est activé : aucune consommation de minutes de compilation GitHub.

`npm run preview` ouvre un serveur de développement sur `127.0.0.1:4173/src/index.html`. Le serveur est un outil local de développement, pas requis par l'application portable. La version de développement dans un navigateur utilise son stockage local ; la version Electron utilise uniquement son dossier portable.

## Références

- https://www.adsb.lol/docs/open-data/api
- https://api.adsb.lol/docs
- https://openskynetwork.github.io/opensky-api/rest.html
- https://www.naturalearthdata.com/about/terms-of-use/
- Voir `THIRD_PARTY_NOTICES.md` pour les attributions.
