"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

/**
 * Hook pour gérer les participants
 */
export function useParticipants() {
  const join = useMutation(api.participants.join);
  const updateLocation = useMutation(api.participants.updateLocation);
  const remove = useMutation(api.participants.remove);

  return {
    join,
    updateLocation,
    remove,
  };
}
