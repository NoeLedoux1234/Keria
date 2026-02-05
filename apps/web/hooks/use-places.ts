"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

/**
 * Hook pour gérer les lieux suggérés
 */
export function usePlaces(meetId: Id<"meets"> | undefined) {
  const places = useQuery(api.places.listByMeet, meetId ? { meetId } : "skip");
  const ranking = useQuery(api.votes.getPlaceRanking, meetId ? { meetId } : "skip");

  const addPlace = useMutation(api.places.add);
  const clearPlaces = useMutation(api.places.clearByMeet);

  return {
    places,
    ranking,
    isLoading: places === undefined,
    addPlace,
    clearPlaces,
  };
}

/**
 * Hook pour gérer les votes
 */
export function useVotes(meetId: Id<"meets"> | undefined) {
  const votes = useQuery(api.votes.listByMeet, meetId ? { meetId } : "skip");

  const castVote = useMutation(api.votes.cast);
  const removeVote = useMutation(api.votes.remove);

  return {
    votes,
    castVote,
    removeVote,
  };
}
