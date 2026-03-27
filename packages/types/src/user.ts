import type { Coordinates, TransportMode } from "./location";

export type UserPreferences = {
  defaultTransportMode: TransportMode;
  defaultLocation?: Coordinates;
  favoriteCategories: string[];
  maxBudget?: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  createdAt: number;
  updatedAt: number;
};
