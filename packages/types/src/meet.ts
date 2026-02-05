import type { Coordinates, Place, TransportMode } from "./location";

/**
 * Statut d'un meeting
 */
export type MeetStatus = "draft" | "pending" | "confirmed" | "completed" | "cancelled";

/**
 * Participant à un meeting
 */
export interface Participant {
  id: string;
  userId?: string;
  name: string;
  location: Coordinates;
  transportMode: TransportMode;
  joinedAt: number;
}

/**
 * Vote sur un lieu
 */
export interface LocationVote {
  placeId: string;
  participantId: string;
  vote: "up" | "down";
  votedAt: number;
}

/**
 * Filtres pour la recherche de lieux
 */
export interface MeetFilters {
  maxTravelTimeMinutes?: number;
  placeCategories?: string[];
  priceLevel?: number[];
  openNow?: boolean;
}

/**
 * Meeting principal
 */
export interface Meet {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  participants: Participant[];
  midpoint?: Coordinates;
  suggestedPlaces: Place[];
  votes: LocationVote[];
  selectedPlace?: Place;
  filters: MeetFilters;
  status: MeetStatus;
  scheduledFor?: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Données pour créer un nouveau meeting
 */
export interface CreateMeetInput {
  name: string;
  description?: string;
  creatorLocation: Coordinates;
  creatorName: string;
  transportMode: TransportMode;
  filters?: MeetFilters;
  scheduledFor?: number;
}

/**
 * Données pour rejoindre un meeting
 */
export interface JoinMeetInput {
  meetId: string;
  name: string;
  location: Coordinates;
  transportMode: TransportMode;
}
