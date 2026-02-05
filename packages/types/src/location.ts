/**
 * Coordonnées géographiques
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Lieu suggéré pour un meeting
 */
export interface Place {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  category: PlaceCategory;
  priceLevel?: PriceLevel;
  rating?: number;
  photoUrl?: string;
  openNow?: boolean;
}

/**
 * Catégories de lieux
 */
export type PlaceCategory =
  | "restaurant"
  | "cafe"
  | "bar"
  | "park"
  | "museum"
  | "cinema"
  | "shopping"
  | "other";

/**
 * Niveaux de prix
 */
export type PriceLevel = 1 | 2 | 3 | 4;

/**
 * Mode de transport
 */
export type TransportMode = "driving" | "walking" | "cycling" | "transit";

/**
 * Isochrone - zone accessible en un temps donné
 */
export interface Isochrone {
  coordinates: Coordinates;
  durationMinutes: number;
  transportMode: TransportMode;
  polygon: Coordinates[];
}

/**
 * Itinéraire calculé
 */
export interface Route {
  origin: Coordinates;
  destination: Coordinates;
  transportMode: TransportMode;
  durationMinutes: number;
  distanceKm: number;
  polyline: Coordinates[];
}
