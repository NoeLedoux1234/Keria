export type Coordinates = {
  lat: number;
  lng: number;
};

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
