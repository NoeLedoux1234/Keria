import type { Coordinates } from "@meetpoint/types";
import {
  degreesToRadians,
  radiansToDegrees,
  distanceStandardDeviation,
  haversineDistance,
} from "./distance";

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

export function calculateWeightedMidpoint(points: Coordinates[], weights: number[]): Coordinates {
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

const KM_PER_DEGREE_LAT = 111;

export function optimizeMeetingPoint(
  participants: Coordinates[],
  gridSize: number = 5,
  radiusKm?: number
): Coordinates {
  const center = calculateGeographicCenter(participants);

  if (participants.length < 2) {
    return center;
  }

  // Scale the search area to how spread out the participants are: refining
  // inside a fixed 2 km box is meaningless when people are tens of km apart.
  const distancesToCenter = participants.map((p) => haversineDistance(center, p));
  const avgDistanceKm = distancesToCenter.reduce((a, b) => a + b, 0) / distancesToCenter.length;
  let searchRadiusKm = radiusKm ?? Math.max(2, avgDistanceKm * 0.5);

  let bestPoint = center;
  let bestStdDev = distanceStandardDeviation(center, participants);

  // Coarse-to-fine: scan a grid around the best point, then zoom in and repeat.
  // This covers a wide area without losing resolution near the optimum.
  const REFINEMENT_PASSES = 4;
  for (let pass = 0; pass < REFINEMENT_PASSES; pass++) {
    const origin = bestPoint;
    const latRadiusDeg = searchRadiusKm / KM_PER_DEGREE_LAT;
    // 1° of longitude shrinks with latitude, so the grid must not be square in
    // degrees, otherwise it is anisotropic on the ground.
    const cosLat = Math.cos(degreesToRadians(origin.lat));
    const lngRadiusDeg = searchRadiusKm / (KM_PER_DEGREE_LAT * Math.max(Math.abs(cosLat), 1e-6));

    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        const candidate: Coordinates = {
          lat: origin.lat + (i * latRadiusDeg) / gridSize,
          lng: origin.lng + (j * lngRadiusDeg) / gridSize,
        };

        const stdDev = distanceStandardDeviation(candidate, participants);
        if (stdDev < bestStdDev) {
          bestStdDev = stdDev;
          bestPoint = candidate;
        }
      }
    }

    // Zoom in: next pass searches within one step of the current best point.
    searchRadiusKm /= gridSize;
  }

  return bestPoint;
}

export type PointMetrics = {
  fairnessScore: number;
  averageDistanceKm: number;
  maxDistanceKm: number;
};

export type MidpointResult = PointMetrics & {
  midpoint: Coordinates;
};

export function calculateMetricsForPoint(
  point: Coordinates,
  participants: Coordinates[]
): PointMetrics {
  if (participants.length < 2) {
    throw new Error("Au moins 2 participants sont requis");
  }

  const stdDev = distanceStandardDeviation(point, participants);

  const distances = participants.map((p) => haversineDistance(point, p));
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
  const maxDistance = Math.max(...distances);

  const cv = avgDistance > 0 ? stdDev / avgDistance : 0;
  const fairnessScore = Math.max(0, Math.min(100, 100 * (1 - cv)));

  return {
    fairnessScore: Math.round(fairnessScore),
    averageDistanceKm: Math.round(avgDistance * 10) / 10,
    maxDistanceKm: Math.round(maxDistance * 10) / 10,
  };
}

export function calculateMidpointWithMetrics(participants: Coordinates[]): MidpointResult {
  if (participants.length < 2) {
    throw new Error("Au moins 2 participants sont requis");
  }

  const midpoint = optimizeMeetingPoint(participants);

  return {
    midpoint,
    ...calculateMetricsForPoint(midpoint, participants),
  };
}
