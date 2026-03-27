# Meetpoint (KERIA)

Application de calcul du lieu de rendez-vous optimal entre plusieurs personnes.

## Stack

- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Backend**: Convex (serverless, temps réel)
- **Styling**: Tailwind 3 + Framer Motion
- **Maps**: Mapbox GL + react-map-gl
- **APIs**: Google Places, OpenRouteService, Overpass/OSM
- **UI**: CVA + tailwind-merge + clsx (pas shadcn)

## Commands

```bash
pnpm dev              # Dev (turbo)
pnpm build            # Build (turbo)
pnpm lint             # Lint (turbo)
pnpm format           # Prettier write
pnpm format:check     # Prettier check
npx convex dev        # Convex dev server
```

## Structure

```
apps/web/              # Next.js App Router
├── app/               # Pages et routes
├── components/        # Composants (map/, event/, providers/)
└── hooks/             # Hooks custom (barrel export via index.ts)
packages/
├── geo/               # Calculs géo (midpoint, haversine, ORS)
├── types/             # Types TS partagés (Coordinates, Meet, Place)
├── ui/                # Composants UI (Button, Card, Input, Badge, Modal)
├── config-typescript/ # Configs TS partagées
└── config-eslint/     # Configs ESLint partagées
convex/                # Backend (schema, mutations, queries, actions)
```

## Coding patterns

### Imports

- Alias `@/` pour les chemins relatifs au projet
- Chemins relatifs `../../../convex/_generated/` pour Convex
- `import type` séparé pour les types
- Ordre: externes → internes → types

### Composants

- Fonctions nommées: `export default function PageName()` pour les pages
- Named exports: `export function ComponentName()` pour les composants
- Props: `interface FooProps {}` pour les composants publics, inline pour les sous-composants
- Sous-composants déclarés dans le même fichier si usage local

### Nommage

- **Fichiers**: kebab-case (`places-list.tsx`, `use-meet.ts`)
- **Composants**: PascalCase (`PlacesList`)
- **Variables/fonctions**: camelCase (`handleSubmit`)
- **Constantes**: UPPER_SNAKE_CASE (`CATEGORY_LABELS`)
- **Hooks**: `use*` prefix (`useMeet`, `usePlaces`)
- **Booléens**: `is*`, `can*`, `show*` prefix

### TypeScript

- Zero `any` — toujours typer explicitement
- `interface` pour les contrats (props, données)
- `type` pour les unions et aliases simples
- Types Convex: `Id<"table">`, `Doc<"table">` depuis `_generated/dataModel`
- Types partagés: `Coordinates`, `TransportMode` depuis `@meetpoint/types`

### Convex

- Validators: `v.string()`, `v.number()`, `v.optional()`, `v.union()`, `v.literal()`, `v.id("table")`
- Indexes sur toutes les requêtes fréquentes
- Permissions validées au début du handler
- Actions pour les appels API externes (Google Places, ORS)
- Internal actions/queries pour éviter les références circulaires

### Tailwind

- Palette Keria: `keria-dark`, `keria-darker`, `keria-forest`, `keria-cream`, `keria-gold`, `keria-gold-dark`, `keria-muted`
- `cn()` de `@meetpoint/ui` pour fusionner les classes
- CVA pour les variants de composants UI
- Mobile-first: `w-full sm:w-64`
- `gap-*` > `margin` pour l'espacement
- Opacité via `/` syntax: `border-keria-forest/30`

### State

- `useQuery` / `useMutation` / `useAction` de Convex pour les données serveur
- `useState` pour l'état local UI
- `useRef` pour debounce, DOM refs
- `"skip"` comme second arg de `useQuery` pour conditionner l'exécution
- Hooks custom retournent un objet `{ data, isLoading, actions }`

### Animations

- Framer Motion pour les transitions de pages et interactions
- Pattern: `initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}`
- `whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}` sur les boutons

### Erreurs

- État local: `const [error, setError] = useState<string | null>(null)`
- try/catch dans les handlers avec messages utilisateur
- Convex: `throw new Error("message")` pour les validations

## Prettier

- Semi: true
- Single quotes: false (double quotes)
- Tab width: 2
- Trailing comma: es5
- Print width: 100
- Plugin: prettier-plugin-tailwindcss

## Env vars

```
NEXT_PUBLIC_CONVEX_URL=     # Convex deployment URL
NEXT_PUBLIC_MAPBOX_TOKEN=   # Mapbox access token
GOOGLE_PLACES_API_KEY=      # Google Places (optionnel)
ORS_API_KEY=                # OpenRouteService (optionnel)
```
