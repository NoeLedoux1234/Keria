export type Coordinates = {
  lat: number;
  lng: number;
};

export type Place = {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  category: PlaceCategory;
  priceLevel?: PriceLevel;
  rating?: number;
  photoUrl?: string;
  openNow?: boolean;
};

export type PlaceCategory =
  | "restaurant"
  | "cafe"
  | "bar"
  | "park"
  | "museum"
  | "cinema"
  | "shopping"
  | "other";

export type PriceLevel = 1 | 2 | 3 | 4;

export type TransportMode = "driving" | "walking" | "cycling" | "transit";

export type Isochrone = {
  coordinates: Coordinates;
  durationMinutes: number;
  transportMode: TransportMode;
  polygon: Coordinates[];
};

export type Route = {
  origin: Coordinates;
  destination: Coordinates;
  transportMode: TransportMode;
  durationMinutes: number;
  distanceKm: number;
  polyline: Coordinates[];
};
