import type { Coordinates, TransportMode } from "./location";

/**
 * Préférences utilisateur
 */
export interface UserPreferences {
  defaultTransportMode: TransportMode;
  defaultLocation?: Coordinates;
  favoriteCategories: string[];
  maxBudget?: number;
}

/**
 * Utilisateur
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  createdAt: number;
  updatedAt: number;
}
