export const EARTH_RADIUS_KM = 6371;

// Deux recherches distantes de moins de 300 m visent les mêmes établissements.
// Au-delà, la liste précédente n'est plus pertinente et doit être refaite.
// À garder aligné sur SEARCH_AREA_TOLERANCE_M de convex/searchArea.ts : le
// bundle Convex ne résout pas les paquets du monorepo et ne peut pas importer
// cette constante.
export const SEARCH_AREA_TOLERANCE_KM = 0.3;

export const DEFAULT_MAX_TRAVEL_TIME = 30;

export const AVERAGE_SPEEDS = {
  driving: 40,
  cycling: 15,
  walking: 5,
  transit: 25,
} as const;

export const ORS_BASE_URL = "https://api.openrouteservice.org";

export const ORS_PROFILES = {
  driving: "driving-car",
  cycling: "cycling-regular",
  walking: "foot-walking",
  transit: "driving-car",
} as const;
