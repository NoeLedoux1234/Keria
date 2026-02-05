import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Rejoindre un événement
 */
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
    // Vérifier que l'événement existe et n'est pas annulé/terminé
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

    // Vérifier si le participant existe déjà (par nom)
    const existing = await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existing) {
      // Mettre à jour le RSVP si fourni
      if (args.rsvpStatus) {
        await ctx.db.patch(existing._id, {
          rsvpStatus: args.rsvpStatus,
          respondedAt: now,
        });
      }
      return existing._id;
    }

    // Créer un nouveau participant
    const participantId = await ctx.db.insert("eventParticipants", {
      eventId: args.eventId,
      name: args.name,
      rsvpStatus: args.rsvpStatus ?? "pending",
      isCreator: false,
      respondedAt: args.rsvpStatus ? now : undefined,
      joinedAt: now,
    });

    // Mettre à jour l'événement
    await ctx.db.patch(args.eventId, {
      updatedAt: now,
    });

    return participantId;
  },
});

/**
 * Met à jour la réponse RSVP d'un participant
 */
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

    // Mettre à jour l'événement
    await ctx.db.patch(participant.eventId, {
      updatedAt: now,
    });
  },
});

/**
 * Quitter un événement
 */
export const remove = mutation({
  args: { participantId: v.id("eventParticipants") },
  handler: async (ctx, args) => {
    const participant = await ctx.db.get(args.participantId);
    if (!participant) {
      throw new Error("Participant non trouvé");
    }

    // Le créateur ne peut pas quitter
    if (participant.isCreator) {
      throw new Error("Le créateur ne peut pas quitter l'événement");
    }

    await ctx.db.delete(args.participantId);

    // Mettre à jour l'événement
    await ctx.db.patch(participant.eventId, {
      updatedAt: Date.now(),
    });
  },
});

/**
 * Récupère un participant par son ID
 */
export const get = query({
  args: { participantId: v.id("eventParticipants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.participantId);
  },
});

/**
 * Liste les participants d'un événement
 */
export const listByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
  },
});

/**
 * Liste les participants par statut RSVP
 */
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

/**
 * Compte les participants par statut RSVP
 */
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

/**
 * Recherche un participant par nom dans un événement
 */
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
