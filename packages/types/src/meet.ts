import type { Coordinates, Place, TransportMode } from "./location";

export type MeetStatus = "draft" | "pending" | "confirmed" | "completed" | "cancelled";

export type Participant = {
  id: string;
  userId?: string;
  name: string;
  location: Coordinates;
  transportMode: TransportMode;
  joinedAt: number;
};

export type LocationVote = {
  placeId: string;
  participantId: string;
  vote: "up" | "down";
  votedAt: number;
};

export type MeetFilters = {
  maxTravelTimeMinutes?: number;
  placeCategories?: string[];
  priceLevel?: number[];
  openNow?: boolean;
};

export type Meet = {
  id: string;
  name: string;
  description?: string;
  creatorName: string;
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
};

export type CreateMeetInput = {
  name: string;
  description?: string;
  creatorLocation: Coordinates;
  creatorName: string;
  transportMode: TransportMode;
  filters?: MeetFilters;
  scheduledFor?: number;
};

export type JoinMeetInput = {
  meetId: string;
  name: string;
  location: Coordinates;
  transportMode: TransportMode;
};
