"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id, Doc } from "../../../convex/_generated/dataModel";

interface SearchForStageArgs {
  eventStageId: Id<"eventStages">;
  radiusMeters?: number;
  categories?: string[];
  limit?: number;
}

interface CastVoteArgs {
  eventStageId: Id<"eventStages">;
  placeId: Id<"places">;
  eventParticipantId: Id<"eventParticipants">;
  vote: "up" | "down";
}

export function useEventPlaces(eventStageId: Id<"eventStages"> | null) {
  const ranking = useQuery(
    api.eventVotes.getStageRanking,
    eventStageId ? { eventStageId } : "skip"
  );
  const votes = useQuery(api.eventVotes.listByStage, eventStageId ? { eventStageId } : "skip");

  const searchAction = useAction(api.eventPlaces.searchForStage);
  const voteMutation = useMutation(api.eventVotes.cast);

  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(
    async (args: SearchForStageArgs) => {
      setIsSearching(true);
      try {
        return await searchAction(args);
      } finally {
        setIsSearching(false);
      }
    },
    [searchAction]
  );

  const vote = useCallback((args: CastVoteArgs) => voteMutation(args), [voteMutation]);

  const getUserVote = useCallback(
    (placeId: Id<"places">, eventParticipantId: Id<"eventParticipants"> | null) => {
      if (!eventParticipantId || !votes) return null;
      const userVote = votes.find(
        (v: Doc<"votes">) => v.placeId === placeId && v.eventParticipantId === eventParticipantId
      );
      return userVote?.vote ?? null;
    },
    [votes]
  );

  return {
    ranking,
    isLoading: ranking === undefined,
    isSearching,
    search,
    vote,
    getUserVote,
  };
}
