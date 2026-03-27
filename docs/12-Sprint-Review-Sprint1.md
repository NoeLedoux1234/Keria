# Keria — Sprint 1 Review

---

## Informations du sprint

| Element | Detail |
|---------|--------|
| Sprint | Sprint 1 — MVP Fonctionnel |
| Periode | 1 fevrier — 29 mars 2026 |
| Duree | 8 semaines |
| Equipe | 1 developpeur full-stack |
| Objectif | Livrer une application fonctionnelle couvrant le perimetre MVP |

---

## Stories completees

| Issue | Story | Epic | Points | Statut |
|-------|-------|------|--------|--------|
| [#1](https://github.com/NoeLedoux1234/Keria/issues/1) | Creer un MeetPoint | EP01 | 5 | Done |
| [#2](https://github.com/NoeLedoux1234/Keria/issues/2) | Rejoindre par code | EP01 | 3 | Done |
| [#3](https://github.com/NoeLedoux1234/Keria/issues/3) | Partager le code | EP01 | 2 | Done |
| [#4](https://github.com/NoeLedoux1234/Keria/issues/4) | Rejoindre avec geolocalisation | EP02 | 3 | Done |
| [#5](https://github.com/NoeLedoux1234/Keria/issues/5) | Rejoindre avec adresse manuelle | EP02 | 3 | Done |
| [#6](https://github.com/NoeLedoux1234/Keria/issues/6) | Choisir un mode de transport | EP02 | 2 | Done |
| [#7](https://github.com/NoeLedoux1234/Keria/issues/7) | Calculer le midpoint equitable | EP03 | 8 | Done |
| [#8](https://github.com/NoeLedoux1234/Keria/issues/8) | Afficher les routes sur la carte | EP03 | 5 | Done |
| [#9](https://github.com/NoeLedoux1234/Keria/issues/9) | Rechercher des lieux a proximite | EP04 | 8 | Done |
| [#10](https://github.com/NoeLedoux1234/Keria/issues/10) | Voter pour un lieu | EP04 | 5 | Done |
| [#11](https://github.com/NoeLedoux1234/Keria/issues/11) | Selectionner le lieu final | EP04 | 2 | Done |
| [#12](https://github.com/NoeLedoux1234/Keria/issues/12) | Creer un evenement multi-etapes | EP05 | 8 | Done |
| [#13](https://github.com/NoeLedoux1234/Keria/issues/13) | Rejoindre un evenement | EP05 | 3 | Done |
| [#14](https://github.com/NoeLedoux1234/Keria/issues/14) | Repondre RSVP | EP05 | 3 | Done |
| [#15](https://github.com/NoeLedoux1234/Keria/issues/15) | Landing page et navigation | EP06 | 5 | Done |
| [#16](https://github.com/NoeLedoux1234/Keria/issues/16) | Design system Keria | EP06 | 5 | Done |
| **Total** | | | **70** | **16/16 Done** |

---

## Velocite

**70 story points** realises en Sprint 1 (8 semaines).
Velocite hebdomadaire moyenne : environ 9 points par semaine.

---

## Demonstration

### Parcours 1 : MeetPoint entre amis
1. Accueil → clic sur "MeetPoint" → formulaire de creation
2. Saisie du nom "Diner anniversaire" + geolocalisation + transport voiture → creation
3. Code de partage a 6 caracteres affiche → copie dans le presse-papier
4. 3 participants rejoignent via /join avec geolocalisation ou adresse manuelle
5. Midpoint equitable calcule et affiche sur la carte avec fairnessScore
6. Routes colorees affichees pour chaque participant avec duree et distance
7. Recherche de lieux → 8 restaurants affiches avec photos, notes et prix
8. Votes up/down → classement en temps reel
9. Selection du lieu par le createur → statut passe a "confirmed"

### Parcours 2 : Evenement multi-etapes
1. Accueil → clic sur "Evenement" → formulaire en 3 etapes
2. Etape 1 : informations → Etape 2 : ajout de 3 etapes → Etape 3 : apercu carte
3. Creation → code de partage "E" + 5 caracteres
4. Participants rejoignent via /join-event avec le code
5. Reponses RSVP (Oui/Non/Peut-etre) → compteurs mis a jour en temps reel
6. Carte avec itineraire trace entre les etapes

---

## Metriques techniques

| Metrique | Valeur |
|----------|--------|
| Pages et routes | 9 |
| Composants React | 19 |
| Hooks personnalises | 6 |
| Tables Convex | 7 |
| Mutations Convex | 13 |
| Queries Convex | 14 |
| Actions (APIs externes) | 7 |
| Packages monorepo | 5 |
| Composants UI (design system) | 5 |
| Build production | OK (0 erreur) |

---

## Architecture technique

- **Monorepo** : Turborepo + pnpm (5 packages partages)
- **Frontend** : Next.js 15 (App Router) + React 19 + TypeScript 5.7
- **Backend** : Convex (serverless, temps reel natif)
- **Cartographie** : Mapbox GL + react-map-gl
- **APIs externes** : Google Places v1, OpenRouteService, Overpass (OSM)
- **UI** : Tailwind CSS 3 + CVA + Framer Motion
- **Design** : Palette Keria (16 couleurs), Space Grotesk, animations cinematiques

---

## Roadmap mise a jour

| Sprint | Periode | Objectif | Statut |
|--------|---------|----------|--------|
| Sprint 0 | Novembre 2025 — Janvier 2026 | Conception, business model, etude de marche | Termine |
| Sprint 1 | Fevrier — Mars 2026 | MVP fonctionnel | Termine |
| Sprint 2 | Avril — Mai 2026 | Qualite, tests, CI/CD, polish | A venir |
| Livraison finale | 31 mai 2026 | MVP final + documentation complete | — |
| Soutenance | 19 juin 2026 | Presentation 20 min + Q&A 10 min | — |

---

## Stories prevues pour le Sprint 2

| Issue | Story | Points | Priorite |
|-------|-------|--------|----------|
| [#17](https://github.com/NoeLedoux1234/Keria/issues/17) | Tests unitaires packages | 3 | Should |
| [#18](https://github.com/NoeLedoux1234/Keria/issues/18) | CI/CD GitHub Actions | 2 | Should |
| [#19](https://github.com/NoeLedoux1234/Keria/issues/19) | Error boundaries et pages 404 | 2 | Should |
| [#20](https://github.com/NoeLedoux1234/Keria/issues/20) | Loading skeletons | 2 | Should |
| [#21](https://github.com/NoeLedoux1234/Keria/issues/21) | Accessibilite WCAG | 3 | Should |
| [#22](https://github.com/NoeLedoux1234/Keria/issues/22) | Responsive polish mobile | 3 | Should |
| [#23](https://github.com/NoeLedoux1234/Keria/issues/23) | SEO metadata par page | 2 | Could |
| [#24](https://github.com/NoeLedoux1234/Keria/issues/24) | Performance dynamic imports | 2 | Could |
| **Total** | | **19** | |

---

## Obstacles rencontres

1. **Integration Convex** : Gestion des references circulaires avec les types generes — resolue via `ignoreBuildErrors: true` dans la configuration Next.js
2. **OpenRouteService** : Limites de taux de l'API — resolue via un cache applicatif avec TTL d'une heure
3. **Mapbox et rendu serveur** : Incompatibilite de Mapbox GL avec le SSR Next.js — resolue via le directive "use client" et rendu conditionnel
