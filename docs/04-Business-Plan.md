# Keria — Business Plan

---

## Résumé Exécutif

Keria est une application web permettant de calculer le point de rencontre optimal entre plusieurs personnes et d'organiser des événements multi-étapes. Elle répond à un problème universel : organiser une rencontre équitable entre personnes géographiquement dispersées est chronophage et source de frustration.

La solution repose sur un algorithme de calcul du point central équitable, des suggestions de lieux qualifiées, et un système de vote collaboratif. Le modèle économique freemium propose une offre gratuite jusqu'à cinq participants, une offre Premium à 4.99 euros par mois, et une offre Business sur devis pour les entreprises.

L'objectif est de devenir la référence pour l'organisation de rencontres de groupe, en ciblant les quinze millions de personnes en France qui organisent régulièrement des sorties collectives.

---

## État d'Avancement

### Produit

Le MVP web est déployé et fonctionnel. L'algorithme de calcul du point équitable est opérationnel, intégrant les temps de trajet réels selon les modes de transport. Les suggestions de lieux sont alimentées par l'intégration Google Places, offrant photos, avis et informations pratiques. Le système de vote permet aux participants de choisir collectivement le lieu final. Le mode Événements est également opérationnel, permettant d'organiser des sorties multi-étapes avec système de réponse.

L'application mobile native reste à développer et constitue une priorité de la roadmap.

### Technologies

| Couche | Solution | Justification |
|--------|----------|---------------|
| Frontend | Next.js 15, React 19, TypeScript | Performance, maintenabilité |
| Backend | Convex | Temps réel natif, serverless |
| Cartographie | Mapbox GL | Qualité, SDK React |
| Routage | OpenRouteService | Gratuit, multi-modal |
| Places | Google Places API | Exhaustivité des données |

### Équipe Actuelle

Le développement est actuellement porté par un fondateur unique en phase MVP. Le recrutement est prévu en phase de croissance, avec comme priorités un développeur full-stack senior et un designer UX/UI.

---

## Objectifs à Douze Mois

### Validation Produit

Les objectifs de validation portent sur quatre indicateurs clés. L'adoption est mesurée par les utilisateurs actifs mensuels, avec une cible de mille. La rétention vise un taux de retour à un mois supérieur à trente pour cent. La satisfaction cible un Net Promoter Score supérieur à quarante. L'engagement est mesuré par le taux de complétion des sessions, avec un objectif supérieur à soixante pour cent.

### Développement Produit

Le premier trimestre est consacré aux optimisations UX pour améliorer l'expérience utilisateur. Le deuxième trimestre voit le lancement de l'application mobile et la mise en place de l'authentification utilisateurs. Le troisième trimestre apporte les notifications push et le système d'abonnement pour activer la monétisation.

### Développement Commercial

L'objectif commercial à douze mois est d'atteindre cent abonnés Premium et trois clients Business pilotes, démontrant la viabilité des deux segments de monétisation.

---

## Plan de Financement

### Besoin Initial : 30 000€

| Allocation | Montant | Détail |
|------------|---------|--------|
| Développement mobile | 15 000€ | Freelance senior, 6 mois mi-temps |
| Design UX/UI | 5 000€ | Refonte interface, charte graphique |
| Marketing | 5 000€ | Contenu, acquisition initiale |
| Infrastructure | 5 000€ | APIs, hébergement, marge |

### Sources de Financement

| Source | Montant | Probabilité |
|--------|---------|-------------|
| Autofinancement | 10 000€ | Certaine |
| Prêt d'honneur | 10 000€ | Élevée |
| Subvention (Bpifrance, Région) | 10 000€ | Moyenne |
| Love money | Variable | Selon réseau |

---

## Projections Financières

### Compte de Résultat Prévisionnel

| Ligne | Année 1 | Année 2 | Année 3 |
|-------|---------|---------|---------|
| **Chiffre d'affaires** | **25 000€** | **160 000€** | **700 000€** |
| Premium | 13 500€ | 90 000€ | 450 000€ |
| Business | 12 000€ | 72 000€ | 240 000€ |
| Partenariats | - | - | 10 000€ |
| **Charges** | **6 000€** | **120 000€** | **370 000€** |
| Infrastructure | 3 000€ | 15 000€ | 50 000€ |
| RH | - | 80 000€ | 200 000€ |
| Marketing | 2 000€ | 20 000€ | 100 000€ |
| Divers | 1 000€ | 5 000€ | 20 000€ |
| **Résultat net** | **19 000€** | **40 000€** | **330 000€** |

### Point Mort

Le point mort est atteint dès la première année grâce à une structure de coûts légère. L'absence de salaires en phase initiale et l'infrastructure serverless permettent de rester rentable avec des revenus modestes.

---

## Stratégie d'Acquisition

### Phase d'Amorçage

Les trois premiers mois s'appuient sur le réseau personnel avec sollicitation directe des premiers testeurs. Les réseaux sociaux servent à diffuser du contenu organique et des démonstrations du produit. La collecte de feedback intensive permet des itérations rapides. L'objectif est d'atteindre cinq cents utilisateurs et de valider le concept.

### Phase Communautés

Du quatrième au huitième mois, la stratégie cible les associations et clubs : partenariats avec des clubs moto, randonnée, sport. La présence dans les groupes en ligne se développe sur les forums, Discord et Facebook. Des collaborations avec des influenceurs locaux amplifient la visibilité. L'objectif est d'atteindre deux mille utilisateurs et de réaliser les premières conversions Premium.

### Phase Croissance

Du neuvième au douzième mois, la publicité payante démarre avec des campagnes ciblées sur Instagram et Google Ads. Le SEO s'appuie sur du content marketing et un blog. Un programme de parrainage stimule le referral. L'objectif est d'atteindre dix mille utilisateurs, cent abonnés Premium et trois clients Business.

---

## Analyse des Risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Entrée d'un concurrent majeur | Moyenne | Élevé | Accélération acquisition, différenciation |
| Absence de traction | Moyenne | Élevé | Pivot B2B si B2C insuffisant |
| Problèmes de scalabilité | Faible | Moyen | Architecture serverless éprouvée |
| Hausse coûts APIs | Moyenne | Moyen | Alternatives techniques identifiées |
| Difficultés recrutement | Moyenne | Moyen | Freelances, remote élargi |

---

## Scénarios de Sortie

### Acquisition Stratégique

À horizon cinq ans, un rachat par un acteur du secteur comme Doodle ou Tricount, ou par un géant technologique souhaitant enrichir son offre, représente un scénario plausible. La valorisation estimée se situe entre cinq et vingt millions d'euros selon la traction atteinte.

### Croissance Indépendante

Le scénario de croissance indépendante vise une position de leader sur le marché européen, avec une levée de fonds Série A et une expansion internationale. La valorisation estimée dépasse cinquante millions d'euros.

### Acqui-hire

Le scénario minimal consiste en une acquisition pour l'équipe technique et la propriété intellectuelle. La valorisation estimée se situe entre deux et cinq millions d'euros.

---

## Indicateurs de Suivi

Le pilotage de l'activité s'organise autour de six catégories d'indicateurs. L'acquisition suit les nouveaux utilisateurs quotidiennement. L'activation mesure le taux de création de rencontre chaque semaine. La rétention surveille les utilisateurs actifs mensuels et quotidiens sur base hebdomadaire. Les revenus suivent le MRR et les conversions mensuellement. La satisfaction évalue le NPS et les tickets support chaque mois. La performance technique assure un monitoring continu de l'uptime et des temps de réponse.
