"use client";

import { useCallback, useRef, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { Coordinates } from "@meetpoint/types";
import { DEFAULT_SEARCH_CATEGORIES } from "@/components/places/constants";

const DEBOUNCE_MS = 2000;

interface SearchParams {
  midpoint: Coordinates | null;
  categoryFilter: string;
  searchRadius: number;
  contextual: boolean;
}

interface SearchActionResult {
  success: boolean;
  error?: string;
}

/**
 * Encapsulates place search across the two providers (Google Places, with an
 * OpenStreetMap/Overpass fallback) plus a time-based debounce.
 *
 * Fallback policy: a missing Google key is permanent, so we switch to Overpass
 * for good; any other Google failure (quota, 5xx, network) falls back to
 * Overpass for this search only, and Google is retried next time.
 */
export function usePlaceSearch(meetId: Id<"meets">) {
  const searchGoogle = useAction(api.googlePlaces.searchNearby);
  const searchGoogleContextual = useAction(api.googlePlaces.searchContextual);
  const searchOverpass = useAction(api.searchPlaces.searchNearby);
  const searchOverpassContextual = useAction(api.searchPlaces.searchContextual);

  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const googleDisabledRef = useRef(false);
  const lastSearchTime = useRef(0);

  const search = useCallback(
    async ({ midpoint, categoryFilter, searchRadius, contextual }: SearchParams) => {
      if (!midpoint) return;

      const now = Date.now();
      if (now - lastSearchTime.current < DEBOUNCE_MS) return;
      lastSearchTime.current = now;

      setIsSearching(true);
      setSearchError(null);

      const categories = categoryFilter === "all" ? DEFAULT_SEARCH_CATEGORIES : [categoryFilter];
      const baseArgs = {
        meetId,
        lat: midpoint.lat,
        lng: midpoint.lng,
        radiusMeters: searchRadius,
      };

      const runGoogle = (): Promise<SearchActionResult> =>
        contextual ? searchGoogleContextual(baseArgs) : searchGoogle({ ...baseArgs, categories });
      const runOverpass = (): Promise<SearchActionResult> =>
        contextual
          ? searchOverpassContextual(baseArgs)
          : searchOverpass({ ...baseArgs, categories });

      try {
        let result: SearchActionResult;

        if (googleDisabledRef.current) {
          result = await runOverpass();
        } else {
          try {
            result = await runGoogle();
          } catch {
            result = { success: false, error: "Google request failed" };
          }

          if (!result.success) {
            // Missing key is permanent; everything else is transient.
            if (result.error?.includes("GOOGLE_PLACES_API_KEY")) {
              googleDisabledRef.current = true;
            }
            result = await runOverpass();
          }
        }

        if (!result.success) {
          setSearchError(result.error ?? "Erreur de recherche");
        }
      } catch {
        setSearchError("Erreur de connexion");
      } finally {
        setIsSearching(false);
      }
    },
    [meetId, searchGoogle, searchGoogleContextual, searchOverpass, searchOverpassContextual]
  );

  return { isSearching, searchError, setSearchError, search };
}
