"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Coordinates } from "@meetpoint/types";
import type { EventStatus } from "@/lib/event-status";
import type { Id } from "../../../convex/_generated/dataModel";

interface UpdateEventArgs {
  name?: string;
  description?: string;
}

interface AddStageArgs {
  name: string;
  description?: string;
  location: Coordinates;
  address: string;
  scheduledAt: number;
  estimatedDurationMinutes?: number;
}

interface UpdateStageArgs {
  stageId: Id<"eventStages">;
  name?: string;
  description?: string;
  location?: Coordinates;
  address?: string;
  scheduledAt?: number;
  estimatedDurationMinutes?: number;
}

function useEditToken(eventId: Id<"events"> | undefined): string | null {
  const [editToken, setEditToken] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setEditToken(null);
      return;
    }
    setEditToken(localStorage.getItem(`meetpoint-event-edit-token-${eventId}`));
  }, [eventId]);

  return editToken;
}

export function useEvent(eventId: Id<"events"> | undefined) {
  const event = useQuery(api.events.get, eventId ? { id: eventId } : "skip");
  const stages = useQuery(api.events.getStages, eventId ? { eventId } : "skip");
  const participants = useQuery(api.events.getParticipants, eventId ? { eventId } : "skip");
  const rsvpCounts = useQuery(api.events.countByRsvp, eventId ? { eventId } : "skip");

  const editToken = useEditToken(eventId);

  const isEditor = useQuery(
    api.events.verifyEditToken,
    eventId && editToken ? { eventId, editToken } : "skip"
  );

  const updateEventMutation = useMutation(api.events.update);
  const updateStatusMutation = useMutation(api.events.updateStatus);
  const removeEventMutation = useMutation(api.events.remove);

  const updateEvent = useCallback(
    (args: UpdateEventArgs) => {
      if (!eventId || !editToken) throw new Error("Action non autorisée");
      return updateEventMutation({ eventId, editToken, ...args });
    },
    [eventId, editToken, updateEventMutation]
  );

  const updateStatus = useCallback(
    (status: EventStatus) => {
      if (!eventId || !editToken) throw new Error("Action non autorisée");
      return updateStatusMutation({ eventId, editToken, status });
    },
    [eventId, editToken, updateStatusMutation]
  );

  const removeEvent = useCallback(() => {
    if (!eventId || !editToken) throw new Error("Action non autorisée");
    return removeEventMutation({ eventId, editToken });
  }, [eventId, editToken, removeEventMutation]);

  return {
    event,
    stages,
    participants,
    rsvpCounts,
    isLoading: event === undefined,
    isEditor: isEditor === true,
    updateEvent,
    updateStatus,
    removeEvent,
  };
}

export function useEventByShareCode(shareCode: string | undefined) {
  const event = useQuery(api.events.getByShareCode, shareCode ? { shareCode } : "skip");

  return {
    event,
    isLoading: event === undefined,
  };
}

export function useCreateEvent() {
  const create = useMutation(api.events.create);

  return { create };
}

export function useEventStages(eventId: Id<"events"> | undefined) {
  const stages = useQuery(api.eventStages.listByEvent, eventId ? { eventId } : "skip");

  const editToken = useEditToken(eventId);

  const addStageMutation = useMutation(api.eventStages.add);
  const updateStageMutation = useMutation(api.eventStages.update);
  const removeStageMutation = useMutation(api.eventStages.remove);

  const addStage = useCallback(
    (args: AddStageArgs) => {
      if (!eventId || !editToken) throw new Error("Action non autorisée");
      return addStageMutation({ eventId, editToken, ...args });
    },
    [eventId, editToken, addStageMutation]
  );

  const updateStage = useCallback(
    ({ stageId, ...args }: UpdateStageArgs) => {
      if (!editToken) throw new Error("Action non autorisée");
      return updateStageMutation({ stageId, editToken, ...args });
    },
    [editToken, updateStageMutation]
  );

  const removeStage = useCallback(
    (stageId: Id<"eventStages">) => {
      if (!editToken) throw new Error("Action non autorisée");
      return removeStageMutation({ stageId, editToken });
    },
    [editToken, removeStageMutation]
  );

  return {
    stages,
    isLoading: stages === undefined,
    addStage,
    updateStage,
    removeStage,
  };
}

export function useEventParticipants(eventId: Id<"events"> | undefined) {
  const participants = useQuery(api.eventParticipants.listByEvent, eventId ? { eventId } : "skip");
  const rsvpCounts = useQuery(api.eventParticipants.countByRsvp, eventId ? { eventId } : "skip");

  const join = useMutation(api.eventParticipants.join);
  const rsvp = useMutation(api.eventParticipants.rsvp);
  const remove = useMutation(api.eventParticipants.remove);

  return {
    participants,
    rsvpCounts,
    isLoading: participants === undefined,
    join,
    rsvp,
    remove,
  };
}
