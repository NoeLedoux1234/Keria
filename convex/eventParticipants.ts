import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const join = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    rsvpStatus: v.optional(
      v.union(
        v.literal("yes"),
        v.literal("no"),
        v.literal("maybe"),
        v.literal("pending")
      )
    ),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Événement non trouvé");
    }
    if (event.status === "cancelled") {
      throw new Error("Cet événement a été annulé");
    }
    if (event.status === "completed") {
      throw new Error("Cet événement est terminé");
    }

    const now = Date.now();

    const existing = await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existing) {
      throw new Error("A participant with this name already exists in this event. Please choose a different name.");
    }

    const participantId = await ctx.db.insert("eventParticipants", {
      eventId: args.eventId,
      name: args.name,
      rsvpStatus: args.rsvpStatus ?? "pending",
      isCreator: false,
      respondedAt: args.rsvpStatus ? now : undefined,
      joinedAt: now,
    });

    await ctx.db.patch(args.eventId, {
      updatedAt: now,
    });

    return participantId;
  },
});

export const rsvp = mutation({
  args: {
    participantId: v.id("eventParticipants"),
    rsvpStatus: v.union(
      v.literal("yes"),
      v.literal("no"),
      v.literal("maybe")
    ),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db.get(args.participantId);
    if (!participant) {
      throw new Error("Participant non trouvé");
    }

    const now = Date.now();

    await ctx.db.patch(args.participantId, {
      rsvpStatus: args.rsvpStatus,
      respondedAt: now,
    });

    await ctx.db.patch(participant.eventId, {
      updatedAt: now,
    });
  },
});

export const remove = mutation({
  args: { participantId: v.id("eventParticipants") },
  handler: async (ctx, args) => {
    const participant = await ctx.db.get(args.participantId);
    if (!participant) {
      throw new Error("Participant non trouvé");
    }

    if (participant.isCreator) {
      throw new Error("Le créateur ne peut pas quitter l'événement");
    }

    await ctx.db.delete(args.participantId);

    await ctx.db.patch(participant.eventId, {
      updatedAt: Date.now(),
    });
  },
});

export const get = query({
  args: { participantId: v.id("eventParticipants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.participantId);
  },
});

export const listByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
  },
});

export const listByRsvp = query({
  args: {
    eventId: v.id("events"),
    rsvpStatus: v.union(
      v.literal("yes"),
      v.literal("no"),
      v.literal("maybe"),
      v.literal("pending")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventParticipants")
      .withIndex("by_event_rsvp", (q) =>
        q.eq("eventId", args.eventId).eq("rsvpStatus", args.rsvpStatus)
      )
      .collect();
  },
});

export const countByRsvp = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    return {
      yes: participants.filter((p) => p.rsvpStatus === "yes").length,
      no: participants.filter((p) => p.rsvpStatus === "no").length,
      maybe: participants.filter((p) => p.rsvpStatus === "maybe").length,
      pending: participants.filter((p) => p.rsvpStatus === "pending").length,
      total: participants.length,
    };
  },
});

export const findByName = query({
  args: {
    eventId: v.id("events"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
  },
});
