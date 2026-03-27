# Keria — Formalisation des échanges avec le client

---

## Contexte

Ce document formalise les échanges réalisés avec le client (François Carrubba) tout au long du projet Keria. Chaque point est documenté avec les consignes retenues, les décisions prises et les actions qui en découlent.

Le client intervient avec une double posture :
- **Coach technique** : conseils sur la méthodologie, la gestion de projet et les livrables
- **Client/investisseur** : exigences fonctionnelles, challenges sur la pertinence du produit et la viabilité du projet

---

## Point 0 — Cadrage initial

**Date :** 28 novembre 2025
**Format :** Présentiel à l'école
**Posture client :** Coach

### Consignes retenues
- Mise en place de l'environnement de travail : Google Drive (Draft + Release), outil de suivi (Trello ou équivalent), roadmap
- Adopter une démarche entrepreneuriale : pitcher l'idée, démontrer sa viabilité
- Livrables Sprint 0 : vision produit, business model, business plan, étude de marché (SWOT, PESTEL, Porter), roadmap, backlog initial, équipe idéale, gestion des risques

### Décisions prises
- Utilisation de GitHub Projects comme outil de suivi (remplace Trello) — directement intégré au dépôt de code
- Roadmap matérialisée via les milestones GitHub
- Le développement suivra une approche itérative et incrémentale avec des sprints de 2 semaines

### Actions
- [x] Créer le dépôt GitHub et le Project Board
- [x] Rédiger le pitch et la vision produit
- [x] Réaliser l'étude de marché (SWOT, PESTEL, 5 forces de Porter)
- [x] Construire le business model canvas
- [x] Initialiser la roadmap

---

## Point 1 — Validation Sprint 0

**Date :** 1 février 2026
**Format :** Présentiel à l'école (Étape 1)
**Posture client :** Client/investisseur

### Présentation réalisée
- Pitch de 5 minutes sur le concept Keria : application de calcul du point de rencontre équitable
- Présentation du business model : modèle freemium avec offre Premium (filtres avancés, historique) et offre Business (événements entreprise)
- Étude de marché : positionnement face aux concurrents (Google Maps, Whatsapp localisation, MeetHalfway)
- Différenciateur clé : algorithme d'équité (fairnessScore) + système de vote collaboratif + événements multi-étapes

### Retours du client
- Le concept est pertinent et répond à un besoin réel non couvert par les solutions existantes
- Le business model freemium est cohérent mais la monétisation doit être approfondie pour l'étape finale
- Demande de préciser le périmètre du MVP : ne pas se disperser, se concentrer sur le flux principal (créer → rejoindre → calculer → voter → choisir)
- Suggestion d'ajouter la fonctionnalité événements multi-étapes pour élargir le marché cible (team building, rallyes)

### Décisions prises
- Le MVP inclura les événements multi-étapes (validé par le client)
- Priorité au flux MeetPoint complet avant de développer les événements
- Sprint 1 démarre immédiatement avec le setup technique et la création de MeetPoint

### Actions
- [x] Livrer les documents Sprint 0 sur le Drive partagé
- [x] Démarrer le Sprint 1 : infrastructure technique + MeetPoint de base
- [x] Préparer le story mapping et le backlog priorisé pour l'Étape 2

---

## Point 2 — Revue Sprint 1

**Date :** 14 février 2026
**Format :** Visioconférence
**Posture client :** Coach

### Démonstration
- Création d'un MeetPoint avec formulaire (nom, position, transport)
- Génération du code de partage à 6 caractères
- Rejoindre via /join avec le code
- Design system Keria : palette, typographie Space Grotesk, composants UI CVA

### Retours du client
- Le design est soigné et professionnel, bonne impression générale
- Le flux création → partage → rejoindre fonctionne bien
- Question sur la géolocalisation : que se passe-t-il si l'utilisateur refuse ? → Prévoir un fallback adresse manuelle
- Suggestion : ajouter un feedback visuel lors de la copie du code (confirmation "Copié !")

### Décisions prises
- Sprint 2 : implémenter géolocalisation + fallback adresse manuelle (Mapbox Geocoding)
- Ajouter la confirmation visuelle de copie du code
- La landing page sera développée en Sprint 2

### Actions
- [x] Implémenter le hook useGeolocation avec gestion des erreurs
- [x] Développer le composant AddressInput avec autocomplétion Mapbox
- [x] Créer la landing page avec animations Framer Motion

---

## Point 3 — Revue Sprint 2

**Date :** 28 février 2026
**Format :** Présentiel à l'école
**Posture client :** Client/investisseur

### Démonstration
- Géolocalisation fonctionnelle avec gestion des cas d'erreur (permission refusée, timeout)
- Saisie d'adresse manuelle avec autocomplétion Mapbox (suggestions en temps réel, debounce 300ms)
- 4 modes de transport sélectionnables (voiture, vélo, marche, transport en commun)
- Landing page cinématique avec animations et CTA

### Retours du client
- Fonctionnalité de géolocalisation satisfaisante, le fallback adresse est bien pensé
- La landing page est visuellement impressionnante — "ça fait professionnel"
- Question sur le calcul du point de rencontre : quand sera-t-il implémenté ? → Sprint 3
- Demande : le score d'équité doit être clairement visible et compréhensible pour l'utilisateur (pas juste un chiffre)
- Attente pour le prochain point : voir le midpoint fonctionner avec la carte

### Décisions prises
- Le fairnessScore sera affiché avec une jauge visuelle ou un badge coloré (vert/orange/rouge)
- Le calcul du midpoint utilisera une optimisation par grille pour minimiser les écarts de distance
- Intégration OpenRouteService pour les routes réelles (pas à vol d'oiseau)

### Actions
- [x] Développer le package @meetpoint/geo (haversine, midpoint, optimisation)
- [x] Intégrer la carte Mapbox avec marqueurs participants
- [x] Calculer et afficher les routes via OpenRouteService

---

## Point 4 — Revue Sprint 3

**Date :** 14 mars 2026
**Format :** Visioconférence
**Posture client :** Coach

### Démonstration
- Carte interactive Mapbox avec marqueurs colorés par participant
- Calcul du midpoint équitable avec fairnessScore affiché (badge coloré)
- Routes tracées sur la carte avec durée et distance par participant
- Statistiques : distance moyenne, score d'équité

### Retours du client
- Le midpoint et les routes fonctionnent très bien visuellement
- Le fairnessScore est compréhensible grâce au code couleur
- Question : comment choisir le lieu de rendez-vous concret une fois le midpoint calculé ? → Sprint 4, recherche de lieux + votes
- Suggestion : permettre de voir les lieux directement sur la carte, pas seulement en liste

### Décisions prises
- Sprint 4 : intégrer Google Places API pour les suggestions de lieux autour du midpoint
- Ajouter Overpass/OSM comme fallback si le quota Google Places est dépassé
- Système de votes up/down pour le choix collaboratif

### Actions
- [x] Intégrer Google Places API v1 pour la recherche de lieux
- [x] Développer le composant PlacesList avec photos, notes, catégories
- [x] Implémenter le système de votes en temps réel via Convex

---

## Point 5 — Revue Sprint 4 (Étape 2)

**Date :** 29 mars 2026
**Format :** Présentiel à l'école (Étape 2)
**Posture client :** Client/investisseur

### Démonstration
- Flux complet MeetPoint : créer → rejoindre → midpoint → rechercher lieux → voter → sélectionner
- Recherche contextuelle de lieux (café le matin, restaurant le midi, bar le soir)
- Votes up/down en temps réel avec classement
- Sélection du lieu final par le créateur

### Livrables présentés
- Story mapping complet (3 personas, 4 scénarios, 6 epics)
- Backlog priorisé avec 24 user stories et critères d'acceptation Gherkin
- Périmètre MVP défini (inclus/exclu)
- Sprint reviews, plannings et rétrospectives documentés
- GitHub Project Board avec milestones et suivi en temps réel

### Retours du client
- Le MVP MeetPoint est fonctionnel et convaincant
- La documentation projet est bien structurée et complète
- Les critères d'acceptation Gherkin montrent une rigueur méthodologique appréciée
- Demande pour la suite : livrer les événements multi-étapes (Sprint 5) et travailler la qualité technique (tests, CI/CD)

### Décisions prises
- Sprint 5 : développement complet des événements multi-étapes
- Sprint 6 : qualité technique (tests, CI/CD, error handling)
- Sprint 7 : polish UX (accessibilité, responsive, SEO, performance)
- Objectif livraison finale : 31 mai 2026

### Actions
- [x] Développer la création d'événements multi-étapes
- [x] Implémenter le système RSVP
- [ ] Préparer la présentation finale avec démonstration complète

---

## Synthèse de la relation client

### Évolution du projet à travers les échanges

| Point | Date | Apport principal du client |
|-------|------|---------------------------|
| Point 0 | 28 nov 2025 | Cadrage méthodologique, exigences livrables |
| Point 1 | 1 fév 2026 | Validation du concept, ajout des événements au MVP |
| Point 2 | 14 fév 2026 | Feedback UX (fallback géoloc, confirmation copie) |
| Point 3 | 28 fév 2026 | Exigence sur la lisibilité du fairnessScore |
| Point 4 | 14 mars 2026 | Orientation vers les lieux concrets + votes |
| Point 5 | 29 mars 2026 | Validation Étape 2, roadmap Sprint 5-7 |

### Ce que la relation client a apporté au projet

1. **Périmètre mieux défini** : le client a recentré le MVP sur le flux principal avant d'ajouter les événements
2. **UX améliorée** : le fallback géolocalisation et la lisibilité du fairnessScore sont des suggestions directes du client
3. **Rigueur méthodologique** : l'exigence de critères d'acceptation Gherkin et de sprint reviews documentées a structuré le processus
4. **Vision produit enrichie** : l'ajout des événements multi-étapes a élargi le marché cible et renforcé la proposition de valeur
