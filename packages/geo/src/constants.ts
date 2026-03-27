export const EARTH_RADIUS_KM = 6371;

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
