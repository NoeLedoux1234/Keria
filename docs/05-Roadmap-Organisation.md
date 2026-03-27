# Keria — Roadmap et Organisation Opérationnelle

---

## Vision Produit

Keria ambitionne de devenir la plateforme de référence pour l'organisation de rencontres et d'événements de groupe, en proposant une solution complète allant du calcul du point de rencontre équitable à la coordination d'événements multi-étapes.

Cette vision se décline en phases progressives, chacune visant à consolider les acquis avant d'étendre le périmètre fonctionnel et géographique.

---

## Roadmap Produit

### Première Phase : Consolidation du MVP

Le premier trimestre 2026 est consacré à la consolidation du produit existant. L'optimisation des performances vise un temps de chargement inférieur à deux secondes. L'amélioration de l'expérience mobile doit atteindre un score Lighthouse supérieur à quatre-vingt-dix. Un système de feedback intégré permet la collecte des retours utilisateurs directement dans l'application. La mise en place de tests automatisés assure une couverture de code supérieure à quatre-vingts pour cent. La documentation technique facilite l'onboarding des futurs développeurs.

Les objectifs clés de cette phase sont d'atteindre cinq cents utilisateurs actifs, un taux de complétion des sessions supérieur à cinquante pour cent, et un Net Promoter Score supérieur à trente.

### Deuxième Phase : Croissance Fonctionnelle

Le deuxième trimestre 2026 marque le passage à l'échelle fonctionnelle. Le développement de l'application mobile native pour iOS et Android constitue la priorité absolue, utilisant React Native pour maximiser la réutilisation du code. L'authentification utilisateurs est déployée avec support email, Google et Apple. L'historique des rencontres permet la conservation et la réutilisation des sessions passées. Les notifications push assurent les rappels et mises à jour. Un mode hors ligne permet la consultation sans connexion.

Les objectifs clés sont d'atteindre deux mille utilisateurs actifs, cinquante téléchargements mobiles par semaine, et un taux de rétention à un mois supérieur à vingt-cinq pour cent.

### Troisième Phase : Monétisation

Le troisième trimestre 2026 active la monétisation. L'intégration Stripe met en place le système d'abonnement. L'offre Premium est déployée avec l'ensemble des fonctionnalités avancées. Un tableau de bord Business permet l'administration des équipes. L'export calendrier vers Google Calendar et iCal est disponible. Une API publique ouvre la voie aux intégrations tierces.

Les objectifs clés sont d'atteindre cent abonnés Premium, trois clients Business pilotes, et un revenu mensuel récurrent supérieur à mille euros.

### Quatrième Phase : Expansion

Le quatrième trimestre 2026 amorce l'expansion. L'authentification SSO entreprise supporte Microsoft 365 et Google Workspace. L'intégration Slack et Teams permet les commandes et notifications directement dans les outils de travail. Le module de partenariats établissements permet la mise en avant des lieux partenaires. Les analytics avancées fournissent des rapports d'usage détaillés. L'internationalisation démarre avec les versions anglaise, espagnole et allemande.

Les objectifs clés sont d'atteindre dix mille utilisateurs actifs, dix clients Business, et l'amorçage de l'expansion européenne.

### Cinquième Phase : Maturité

L'année 2027 vise la maturité du produit. L'intelligence artificielle apporte des suggestions de lieux personnalisées basées sur l'historique et les préférences. Une marketplace partenaires intègre les réservations directement dans l'application. La commercialisation de données de mobilité agrégées ouvre un nouveau flux de revenus B2B. La certification sécurité ISO 27001 renforce la crédibilité auprès des grands comptes.

---

## Suivi des Sprints

### Sprint 0 — Conception (Novembre 2025 — Janvier 2026) — TERMINÉ
- Vision produit et pitch
- Business model canvas
- Étude de marché (SWOT, PESTEL, 5 forces de Porter)
- Business plan et roadmap initiale
- [Milestone GitHub](https://github.com/NoeLedoux1234/Keria/milestone/1)

### Sprint 1 — Setup et MeetPoint de base (1-14 février 2026) — TERMINÉ
- 4 stories, 15 points : création MeetPoint, rejoindre par code, partage, design system
- Setup monorepo Turborepo + Next.js 15 + Convex + Tailwind
- [Milestone GitHub](https://github.com/NoeLedoux1234/Keria/milestone/5)

### Sprint 2 — Participants et géolocalisation (15-28 février 2026) — TERMINÉ
- 4 stories, 13 points : géolocalisation, adresse Mapbox, modes transport, landing page
- Hook useGeolocation, composant AddressInput
- [Milestone GitHub](https://github.com/NoeLedoux1234/Keria/milestone/6)

### Sprint 3 — Carte et calcul du midpoint (1-14 mars 2026) — TERMINÉ
- 2 stories, 13 points : algorithme midpoint équitable, routes OpenRouteService
- Package @meetpoint/geo, carte Mapbox interactive
- [Milestone GitHub](https://github.com/NoeLedoux1234/Keria/milestone/7)

### Sprint 4 — Recherche de lieux et votes (15-28 mars 2026) — TERMINÉ
- 3 stories, 15 points : Google Places, Overpass/OSM, votes up/down temps réel
- Composant PlacesList, système de ranking
- [Milestone GitHub](https://github.com/NoeLedoux1234/Keria/milestone/8)

### Sprint 5 — Événements multi-étapes (29 mars — 11 avril 2026) — TERMINÉ
- 3 stories, 14 points : création événement, étapes, RSVP
- Formulaire multi-étapes, carte itinéraire
- [Milestone GitHub](https://github.com/NoeLedoux1234/Keria/milestone/9)

### Sprint 6 — Qualité et tests (12-25 avril 2026) — TERMINÉ
- 4 stories, 8 points : Vitest, CI/CD, error boundaries, loading skeletons
- Husky + commitlint, GitHub Actions
- [Milestone GitHub](https://github.com/NoeLedoux1234/Keria/milestone/10)

### Sprint 7 — UX Polish et finalisation (26 avril — 31 mai 2026) — EN COURS
- 4 stories, 10 points : accessibilité, responsive, SEO, performance
- [Milestone GitHub](https://github.com/NoeLedoux1234/Keria/milestone/11)

### Jalons à venir
| Date | Jalon |
|------|-------|
| 31 mai 2026 | Livraison MVP final + documentation complète |
| 12 juin 2026 | Remise des livrables au jury |
| 19 juin 2026 | Soutenance (20 min présentation + 10 min Q&A) |

---

## Organisation Opérationnelle

### Structure Actuelle

En phase MVP, l'organisation repose sur un fondateur unique assumant l'ensemble des fonctions : développement full-stack, architecture technique, design produit, acquisition utilisateurs et support client.

Cette structure présente des avantages significatifs : agilité maximale dans les décisions, coûts parfaitement maîtrisés, vision produit unifiée sans friction de communication.

Elle comporte également des limites identifiées : capacité de production contrainte par le temps disponible, risque d'épuisement, absence d'expertises spécialisées notamment en design et marketing.

### Structure Cible en Deuxième Année

La structure évolue pour soutenir la croissance. Le fondateur prend le rôle de CEO, focalisé sur la vision, la stratégie et la levée de fonds.

Un Tech Lead prend en charge l'architecture technique, le code review et le recrutement des développeurs. Un Product Manager gère la roadmap produit, la recherche utilisateur et la priorisation. Un responsable Growth pilote le marketing, les partenariats et les ventes B2B.

Deux développeurs renforcent l'équipe technique pour le frontend, le backend et le mobile.

### Structure Cible en Troisième Année

L'organisation se structure en pôles. Le CTO dirige une équipe technique de cinq personnes couvrant backend, frontend, mobile, DevOps et assurance qualité. Le CPO supervise le produit avec un Product Manager et un Designer. Le CMO pilote le marketing avec trois personnes en charge du growth, du contenu et des partenariats. Un CFO à temps partiel assure la gestion financière, comptable et juridique.

---

## Processus Opérationnels

### Développement

Le développement s'organise en sprints de deux semaines, rythmés par un planning en début de cycle et une rétrospective en fin de cycle. Chaque modification de code fait l'objet d'une revue obligatoire avant fusion. Le déploiement est automatisé via GitHub Actions, permettant des mises en production fréquentes et sécurisées. Le monitoring assure des alertes temps réel sur l'uptime, les erreurs et les performances. La documentation technique est maintenue à jour en continu.

### Produit

La discovery produit s'appuie sur des interviews utilisateurs bimensuelles. La priorisation utilise le framework RICE combinant portée, impact, confiance et effort. Les feature flags permettent un déploiement progressif des nouvelles fonctionnalités. L'A/B testing valide les hypothèses par l'expérimentation. Les analytics via Mixpanel ou Amplitude assurent le suivi des métriques produit.

### Support

Le support s'organise autour d'un triage pour classifier et prioriser les tickets. Les SLA définissent des temps de réponse différenciés : moins de vingt-quatre heures pour les utilisateurs gratuits, moins de quatre heures pour les Premium, moins d'une heure pour les Business. Une procédure d'escalade traite les cas critiques. Une base de connaissances documente les questions fréquentes. Une boucle de feedback remonte les retours vers l'équipe produit.

---

## Infrastructure Technique

### Architecture

L'architecture s'organise en couches. Les clients accèdent au service via le web en Progressive Web App, et bientôt via les applications iOS et Android.

Le CDN Vercel distribue les assets statiques, assure le rendu côté serveur et exécute les fonctions edge pour une latence minimale.

Le backend Convex gère les queries, mutations, actions et subscriptions, offrant une synchronisation temps réel native entre tous les clients connectés.

La base de données Convex stocke les documents avec indexation automatique et synchronisation temps réel.

Les APIs externes enrichissent le service : Mapbox pour la cartographie, Google Places pour les lieux, OpenRouteService pour le routage, Stripe pour les paiements.

### Scalabilité

Chaque composant est conçu pour monter en charge. Le frontend bénéficie du CDN global et du edge rendering de Vercel. Le backend Convex assure un auto-scaling serverless transparent. La base de données gère le sharding automatiquement. Les appels aux APIs externes sont protégés par du rate limiting, du caching et des fallbacks vers des alternatives.

---

## Gestion des Risques Opérationnels

L'indisponibilité de Convex présente une probabilité faible mais un impact élevé. La mitigation prévoit un mode dégradé avec cache local permettant de consulter les données récentes.

Le dépassement des quotas APIs présente une probabilité moyenne avec un impact moyen. Le monitoring et les alertes permettent d'anticiper, et des alternatives sont prêtes à être activées.

Une faille de sécurité présente une probabilité faible mais un impact élevé. Des audits réguliers et un programme de bug bounty assurent la détection précoce.

La perte de données présente une probabilité faible mais un impact élevé. Les backups automatiques et un plan de reprise d'activité garantissent la récupération.

La surcharge du support présente une probabilité moyenne avec un impact moyen. L'automatisation, un chatbot et une FAQ exhaustive absorbent les demandes récurrentes.

---

## Indicateurs Opérationnels

| Catégorie | Indicateur | Cible |
|-----------|------------|-------|
| Disponibilité | Uptime | > 99.9% |
| Performance | Temps de réponse P95 | < 200ms |
| Qualité | Taux d'erreur | < 0.1% |
| Sécurité | Incidents critiques | 0 |
| Support | Satisfaction client | > 90% |
| Développement | Vélocité sprint | Stable |

---

## Jalons Clés

| Date | Jalon | Critère de succès |
|------|-------|-------------------|
| T1 2026 | MVP consolidé | 500 MAU, NPS > 30 |
| T2 2026 | App mobile lancée | 1 000 téléchargements |
| T3 2026 | Monétisation active | 100 abonnés Premium |
| T4 2026 | Expansion B2B | 10 clients Business |
| T1 2027 | Série A | Levée de fonds réalisée |
| T4 2027 | Leader France | 100 000 MAU |
