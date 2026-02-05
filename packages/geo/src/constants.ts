/**
 * Rayon de la Terre en kilomètres
 */
export const EARTH_RADIUS_KM = 6371;

/**
 * Temps maximum de trajet par défaut (en minutes)
 */
export const DEFAULT_MAX_TRAVEL_TIME = 30;

/**
 * Vitesses moyennes par mode de transport (km/h)
 */
export const AVERAGE_SPEEDS = {
  driving: 40,
  cycling: 15,
  walking: 5,
  transit: 25,
} as const;

/**
 * URL de base de l'API OpenRouteService
 */
export const ORS_BASE_URL = "https://api.openrouteservice.org";

/**
 * Mapping des modes de transport vers les profils ORS
 */
export const ORS_PROFILES = {
  driving: "driving-car",
  cycling: "cycling-regular",
  walking: "foot-walking",
  transit: "driving-car", // ORS n'a pas de transit, fallback sur driving
} as const;
