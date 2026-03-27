# Keria — Perimetre du MVP

---

## Definition du MVP

Le Minimum Viable Product de Keria couvre les fonctionnalites essentielles permettant a un groupe de personnes de trouver un lieu de rencontre equitable et de planifier des evenements multi-etapes.

---

## Fonctionnalites incluses dans le MVP

### Core — MeetPoints
- Creation d'un MeetPoint avec nom, position du createur et mode de transport
- Generation et partage d'un code unique a 6 caracteres alphanumeriques
- Rejoindre un MeetPoint existant via un code de partage
- Geolocalisation automatique avec fallback saisie d'adresse manuelle (autocompletion Mapbox)
- Choix parmi 4 modes de transport (voiture, velo, marche, transport en commun)
- Calcul algorithmique du point de rencontre optimal (centre geographique spherique + optimisation par grille)
- Score d'equite (fairnessScore 0-100) base sur le coefficient de variation des distances
- Calcul et affichage des itineraires via OpenRouteService
- Carte interactive Mapbox avec marqueurs participants, midpoint et polylines des routes

### Core — Suggestions de lieux et votes
- Recherche de lieux a proximite du midpoint (Google Places API v1 + Overpass/OSM)
- Recherche contextuelle adaptee a l'heure (cafe le matin, restaurant le midi, bar le soir)
- Affichage detaille : nom, adresse, note, nombre d'avis, photos, categorie, niveau de prix
- Systeme de vote up/down en temps reel via Convex subscriptions
- Classement des lieux par score (upvotes - downvotes)
- Selection du lieu final par le createur

### Core — Evenements multi-etapes
- Creation d'evenement avec minimum 2 etapes
- Types d'etapes automatiques : depart, intermediaire, arrivee (calcule selon l'ordre chronologique)
- Saisie par etape : nom, adresse (autocompletion), date/heure, duree estimee
- Code de partage evenement : "E" + 5 caracteres alphanumeriques
- Rejoindre un evenement via code
- Systeme RSVP (Oui / Non / Peut-etre) avec compteurs mis a jour en temps reel
- Carte de l'itineraire avec chemin trace entre les etapes

### Interface et design
- Landing page cinematique avec animations Framer Motion
- Design system Keria coherent : palette 16 couleurs, typographie Space Grotesk, composants UI CVA
- Navigation hamburger avec overlay anime en plein ecran
- Responsive basique mobile-first
- Fond visuel immersif (image montagne + grain SVG + vignette radiale)

---

## Fonctionnalites exclues du MVP

| Fonctionnalite | Raison de l'exclusion | Sprint prevu |
|----------------|----------------------|--------------|
| Authentification utilisateur | Complexite technique, pas necessaire pour valider le concept | Sprint 3+ |
| Historique des rencontres | Necessite systeme d'authentification | Sprint 3+ |
| Notifications push | Necessite service worker + authentification | Sprint 3+ |
| Application mobile native | Hors scope PFE (focus application web) | Post-PFE |
| Mode hors ligne | Complexite cache + synchronisation | Post-PFE |
| Abonnement premium | Monetisation prematuree a ce stade | Post-PFE |
| Integration calendrier | Fonctionnalite secondaire | Sprint 3+ |
| Chat entre participants | Existe deja via WhatsApp/SMS | Post-PFE |
| Export PDF itineraire | Fonctionnalite secondaire | Sprint 3+ |
| Multi-langue (i18n) | Marche initial = France uniquement | Sprint 3+ |

---

## Criteres de validation du MVP

- [x] Un utilisateur peut creer un MeetPoint et obtenir un code de partage
- [x] Des participants peuvent rejoindre via code et partager leur position
- [x] Le midpoint equitable est calcule et affiche sur la carte interactive
- [x] Des lieux sont suggeres et les participants peuvent voter
- [x] Un evenement multi-etapes peut etre cree et gere avec systeme RSVP
- [x] L'application est deployee et accessible via un lien
- [x] Le design est coherent et l'experience utilisateur fluide
