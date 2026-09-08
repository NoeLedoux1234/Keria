// Les fonctions Convex sont bundlées seules et ne résolvent pas les paquets du
// monorepo : haversineDistance de @meetpoint/geo n'est pas importable ici. La
// formule est donc reprise telle quelle, en mètres, pour ce seul usage.
const EARTH_RADIUS_M = 6_371_000;

// Deux recherches distantes de moins de 300 m visent les mêmes établissements.
// Au-delà, la liste précédente n'est plus pertinente.
export const SEARCH_AREA_TOLERANCE_M = 300;

type Coordinates = {
  lat: number;
  lng: number;
};

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function distanceInMeters(from: Coordinates, to: Coordinates): number {
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(deltaLng / 2) ** 2;

  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Une zone inconnue n'est jamais considérée comme identique : le cache ne peut
// pas être servi tant qu'on ne sait pas d'où viennent les lieux déjà stockés.
export function isSameSearchArea(previous: Coordinates | undefined, next: Coordinates): boolean {
  if (!previous) return false;
  return distanceInMeters(previous, next) <= SEARCH_AREA_TOLERANCE_M;
}

// Distinct de !isSameSearchArea : sans zone précédente, rien n'a bougé, donc
// il n'y a rien à purger.
export function hasSearchAreaMoved(previous: Coordinates | undefined, next: Coordinates): boolean {
  if (!previous) return false;
  return !isSameSearchArea(previous, next);
}
