# Keria — Sprint 2 Planning

---

## Informations du sprint

| Élément | Détail |
|---------|--------|
| Sprint | Sprint 2 — Participants et géolocalisation |
| Période | 15 — 28 février 2026 |
| Durée | 2 semaines |
| Équipe | 1 développeur full-stack |
| Capacité estimée | 15 story points (basée sur vélocité Sprint 1) |

---

## Objectifs du sprint

1. Permettre aux participants de rejoindre un MeetPoint avec leur position GPS
2. Offrir une alternative de saisie d'adresse manuelle avec autocomplétion Mapbox
3. Implémenter les modes de transport pour le calcul de routes futur
4. Créer la landing page et la navigation de l'application

---

## Stories sélectionnées

| Issue | Story | Points | Priorité |
|-------|-------|--------|----------|
| [#4](https://github.com/NoeLedoux1234/Keria/issues/4) | Rejoindre avec géolocalisation | 3 | Must |
| [#5](https://github.com/NoeLedoux1234/Keria/issues/5) | Rejoindre avec adresse manuelle | 3 | Must |
| [#6](https://github.com/NoeLedoux1234/Keria/issues/6) | Choisir un mode de transport | 2 | Must |
| [#15](https://github.com/NoeLedoux1234/Keria/issues/15) | Landing page et navigation | 5 | Must |
| **Total** | | **13** | |

---

## Dépendances

- Sprint 1 terminé (MeetPoint fonctionnel, design system en place)
- Token Mapbox configuré pour le geocoding
- Hook `useGeolocation` à développer (wrapper navigator.geolocation)

---

## Definition of Done

- Code TypeScript compile sans erreur (`pnpm build`)
- Lint et format OK
- Critères d'acceptation Gherkin validés
- Fonctionnalité testée manuellement
