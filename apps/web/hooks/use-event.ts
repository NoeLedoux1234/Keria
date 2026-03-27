"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export function useEvent(eventId: Id<"events"> | undefined) {
  const event = useQuery(api.events.get, eventId ? { id: eventId } : "skip");
  const stages = useQuery(
    api.events.getStages,
    eventId ? { eventId } : "skip"
  );
  const participants = useQuery(
    api.events.getParticipants,
    eventId ? { eventId } : "skip"
  );
  const rsvpCounts = useQuery(
    api.events.countByRsvp,
    eventId ? { eventId } : "skip"
  );

  const updateEvent = useMutation(api.events.update);
  const updateStatus = useMutation(api.events.updateStatus);
  const removeEvent = useMutation(api.events.remove);

  return {
    event,
    stages,
    participants,
    rsvpCounts,
    isLoading: event === undefined,
    updateEvent,
    updateStatus,
    removeEvent,
  };
}

export function useEventByShareCode(shareCode: string | undefined) {
  const event = useQuery(
    api.events.getByShareCode,
    shareCode ? { shareCode } : "skip"
  );

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
  const stages = useQuery(
    api.eventStages.listByEvent,
    eventId ? { eventId } : "skip"
  );

  const addStage = useMutation(api.eventStages.add);
  const updateStage = useMutation(api.eventStages.update);
  const removeStage = useMutation(api.eventStages.remove);

  return {
    stages,
    isLoading: stages === undefined,
    addStage,
    updateStage,
    removeStage,
  };
}

export function useEventParticipants(eventId: Id<"events"> | undefined) {
  const participants = useQuery(
    api.eventParticipants.listByEvent,
    eventId ? { eventId } : "skip"
  );
  const rsvpCounts = useQuery(
    api.eventParticipants.countByRsvp,
    eventId ? { eventId } : "skip"
  );

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
