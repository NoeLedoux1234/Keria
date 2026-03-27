# Keria — Sprint 2 Planning

---

## Informations du sprint

| Element | Detail |
|---------|--------|
| Sprint | Sprint 2 — Qualite et Polish |
| Periode | 29 mars — 31 mai 2026 |
| Duree | 9 semaines |
| Equipe | 1 developpeur full-stack |
| Capacite estimee | 20 story points |

---

## Objectifs du sprint

1. **Qualite du code** : mise en place de tests unitaires et de validation automatisee
2. **Infrastructure** : pipeline CI/CD automatise et hooks pre-commit
3. **Experience utilisateur** : accessibilite WCAG, loading states, responsive mobile
4. **Performance** : dynamic imports, optimisation du chargement, SEO

---

## Stories selectionnees

### Priorite haute (Should)

| Issue | Story | Points | Description |
|-------|-------|--------|-------------|
| [#17](https://github.com/NoeLedoux1234/Keria/issues/17) | Tests unitaires | 3 | Setup Vitest, tests @meetpoint/geo (distance, midpoint) et @meetpoint/ui (Button, Input) |
| [#18](https://github.com/NoeLedoux1234/Keria/issues/18) | CI/CD GitHub Actions | 2 | Pipeline automatise : lint, format, build, test sur chaque push et pull request |
| [#19](https://github.com/NoeLedoux1234/Keria/issues/19) | Error boundaries | 2 | Pages error.tsx, not-found.tsx et global-error.tsx pour toutes les routes |
| [#20](https://github.com/NoeLedoux1234/Keria/issues/20) | Loading skeletons | 2 | Fichiers loading.tsx avec skeletons Keria pour chaque groupe de routes |
| [#21](https://github.com/NoeLedoux1234/Keria/issues/21) | Accessibilite WCAG | 3 | Attributs aria, textes sr-only, HTML semantique, labels, focus management |
| [#22](https://github.com/NoeLedoux1234/Keria/issues/22) | Responsive polish | 3 | Audit mobile 375px, breakpoints systematiques, sidebar adaptative |

### Priorite basse (Could)

| Issue | Story | Points | Description |
|-------|-------|--------|-------------|
| [#23](https://github.com/NoeLedoux1234/Keria/issues/23) | SEO metadata | 2 | Metadata dynamiques par page, balises Open Graph, layouts intermediaires |
| [#24](https://github.com/NoeLedoux1234/Keria/issues/24) | Performance | 2 | Dynamic imports pour la carte et PlacesList, optimisations useMemo |

**Total : 19 story points**

---

## Definition of Done (Sprint 2)

- Code TypeScript compile sans erreur (`pnpm build`)
- Tests unitaires passes (`pnpm test`)
- Lint et format OK (`pnpm lint`, `pnpm format:check`)
- Criteres d'acceptation Gherkin valides
- Code review passee
- Pipeline CI/CD au vert

---

## Risques identifies

| Risque | Impact | Mitigation |
|--------|--------|-----------|
| Tests Convex difficiles a mocker | Moyen | Prioriser les tests des packages purs (geo, ui) sans dependance Convex |
| Mapbox incompatible avec jsdom | Moyen | Exclure les composants carte des tests unitaires |
| Accessibilite impactant le design | Faible | Respecter la palette Keria pour les etats de focus |
