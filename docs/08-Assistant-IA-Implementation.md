# Plan: Assistant IA pour Préférences de Rencontre

## Résumé

Ajouter une fonctionnalité d'assistant IA qui permet aux utilisateurs de décrire leurs envies en langage naturel pour trouver un point de rencontre qui ne soit pas seulement équitable géométriquement, mais qui corresponde à leurs préférences.

**Exemples d'usage :**
- "Je veux retrouver mon ami dans une ville sympa avec des boîtes et des bons restos"
- "On cherche un endroit calme près d'un lac pour un week-end nature"
- "Une ville avec des activités culturelles, musées, et de bons bars"

**Objectif :** Passer d'un calcul purement géométrique à une recommandation intelligente basée sur les désirs des utilisateurs.

---

## Analyse de l'Architecture Actuelle

### Calcul du Midpoint (actuel)
- **Fichier:** `packages/geo/src/midpoint.ts`
- Calcul purement géométrique (centre géographique)
- Optimisation pour minimiser l'écart-type des distances (équité)
- Ne prend pas en compte l'infrastructure ou les aménités des lieux

### Recherche de Lieux (actuel)
- **Fichiers:** `convex/googlePlaces.ts`, `convex/searchPlaces.ts`
- Google Places API pour rechercher autour du midpoint
- Catégories fixes : restaurant, cafe, bar, fast_food, cinema, park
- Suggestions contextuelles basiques (selon l'heure)

### Points d'Intégration Identifiés
1. **Avant le midpoint :** L'IA suggère des régions/villes potentielles
2. **Après le midpoint :** L'IA affine la recherche de lieux selon préférences
3. **Scoring :** L'IA évalue la compatibilité lieu/préférences

---

## Approches Possibles

### Option A : Chatbot Conversationnel
- Interface chat style ChatGPT
- L'utilisateur décrit ses envies librement
- L'IA interprète et propose des suggestions

**Avantages :** UX naturelle, flexible
**Inconvénients :** Plus complexe, coût API plus élevé

### Option B : Formulaire de Préférences Structuré
- Sliders/checkboxes pour catégories (nightlife, nature, culture, gastronomie...)
- Score de pondération pour chaque critère
- Pas d'IA, juste du scoring

**Avantages :** Simple, pas de coût API IA
**Inconvénients :** Moins flexible, UX moins engageante

### Option C : Hybride (Recommandé)
- Input texte libre pour décrire ses envies
- L'IA parse en critères structurés (JSON)
- Affichage de ce qui a été compris + possibilité de modifier
- Recherche de villes/régions correspondantes

**Avantages :** Meilleur des deux mondes
**Inconvénients :** Complexité moyenne

---

## Décisions Prises

- **Interface :** Champ texte unique (pas de chatbot conversationnel)
- **Scope :** Suggérer des villes/régions entre les participants
- **API IA :** Claude Haiku (~1€/mois pour 10 utilisateurs)
- **Données :** Utiliser les connaissances de Claude sur les villes françaises

---

## Architecture Technique

### Flux Utilisateur

```
1. Créer MeetPoint (comme avant)
   ├─ Nom, participants, locations

2. NOUVEAU: Décrire ses envies
   ├─ Champ texte: "Une ville sympa avec des bars et près d'un lac"
   ├─ Bouton "Trouver des suggestions"

3. Appel API Claude Haiku
   ├─ Input: préférences + bounding box des participants
   ├─ Output: 3-5 villes suggérées avec explications

4. Affichage des suggestions
   ├─ Liste de villes avec description
   ├─ Carte avec les villes suggérées
   ├─ Bouton "Choisir cette ville"

5. Recherche de lieux dans la ville choisie
   ├─ Google Places API autour de la ville
   ├─ Filtrage selon préférences (bars, restos, etc.)
```

### Prompt Claude Haiku

```
Tu es un assistant de voyage. Les utilisateurs cherchent un point de rencontre.

Participants situés à: [liste des villes/régions des participants]
Zone de recherche: [bounding box lat/lng]

Préférences exprimées: "{input utilisateur}"

Suggère 3-5 villes françaises qui:
1. Sont raisonnablement situées entre les participants
2. Correspondent aux préférences mentionnées

Réponds en JSON:
{
  "preferences_comprises": ["nightlife", "lac", "restaurants"],
  "suggestions": [
    {
      "ville": "Annecy",
      "region": "Haute-Savoie",
      "coordinates": {"lat": 45.899, "lng": 6.129},
      "raison": "Ville au bord du lac, vie nocturne animée...",
      "score_match": 95
    }
  ]
}
```

---

## Fichiers à Créer/Modifier

### 1. Backend Convex

**`convex/ai.ts` (NOUVEAU)**
```typescript
// Action pour appeler Claude Haiku
export const suggestCities = action({
  args: {
    meetId: v.id("meets"),
    preferences: v.string(),
    participantLocations: v.array(v.object({
      lat: v.number(),
      lng: v.number(),
      city: v.optional(v.string())
    }))
  },
  handler: async (ctx, args) => {
    // 1. Calculer bounding box
    // 2. Construire le prompt
    // 3. Appeler Claude API
    // 4. Parser la réponse JSON
    // 5. Retourner les suggestions
  }
});

// Sauvegarder les préférences
export const savePreferences = mutation({...});
```

**`convex/schema.ts` (MODIFIER)**
```typescript
// Ajouter à la table meets:
meets: defineTable({
  // ... existant ...
  preferences: v.optional(v.string()),
  suggestedCities: v.optional(v.array(v.object({
    name: v.string(),
    region: v.string(),
    coordinates: v.object({ lat: v.number(), lng: v.number() }),
    reason: v.string(),
    matchScore: v.number()
  }))),
  selectedCity: v.optional(v.object({
    name: v.string(),
    coordinates: v.object({ lat: v.number(), lng: v.number() })
  }))
})
```

### 2. Frontend

**`apps/web/components/preferences-input.tsx` (NOUVEAU)**
- Champ texte avec placeholder inspirant
- Bouton "Trouver des suggestions"
- État loading pendant l'appel API

**`apps/web/components/city-suggestions.tsx` (NOUVEAU)**
- Liste des villes suggérées avec:
  - Nom et région
  - Score de compatibilité
  - Raison/description
  - Bouton "Choisir"
- Marqueurs sur la carte

**`apps/web/app/meet/[id]/page.tsx` (MODIFIER)**
- Ajouter section "Préférences" dans la sidebar
- Conditionnel: si pas de préférences → afficher input
- Si préférences → afficher suggestions ou ville choisie

### 3. Hooks

**`apps/web/hooks/use-city-suggestions.ts` (NOUVEAU)**
```typescript
export function useCitySuggestions(meetId: Id<"meets">) {
  const suggestCities = useAction(api.ai.suggestCities);
  // État local pour loading, suggestions, erreur
  // Fonction pour déclencher la recherche
  // Fonction pour sélectionner une ville
}
```

---

## Ordre d'Implémentation

### Phase 1 : Backend IA
1. Créer `convex/ai.ts` avec action `suggestCities`
2. Configurer variable d'env `ANTHROPIC_API_KEY`
3. Modifier `convex/schema.ts` pour stocker préférences

### Phase 2 : Composants UI
4. Créer `preferences-input.tsx`
5. Créer `city-suggestions.tsx`
6. Créer `hooks/use-city-suggestions.ts`

### Phase 3 : Intégration
7. Modifier `/meet/[id]/page.tsx` pour intégrer les composants
8. Ajouter marqueurs de villes sur la carte

### Phase 4 : Polish
9. Améliorer le prompt avec des exemples
10. Gérer les cas d'erreur (API down, pas de résultats)
11. Ajouter animations/transitions

---

## Variables d'Environnement

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Vérification

### Tests manuels :
1. Créer un MeetPoint avec 2+ participants
2. Entrer une préférence : "ville avec plage et restaurants"
3. Vérifier que 3-5 villes sont suggérées
4. Sélectionner une ville
5. Vérifier que la recherche de lieux se fait autour de cette ville

### Cas limites à tester :
- Préférence vide ou très courte
- Participants très éloignés (Paris ↔ Marseille)
- Préférences impossibles ("plage en montagne")
- API Claude indisponible

---

## Coût Estimé

- **Claude Haiku :** ~0.001€ par requête
- **10 utilisateurs × 3 requêtes/jour :** ~0.03€/jour
- **Coût mensuel :** ~1€
