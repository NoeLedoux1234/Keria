"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export function useMeet(meetId: Id<"meets"> | undefined) {
  const meet = useQuery(api.meets.get, meetId ? { id: meetId } : "skip");
  const participants = useQuery(
    api.meets.getParticipants,
    meetId ? { meetId } : "skip"
  );

  const updateMidpoint = useMutation(api.meets.updateMidpoint);
  const updateStatus = useMutation(api.meets.updateStatus);
  const selectPlace = useMutation(api.meets.selectPlace);

  return {
    meet,
    participants,
    isLoading: meet === undefined,
    updateMidpoint,
    updateStatus,
    selectPlace,
  };
}

export function useMeetByShareCode(shareCode: string | undefined) {
  const meet = useQuery(
    api.meets.getByShareCode,
    shareCode ? { shareCode } : "skip"
  );

  return {
    meet,
    isLoading: meet === undefined,
  };
}

export function useCreateMeet() {
  const create = useMutation(api.meets.create);

  return { create };
}
