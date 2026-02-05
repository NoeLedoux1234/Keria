import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Génère un code de partage unique pour les événements (6 caractères)
 */
function generateEventShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sans I, O, 0, 1 pour éviter confusion
  let code = "E"; // Préfixe E pour distinguer des meetpoints
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Détermine le type d'étape en fonction de son ordre
 */
function getStageType(order: number, totalStages: number): "departure" | "intermediate" | "arrival" {
  if (order === 0) return "departure";
  if (order === totalStages - 1) return "arrival";
  return "intermediate";
}

/**
 * Crée un nouvel événement avec ses étapes
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    creatorName: v.string(),
    stages: v.array(
      v.object({
        name: v.string(),
        description: v.optional(v.string()),
        location: v.object({
          lat: v.number(),
          lng: v.number(),
        }),
        address: v.string(),
        scheduledAt: v.number(),
        estimatedDurationMinutes: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Vérifier qu'il y a au moins 2 étapes
    if (args.stages.length < 2) {
      throw new Error("Un événement doit avoir au moins 2 étapes (départ et arrivée)");
    }

    const now = Date.now();

    // Générer un code de partage unique
    let shareCode = generateEventShareCode();
    let existing = await ctx.db
      .query("events")
      .withIndex("by_share_code", (q) => q.eq("shareCode", shareCode))
      .first();

    // Régénérer si collision (rare)
    while (existing) {
      shareCode = generateEventShareCode();
      existing = await ctx.db
        .query("events")
        .withIndex("by_share_code", (q) => q.eq("shareCode", shareCode))
        .first();
    }

    // Trier les étapes par date
    const sortedStages = [...args.stages].sort((a, b) => a.scheduledAt - b.scheduledAt);

    // Créer l'événement
    const eventId = await ctx.db.insert("events", {
      name: args.name,
      description: args.description,
      creatorId: args.creatorName, // TODO: utiliser l'auth user ID
      shareCode,
      status: "published",
      startsAt: sortedStages[0]!.scheduledAt,
      endsAt: sortedStages[sortedStages.length - 1]!.scheduledAt,
      createdAt: now,
      updatedAt: now,
    });

    // Créer les étapes
    for (let i = 0; i < sortedStages.length; i++) {
      const stage = sortedStages[i]!;
      await ctx.db.insert("eventStages", {
        eventId,
        name: stage.name,
        description: stage.description,
        location: stage.location,
        address: stage.address,
        scheduledAt: stage.scheduledAt,
        estimatedDurationMinutes: stage.estimatedDurationMinutes,
        order: i,
        stageType: getStageType(i, sortedStages.length),
        createdAt: now,
      });
    }

    // Ajouter le créateur comme premier participant avec RSVP = yes
    const participantId = await ctx.db.insert("eventParticipants", {
      eventId,
      name: args.creatorName,
      rsvpStatus: "yes",
      isCreator: true,
      respondedAt: now,
      joinedAt: now,
    });

    return { eventId, shareCode, participantId };
  },
});

/**
 * Récupère un événement par son ID
 */
export const get = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Récupère un événement par son code de partage
 */
export const getByShareCode = query({
  args: { shareCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_share_code", (q) => q.eq("shareCode", args.shareCode.toUpperCase()))
      .first();
  },
});

/**
 * Liste les étapes d'un événement (triées par ordre)
 */
export const getStages = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const stages = await ctx.db
      .query("eventStages")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    return stages.sort((a, b) => a.order - b.order);
  },
});

/**
 * Liste les participants d'un événement
 */
export const getParticipants = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
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
 * Met à jour les détails d'un événement
 */
export const update = mutation({
  args: {
    eventId: v.id("events"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.eventId, updates);
  },
});

/**
 * Met à jour le statut d'un événement
 */
export const updateStatus = mutation({
  args: {
    eventId: v.id("events"),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("ongoing"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Supprime un événement et toutes ses données associées
 */
export const remove = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    // Supprimer les étapes
    const stages = await ctx.db
      .query("eventStages")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const stage of stages) {
      await ctx.db.delete(stage._id);
    }

    // Supprimer les participants
    const participants = await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const participant of participants) {
      await ctx.db.delete(participant._id);
    }

    // Supprimer l'événement
    await ctx.db.delete(args.eventId);
  },
});
