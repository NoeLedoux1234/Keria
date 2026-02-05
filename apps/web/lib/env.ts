/**
 * Variables d'environnement typées
 * Validées au runtime pour éviter les erreurs silencieuses
 */

function getEnvVar(key: string, required = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value ?? "";
}

export const env = {
  // Convex
  CONVEX_URL: getEnvVar("NEXT_PUBLIC_CONVEX_URL"),

  // Mapbox
  MAPBOX_TOKEN: getEnvVar("NEXT_PUBLIC_MAPBOX_TOKEN", false),

  // OpenRouteService
  ORS_API_KEY: getEnvVar("ORS_API_KEY", false),

  // Google Places
  GOOGLE_PLACES_API_KEY: getEnvVar("GOOGLE_PLACES_API_KEY", false),
} as const;
