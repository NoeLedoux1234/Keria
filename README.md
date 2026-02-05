<div align="center">

# KERIA

**Le point de rencontre le plus juste.**

Keria calcule le lieu de rendez-vous optimal entre plusieurs personnes en prenant en compte la position, le mode de transport et le temps de trajet de chacun.

[![Next.js](https://img.shields.io/badge/Next.js_15-000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Convex-FF6B6B?logo=data:image/svg+xml;base64,&logoColor=white)](https://convex.dev/)
[![Mapbox](https://img.shields.io/badge/Mapbox-000?logo=mapbox&logoColor=white)](https://www.mapbox.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)

</div>

---

## Apercu

Keria resout un probleme simple : quand plusieurs personnes veulent se retrouver, ou est le point le plus equitable pour tout le monde ?

L'application calcule un **centroide geographique optimise**, propose des **lieux reels** (restaurants, cafes, bars...) autour de ce point, et permet aux participants de **voter** pour choisir le lieu final. Le tout en **temps reel**.

---

## Fonctionnalites

### Point de rencontre
- Calcul du point central optimal (centroide spherique)
- Score d'equite (0-100%) base sur l'ecart-type des distances
- Support multi-transport : voiture, velo, marche, transports en commun
- Partage via code unique (6 caracteres) ou lien direct

### Carte interactive
- Visualisation des participants avec marqueurs colores
- Affichage du point central calcule
- Trace des itineraires sur la carte
- Zoom automatique pour englober tous les participants

### Suggestions de lieux
- Recherche contextuelle selon l'heure (cafe le matin, restaurant le midi, bar le soir)
- Double source : Google Places API + OpenStreetMap (Overpass)
- Filtres par categorie, prix, ouverture, rayon
- Fiches detaillees avec avis, photos, horaires

### Systeme de vote
- Vote pour/contre les lieux suggeres
- Classement en temps reel
- Selection du lieu final par le createur

### Evenements multi-etapes
- Planification d'evenements avec plusieurs etapes (depart, intermediaire, arrivee)
- Systeme RSVP (oui, non, peut-etre)
- Horaires par etape

---

## Stack technique

| Couche | Technologie | Role |
|--------|-------------|------|
| Frontend | Next.js 15, React 19 | Application web (App Router) |
| Langage | TypeScript | Typage statique bout en bout |
| Style | Tailwind CSS | Design responsive |
| Backend | Convex | Base de donnees temps reel, serverless |
| Cartes | Mapbox GL | Rendu cartographique vectoriel |
| Itineraires | OpenRouteService | Calcul de trajets et isochrones |
| Lieux | Google Places + Overpass API | Recherche d'etablissements |
| Monorepo | Turborepo + pnpm | Gestion multi-packages |

---

## Architecture

```
keria/
├── apps/
│   └── web/                        # Application Next.js
│       ├── app/                    # Pages (App Router)
│       │   ├── page.tsx            # Accueil
│       │   ├── new/                # Creer un MeetPoint
│       │   ├── join/               # Rejoindre par code
│       │   ├── meet/[id]/          # Vue d'un MeetPoint
│       │   ├── event/new/          # Creer un evenement
│       │   └── event/[id]/         # Vue d'un evenement
│       ├── components/             # Composants React
│       │   ├── map/                # Carte, marqueurs, routes
│       │   ├── places-list.tsx     # Liste des lieux + votes
│       │   └── address-input.tsx   # Saisie d'adresse
│       └── hooks/                  # Hooks personnalises
│
├── packages/
│   ├── geo/                        # Calculs geographiques
│   │   ├── midpoint.ts             # Centroide, optimisation
│   │   ├── distance.ts             # Haversine, ecart-type
│   │   └── openroute.ts            # Integration ORS
│   ├── types/                      # Types partages
│   ├── ui/                         # Composants UI (button, card, modal...)
│   ├── config-typescript/          # Config TS partagee
│   └── config-eslint/              # Config ESLint partagee
│
├── convex/                         # Backend Convex
│   ├── schema.ts                   # Schema de la base de donnees
│   ├── meets.ts                    # CRUD MeetPoints
│   ├── participants.ts             # Gestion des participants
│   ├── places.ts                   # Lieux suggeres
│   ├── votes.ts                    # Systeme de votes
│   ├── events.ts                   # Evenements multi-etapes
│   ├── routing.ts                  # Calcul d'itineraires
│   ├── searchPlaces.ts             # Recherche Overpass
│   └── googlePlaces.ts             # Recherche Google Places
│
└── docs/                           # Documentation projet
```

---

## Installation

### Prerequis

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 9

### Mise en place

```bash
# Cloner le repo
git clone https://github.com/NoeLedoux1234/Keria.git
cd Keria

# Installer les dependances
pnpm install

# Copier les variables d'environnement
cp .env.example .env.local
```

Remplir `.env.local` avec vos cles API (voir la section suivante).

```bash
# Lancer Convex + Next.js
pnpm dev
```

L'application est accessible sur `http://localhost:3000`.

---

## Variables d'environnement

| Variable | Description | Ou l'obtenir |
|----------|-------------|--------------|
| `NEXT_PUBLIC_CONVEX_URL` | URL du deploiement Convex | `npx convex dev` (genere automatiquement) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Token d'acces Mapbox | [account.mapbox.com](https://account.mapbox.com/access-tokens/) |
| `ORS_API_KEY` | Cle API OpenRouteService | [openrouteservice.org](https://openrouteservice.org/dev/#/signup) |
| `GOOGLE_PLACES_API_KEY` | Cle API Google Places (optionnel) | [console.cloud.google.com](https://console.cloud.google.com/) |
| `CONVEX_DEPLOYMENT` | ID du deploiement Convex | `npx convex dev` (genere automatiquement) |

---

## Scripts

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Developement (Next.js + Convex) |
| `pnpm build` | Build de production |
| `pnpm lint` | Verification ESLint |
| `pnpm type-check` | Verification TypeScript |
| `pnpm format` | Formatage Prettier |
| `pnpm clean` | Nettoyage des builds |

---

## APIs externes

| Service | Usage | Tier gratuit |
|---------|-------|--------------|
| [Mapbox](https://www.mapbox.com/) | Cartes vectorielles interactives | 100K chargements/mois |
| [OpenRouteService](https://openrouteservice.org/) | Itineraires, isochrones | Illimite (open source) |
| [Google Places](https://developers.google.com/maps/documentation/places) | Recherche de lieux, avis, photos | 10K requetes/mois |
| [Overpass API](https://overpass-api.de/) | Donnees OpenStreetMap | Illimite (open source) |

---

## Licence

Projet de fin d'etudes -- 2026
