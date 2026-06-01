const NEXT_PUBLIC_CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const NEXT_PUBLIC_MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const ORS_API_KEY = process.env.ORS_API_KEY;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

function getRequired(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  CONVEX_URL: getRequired("NEXT_PUBLIC_CONVEX_URL", NEXT_PUBLIC_CONVEX_URL),
  MAPBOX_TOKEN: NEXT_PUBLIC_MAPBOX_TOKEN ?? "",
  ORS_API_KEY: ORS_API_KEY ?? "",
  GOOGLE_PLACES_API_KEY: GOOGLE_PLACES_API_KEY ?? "",
} as const;
