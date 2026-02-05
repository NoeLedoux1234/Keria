import type { Coordinates } from "@meetpoint/types";
import { degreesToRadians, radiansToDegrees, distanceStandardDeviation } from "./distance";

/**
 * Calcule le centre géographique (centroïde) de plusieurs points
 * Utilise la méthode du centre de masse sphérique
 */
export function calculateGeographicCenter(points: Coordinates[]): Coordinates {
  if (points.length === 0) {
    throw new Error("Au moins un point est requis");
  }

  if (points.length === 1) {
    return points[0]!;
  }

  // Convertir en coordonnées cartésiennes
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

  // Reconvertir en coordonnées sphériques
  const lng = Math.atan2(y, x);
  const hyp = Math.sqrt(x * x + y * y);
  const lat = Math.atan2(z, hyp);

  return {
    lat: radiansToDegrees(lat),
    lng: radiansToDegrees(lng),
  };
}

/**
 * Calcule le point médian pondéré
 * Chaque point peut avoir un poids différent (ex: basé sur le temps de trajet acceptable)
 */
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

/**
 * Optimise le point de rencontre pour minimiser l'écart-type des distances
 * Utilise une recherche par grille autour du centre géographique
 */
export function optimizeMeetingPoint(
  participants: Coordinates[],
  gridSize: number = 5,
  radiusKm: number = 2
): Coordinates {
  const center = calculateGeographicCenter(participants);

  // Convertir le rayon en degrés (approximation)
  const radiusDeg = radiusKm / 111; // ~111km par degré de latitude

  let bestPoint = center;
  let bestStdDev = distanceStandardDeviation(center, participants);

  // Recherche par grille
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

/**
 * Résultat du calcul de midpoint avec métadonnées
 */
export interface MidpointResult {
  midpoint: Coordinates;
  fairnessScore: number; // 0-100, plus c'est haut plus c'est équitable
  averageDistanceKm: number;
  maxDistanceKm: number;
}

/**
 * Calcule le midpoint avec des métriques d'équité
 */
export function calculateMidpointWithMetrics(participants: Coordinates[]): MidpointResult {
  if (participants.length < 2) {
    throw new Error("Au moins 2 participants sont requis");
  }

  const midpoint = optimizeMeetingPoint(participants);
  const stdDev = distanceStandardDeviation(midpoint, participants);

  // Calcul des distances
  const { haversineDistance } = require("./distance");
  const distances = participants.map((p) => haversineDistance(midpoint, p));
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
  const maxDistance = Math.max(...distances);

  // Score d'équité: basé sur le coefficient de variation (inverse)
  // Plus l'écart-type est faible par rapport à la moyenne, plus c'est équitable
  const cv = avgDistance > 0 ? stdDev / avgDistance : 0;
  const fairnessScore = Math.max(0, Math.min(100, 100 * (1 - cv)));

  return {
    midpoint,
    fairnessScore: Math.round(fairnessScore),
    averageDistanceKm: Math.round(avgDistance * 10) / 10,
    maxDistanceKm: Math.round(maxDistance * 10) / 10,
  };
}
