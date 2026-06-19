"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Coordinates, TransportMode } from "@meetpoint/types";
import type { Id } from "../../../convex/_generated/dataModel";

interface SetLogisticsArgs {
  participantId: Id<"eventParticipants">;
  location: Coordinates;
  address?: string;
  transportMode: TransportMode;
}

interface CalculateArgs {
  eventId: Id<"events">;
  eventParticipantId: Id<"eventParticipants">;
}

export function useEventItinerary(
  eventId: Id<"events"> | undefined,
  eventParticipantId: Id<"eventParticipants"> | null
) {
  const setLogisticsMutation = useMutation(api.eventParticipants.setLogistics);
  const calculateAction = useAction(api.eventRouting.calculateParticipantItinerary);

  const itinerary = useQuery(
    api.eventRouting.getItinerary,
    eventParticipantId ? { eventParticipantId } : "skip"
  );

  const [isCalculating, setIsCalculating] = useState(false);

  const setLogistics = useCallback(
    (args: SetLogisticsArgs) => setLogisticsMutation(args),
    [setLogisticsMutation]
  );

  const calculate = useCallback(
    async (args: CalculateArgs) => {
      if (!eventId) throw new Error("Événement introuvable");
      setIsCalculating(true);
      try {
        return await calculateAction(args);
      } finally {
        setIsCalculating(false);
      }
    },
    [eventId, calculateAction]
  );

  return {
    itinerary: itinerary ?? null,
    isCalculating,
    setLogistics,
    calculate,
  };
}
