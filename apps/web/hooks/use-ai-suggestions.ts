"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export function useAiSuggestions(_meetId: Id<"meets"> | null) {
  const isEnabled = useQuery(api.ai.isEnabled, {});

  const suggestCities = useAction(api.ai.suggestCities);
  const savePreferences = useMutation(api.ai.savePreferences);
  const selectCity = useMutation(api.ai.selectCity);

  return {
    isEnabled,
    suggestCities,
    savePreferences,
    selectCity,
  };
}
