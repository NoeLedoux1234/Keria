import type { Coordinates } from "./location";

/** RSVP state of an event participant. Mirrors eventParticipants.rsvpStatus in the Convex schema. */
export type RsvpStatus = "yes" | "no" | "maybe" | "pending";

/** A city proposed by the AI assistant. Mirrors meets.suggestedCities in the Convex schema. */
export interface SuggestedCity {
  name: string;
  region: string;
  coordinates: Coordinates;
  reason: string;
  matchScore: number;
}

/** The city chosen as the effective destination. Mirrors meets.selectedCity in the Convex schema. */
export interface SelectedCity {
  name: string;
  coordinates: Coordinates;
}
