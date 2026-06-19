"use client";

import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

interface SuggestItineraryArgs {
  eventId: Id<"events">;
  description: string;
}

export function useEventAi() {
  const isEnabled = useQuery(api.ai.isEnabled, {});
  const suggestItinerary = useAction(api.eventAi.suggestItinerary);

  const [isSuggesting, setIsSuggesting] = useState(false);

  const suggest = async (args: SuggestItineraryArgs) => {
    setIsSuggesting(true);
    try {
      return await suggestItinerary(args);
    } finally {
      setIsSuggesting(false);
    }
  };

  return {
    isEnabled,
    isSuggesting,
    suggest,
  };
}
