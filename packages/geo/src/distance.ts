import type { Coordinates } from "@meetpoint/types";
import { EARTH_RADIUS_KM } from "./constants";

/**
 * Convertit des degrés en radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convertit des radians en degrés
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calcule la distance entre deux points en utilisant la formule de Haversine
 * @returns Distance en kilomètres
 */
export function haversineDistance(point1: Coordinates, point2: Coordinates): number {
  const lat1Rad = degreesToRadians(point1.lat);
  const lat2Rad = degreesToRadians(point2.lat);
  const deltaLat = degreesToRadians(point2.lat - point1.lat);
  const deltaLng = degreesToRadians(point2.lng - point1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Calcule la distance totale depuis un point vers plusieurs autres
 * @returns Somme des distances en kilomètres
 */
export function totalDistanceFromPoint(origin: Coordinates, destinations: Coordinates[]): number {
  return destinations.reduce((total, dest) => total + haversineDistance(origin, dest), 0);
}

/**
 * Calcule l'écart-type des distances depuis un point vers plusieurs autres
 * Utile pour mesurer l'équité d'un point de rencontre
 */
export function distanceStandardDeviation(
  origin: Coordinates,
  destinations: Coordinates[]
): number {
  const distances = destinations.map((dest) => haversineDistance(origin, dest));
  const mean = distances.reduce((a, b) => a + b, 0) / distances.length;
  const squaredDiffs = distances.map((d) => Math.pow(d - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / distances.length;
  return Math.sqrt(variance);
}
