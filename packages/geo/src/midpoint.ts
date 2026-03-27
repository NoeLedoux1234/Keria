import type { Coordinates } from "@meetpoint/types";
import { degreesToRadians, radiansToDegrees, distanceStandardDeviation, haversineDistance } from "./distance";

export function calculateGeographicCenter(points: Coordinates[]): Coordinates {
  if (points.length === 0) {
    throw new Error("Au moins un point est requis");
  }

  if (points.length === 1) {
    return points[0]!;
  }

  let x = 0;
  let y = 0;
  let z = 0;

  for (const point of points) {
    const latRad = degreesToRadians(point.lat);
    const lngRad = degreesToRadians(point.lng);

    x += Math.cos(latRad) * Math.cos(lngRad);
    y += Math.cos(latRad) * Math.sin(lngRad);
    z += Math.sin(latRad);
  }

  const total = points.length;
  x /= total;
  y /= total;
  z /= total;

  const lng = Math.atan2(y, x);
  const hyp = Math.sqrt(x * x + y * y);
  const lat = Math.atan2(z, hyp);

  return {
    lat: radiansToDegrees(lat),
    lng: radiansToDegrees(lng),
  };
}

export function calculateWeightedMidpoint(
  points: Coordinates[],
  weights: number[]
): Coordinates {
  if (points.length !== weights.length) {
    throw new Error("Le nombre de points et de poids doit être identique");
  }

  if (points.length === 0) {
    throw new Error("Au moins un point est requis");
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight === 0) {
    throw new Error("La somme des poids ne peut pas être nulle");
  }

  let x = 0;
  let y = 0;
  let z = 0;

  for (let i = 0; i < points.length; i++) {
    const point = points[i]!;
    const weight = weights[i]! / totalWeight;
    const latRad = degreesToRadians(point.lat);
    const lngRad = degreesToRadians(point.lng);

    x += weight * Math.cos(latRad) * Math.cos(lngRad);
    y += weight * Math.cos(latRad) * Math.sin(lngRad);
    z += weight * Math.sin(latRad);
  }

  const lng = Math.atan2(y, x);
  const hyp = Math.sqrt(x * x + y * y);
  const lat = Math.atan2(z, hyp);

  return {
    lat: radiansToDegrees(lat),
    lng: radiansToDegrees(lng),
  };
}

export function optimizeMeetingPoint(
  participants: Coordinates[],
  gridSize: number = 5,
  radiusKm: number = 2
): Coordinates {
  const center = calculateGeographicCenter(participants);

  const radiusDeg = radiusKm / 111;

  let bestPoint = center;
  let bestStdDev = distanceStandardDeviation(center, participants);

  for (let i = -gridSize; i <= gridSize; i++) {
    for (let j = -gridSize; j <= gridSize; j++) {
      const candidate: Coordinates = {
        lat: center.lat + (i * radiusDeg) / gridSize,
        lng: center.lng + (j * radiusDeg) / gridSize,
      };

      const stdDev = distanceStandardDeviation(candidate, participants);
      if (stdDev < bestStdDev) {
        bestStdDev = stdDev;
        bestPoint = candidate;
      }
    }
  }

  return bestPoint;
}

export type MidpointResult = {
  midpoint: Coordinates;
  fairnessScore: number;
  averageDistanceKm: number;
  maxDistanceKm: number;
};

export function calculateMidpointWithMetrics(participants: Coordinates[]): MidpointResult {
  if (participants.length < 2) {
    throw new Error("Au moins 2 participants sont requis");
  }

  const midpoint = optimizeMeetingPoint(participants);
  const stdDev = distanceStandardDeviation(midpoint, participants);

  const distances = participants.map((p) => haversineDistance(midpoint, p));
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
  const maxDistance = Math.max(...distances);

  const cv = avgDistance > 0 ? stdDev / avgDistance : 0;
  const fairnessScore = Math.max(0, Math.min(100, 100 * (1 - cv)));

  return {
    midpoint,
    fairnessScore: Math.round(fairnessScore),
    averageDistanceKm: Math.round(avgDistance * 10) / 10,
    maxDistanceKm: Math.round(maxDistance * 10) / 10,
  };
}
