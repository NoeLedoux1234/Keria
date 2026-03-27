import type { Coordinates } from "@meetpoint/types";
import { EARTH_RADIUS_KM } from "./constants";

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

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

export function totalDistanceFromPoint(origin: Coordinates, destinations: Coordinates[]): number {
  return destinations.reduce((total, dest) => total + haversineDistance(origin, dest), 0);
}

export function distanceStandardDeviation(
  origin: Coordinates,
  destinations: Coordinates[]
): number {
  if (destinations.length === 0) {
    return 0;
  }

  const distances = destinations.map((dest) => haversineDistance(origin, dest));
  const mean = distances.reduce((a, b) => a + b, 0) / distances.length;
  const squaredDiffs = distances.map((d) => Math.pow(d - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / destinations.length;
  return Math.sqrt(variance);
}
