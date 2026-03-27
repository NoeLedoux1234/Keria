# Keria — Rétrospective Sprint 1

---

**Date :** 14 février 2026

---

## Ce qui a bien fonctionné

### Choix de Convex
Le backend serverless Convex s'est avéré très productif : schema type-safe, temps réel natif, zéro configuration serveur. Le développement du CRUD MeetPoint a pris moins de temps que prévu.

### Design system dès le Sprint 1
Investir du temps dans la palette Keria et les composants UI CVA dès le premier sprint permet d'avoir une cohérence visuelle immédiate pour tous les sprints suivants.

### Monorepo Turborepo
La structure en packages partagés (geo, types, ui) facilite la réutilisation et le typage cross-packages.

---

## Ce qui peut être amélioré

### Pas de tests dès le début
Le Sprint 1 s'est concentré sur les fonctionnalités sans écrire de tests. Il serait préférable d'introduire les tests plus tôt.

### Estimation des stories
La story US-16 (Design system) a été sous-estimée à 5 points — le setup initial de la palette, des fonts et des composants CVA a pris plus de temps que prévu.

---

## Actions pour le Sprint 2

| Action | Échéance |
|--------|----------|
| Intégrer le token Mapbox pour le geocoding | Début Sprint 2 |
| Créer le hook useGeolocation avant les pages join | Jour 1 |
| Tester la géoloc sur mobile réel (pas seulement devtools) | Mi-sprint |
