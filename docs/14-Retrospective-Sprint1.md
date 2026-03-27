# Keria — Retrospective Sprint 1

---

**Date :** 29 mars 2026

---

## Ce qui a bien fonctionne

### Architecture monorepo
Turborepo + pnpm a permis une separation claire des responsabilites entre les packages (geo, types, ui, web, convex). Les packages partages evitent la duplication de code et garantissent la coherence des types a travers l'application.

### Convex comme backend
Le choix de Convex pour le backend serverless s'est avere excellent pour la productivite :
- Schema type-safe avec validateurs integres
- Temps reel natif via les subscriptions automatiques
- Aucune configuration serveur ni base de donnees a gerer
- Actions dediees pour les appels aux APIs externes (ORS, Google Places, Overpass)

### Design system defini des le depart
Definir la palette Keria et les composants UI (via CVA) des le Sprint 0 a permis une coherence visuelle constante tout au long du developpement. Chaque nouvelle page herite automatiquement du design sans effort supplementaire.

### TypeScript en mode strict
Le mode strict (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`) a prevenu de nombreux bugs potentiels. Le codebase maintient zero `any`, ce qui renforce la fiabilite.

### Framer Motion pour les animations
Les animations cinematiques (text-reveal, stagger, fade-in) conferent un aspect premium a l'application sans ajouter de complexite excessive au code.

---

## Ce qui peut etre ameliore

### Tests absents
Aucun test unitaire ni d'integration n'a ete ecrit durant le Sprint 1. Cette dette technique cree un risque de regression significatif lors des modifications futures.

### CI/CD non configure
L'absence de pipeline automatise signifie que les erreurs de lint, de format ou de build ne sont detectees que manuellement, ce qui ralentit le cycle de developpement.

### Accessibilite negligee
L'accessibilite (WCAG) n'a pas ete suffisamment priorisee : tres peu d'attributs aria, pas de textes sr-only, labels de formulaires non associes aux inputs. Cela impacte l'utilisabilite pour les personnes en situation de handicap.

### Documentation sprint tardive
Les documents de sprint (story mapping, backlog, review) n'ont pas ete maintenus en continu pendant le sprint, generant un effort de rattrapage en fin de periode.

### Pre-commit hooks
L'absence de husky et commitlint signifie que les conventional commits sont respectes uniquement par discipline personnelle, sans validation automatique.

---

## Actions pour le Sprint 2

| Action | Responsable | Echeance |
|--------|------------|----------|
| Mettre en place Vitest + premiers tests unitaires | Developpeur | Semaine 1 du Sprint 2 |
| Configurer CI/CD GitHub Actions | Developpeur | Semaine 1 du Sprint 2 |
| Installer husky + commitlint | Developpeur | Semaine 1 du Sprint 2 |
| Audit complet d'accessibilite | Developpeur | Semaine 2 du Sprint 2 |
| Sprint review bi-hebdomadaire | Developpeur | Continu |
| Documentation tenue a jour en continu | Developpeur | Continu |

---

## Metriques cles

| Metrique | Sprint 1 | Objectif Sprint 2 |
|----------|----------|-------------------|
| Stories completees | 16/16 | 8/8 |
| Story points | 70 | 19 |
| Couverture de tests | 0% | > 60% (packages) |
| Bugs en production | 0 | 0 |
| Build time | ~10s | < 15s |
| Score Lighthouse Performance | Non mesure | > 90 |
