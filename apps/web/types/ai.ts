import type { Coordinates } from "@meetpoint/types";

export interface SuggestedCity {
  name: string;
  region: string;
  coordinates: Coordinates;
  reason: string;
  matchScore: number;
}
