import type { Coordinates, TransportMode, Route, Isochrone } from "@meetpoint/types";
import { ORS_BASE_URL, ORS_PROFILES } from "./constants";

/**
 * Configuration du client OpenRouteService
 */
export interface ORSConfig {
  apiKey: string;
}

/**
 * Crée un client OpenRouteService
 */
export function createORSClient(config: ORSConfig) {
  const { apiKey } = config;

  /**
   * Récupère les headers communs
   */
  const getHeaders = () => ({
    Authorization: apiKey,
    "Content-Type": "application/json",
  });

  /**
   * Calcule un itinéraire entre deux points
   */
  async function getRoute(
    origin: Coordinates,
    destination: Coordinates,
    mode: TransportMode
  ): Promise<Route> {
    const profile = ORS_PROFILES[mode];
    const url = `${ORS_BASE_URL}/v2/directions/${profile}`;

    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        coordinates: [
          [origin.lng, origin.lat],
          [destination.lng, destination.lat],
        ],
        format: "geojson",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ORS API error: ${error}`);
    }

    const data = await response.json();
    const feature = data.features[0];
    const { distance, duration } = feature.properties.summary;
    const coordinates = feature.geometry.coordinates;

    return {
      origin,
      destination,
      transportMode: mode,
      durationMinutes: Math.round(duration / 60),
      distanceKm: Math.round(distance / 100) / 10,
      polyline: coordinates.map(([lng, lat]: [number, number]) => ({ lat, lng })),
    };
  }

  /**
   * Calcule les isochrones (zones accessibles) depuis un point
   */
  async function getIsochrones(
    center: Coordinates,
    mode: TransportMode,
    durationsMinutes: number[]
  ): Promise<Isochrone[]> {
    const profile = ORS_PROFILES[mode];
    const url = `${ORS_BASE_URL}/v2/isochrones/${profile}`;

    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        locations: [[center.lng, center.lat]],
        range: durationsMinutes.map((d) => d * 60), // Convertir en secondes
        range_type: "time",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ORS API error: ${error}`);
    }

    const data = await response.json();

    return data.features.map((feature: any, index: number) => ({
      coordinates: center,
      durationMinutes: durationsMinutes[index],
      transportMode: mode,
      polygon: feature.geometry.coordinates[0].map(([lng, lat]: [number, number]) => ({
        lat,
        lng,
      })),
    }));
  }

  /**
   * Calcule une matrice de temps de trajet entre plusieurs points
   */
  async function getMatrix(
    sources: Coordinates[],
    destinations: Coordinates[],
    mode: TransportMode
  ): Promise<number[][]> {
    const profile = ORS_PROFILES[mode];
    const url = `${ORS_BASE_URL}/v2/matrix/${profile}`;

    const allCoordinates = [...sources, ...destinations].map((c) => [c.lng, c.lat]);

    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        locations: allCoordinates,
        sources: sources.map((_, i) => i),
        destinations: sources.map((_, i) => sources.length + i),
        metrics: ["duration"],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ORS API error: ${error}`);
    }

    const data = await response.json();

    // Convertir les secondes en minutes
    return data.durations.map((row: number[]) => row.map((d: number) => Math.round(d / 60)));
  }

  /**
   * Recherche géocodage (adresse → coordonnées)
   */
  async function geocode(query: string): Promise<Coordinates | null> {
    const url = `${ORS_BASE_URL}/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.features.length === 0) {
      return null;
    }

    const [lng, lat] = data.features[0].geometry.coordinates;
    return { lat, lng };
  }

  /**
   * Recherche géocodage inverse (coordonnées → adresse)
   */
  async function reverseGeocode(coordinates: Coordinates): Promise<string | null> {
    const url = `${ORS_BASE_URL}/geocode/reverse?api_key=${apiKey}&point.lat=${coordinates.lat}&point.lon=${coordinates.lng}`;

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.features.length === 0) {
      return null;
    }

    return data.features[0].properties.label;
  }

  return {
    getRoute,
    getIsochrones,
    getMatrix,
    geocode,
    reverseGeocode,
  };
}

export type ORSClient = ReturnType<typeof createORSClient>;
