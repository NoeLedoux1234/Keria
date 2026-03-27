# Keria — Sprint 1 Review

---

## Informations du sprint

| Élément | Détail |
|---------|--------|
| Sprint | Sprint 1 — Setup et MeetPoint de base |
| Période | 1 — 14 février 2026 |
| Durée | 2 semaines |
| Équipe | 1 développeur full-stack |
| Objectif | Poser les fondations techniques et livrer le flux de création/partage de MeetPoint |

---

## Stories complétées

| Issue | Story | Epic | Points | Statut |
|-------|-------|------|--------|--------|
| [#1](https://github.com/NoeLedoux1234/Keria/issues/1) | Créer un MeetPoint | EP01 | 5 | Done |
| [#2](https://github.com/NoeLedoux1234/Keria/issues/2) | Rejoindre par code | EP01 | 3 | Done |
| [#3](https://github.com/NoeLedoux1234/Keria/issues/3) | Partager le code | EP01 | 2 | Done |
| [#16](https://github.com/NoeLedoux1234/Keria/issues/16) | Design system Keria | EP06 | 5 | Done |
| **Total** | | | **15** | **4/4 Done** |

---

## Vélocité

**15 story points** réalisés en 2 semaines.

---

## Démonstration

1. Accueil avec design system Keria (palette, typographie Space Grotesk, composants UI CVA)
2. Formulaire de création de MeetPoint (nom + position créateur + transport)
3. Génération du code de partage à 6 caractères
4. Copie du code dans le presse-papier
5. Page /join : saisie du code → redirection vers le MeetPoint

---

## Réalisations techniques

- Initialisation monorepo Turborepo + pnpm (5 packages)
- Setup Next.js 15 (App Router) + React 19 + TypeScript 5.7
- Backend Convex : schema, table `meets`, table `participants`
- Package `@meetpoint/ui` : Button, Input, Card, Badge, Modal (CVA)
- Palette Keria (16 couleurs), typographie, animations de base
- Configuration ESLint, Prettier, TypeScript strict

---

## Obstacles rencontrés

1. **Intégration Convex avec Next.js** : gestion des références circulaires dans les types générés — résolu via `ignoreBuildErrors: true`
2. **Choix du design system** : hésitation entre shadcn/ui et custom CVA — choix de CVA pour un contrôle total sur la palette Keria

---

## Stories prévues Sprint 2

| Issue | Story | Points |
|-------|-------|--------|
| [#4](https://github.com/NoeLedoux1234/Keria/issues/4) | Rejoindre avec géolocalisation | 3 |
| [#5](https://github.com/NoeLedoux1234/Keria/issues/5) | Rejoindre avec adresse manuelle | 3 |
| [#6](https://github.com/NoeLedoux1234/Keria/issues/6) | Choisir un mode de transport | 2 |
| [#15](https://github.com/NoeLedoux1234/Keria/issues/15) | Landing page et navigation | 5 |
| **Total** | | **13** |
