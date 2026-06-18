export const MEET_NAME_MAX = 80;
export const DESCRIPTION_MAX = 500;
export const CREATOR_NAME_MAX = 60;
export const PARTICIPANT_NAME_MAX = 60;
export const AI_PREFERENCES_MAX = 500;

const LATITUDE_MIN = -90;
const LATITUDE_MAX = 90;
const LONGITUDE_MIN = -180;
const LONGITUDE_MAX = 180;

type Coordinates = {
  lat: number;
  lng: number;
};

export function validateRequiredText(value: string, label: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`Le champ « ${label} » est requis.`);
  }
  if (trimmed.length > max) {
    throw new Error(`Le champ « ${label} » ne doit pas dépasser ${max} caractères.`);
  }
  return trimmed;
}

export function validateOptionalText(
  value: string | undefined,
  label: string,
  max: number
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  if (trimmed.length > max) {
    throw new Error(`Le champ « ${label} » ne doit pas dépasser ${max} caractères.`);
  }
  return trimmed;
}

export function validateCoordinates(coords: Coordinates, label: string): void {
  const { lat, lng } = coords;
  const isLatValid = Number.isFinite(lat) && lat >= LATITUDE_MIN && lat <= LATITUDE_MAX;
  const isLngValid = Number.isFinite(lng) && lng >= LONGITUDE_MIN && lng <= LONGITUDE_MAX;
  if (!isLatValid || !isLngValid) {
    throw new Error(`Coordonnées invalides pour « ${label} ».`);
  }
}
