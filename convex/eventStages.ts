import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Détermine le type d'étape en fonction de son ordre
 */
function getStageType(order: number, totalStages: number): "departure" | "intermediate" | "arrival" {
  if (order === 0) return "departure";
  if (order === totalStages - 1) return "arrival";
  return "intermediate";
}

/**
 * Ajoute une étape à un événement
 */
export const add = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    description: v.optional(v.string()),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    address: v.string(),
    scheduledAt: v.number(),
    estimatedDurationMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Récupérer toutes les étapes existantes
    const existingStages = await ctx.db
      .query("eventStages")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Trouver la bonne position en fonction de la date
    const allStages = [
      ...existingStages.map((s) => ({ scheduledAt: s.scheduledAt, id: s._id })),
      { scheduledAt: args.scheduledAt, id: null },
    ].sort((a, b) => a.scheduledAt - b.scheduledAt);

    const newOrder = allStages.findIndex((s) => s.id === null);
    const totalStages = allStages.length;

    // Créer la nouvelle étape
    const stageId = await ctx.db.insert("eventStages", {
      eventId: args.eventId,
      name: args.name,
      description: args.description,
      location: args.location,
      address: args.address,
      scheduledAt: args.scheduledAt,
      estimatedDurationMinutes: args.estimatedDurationMinutes,
      order: newOrder,
      stageType: getStageType(newOrder, totalStages),
      createdAt: Date.now(),
    });

    // Mettre à jour les ordres et types des autres étapes
    for (const stage of existingStages) {
      const stageData = allStages.find((s) => s.id === stage._id);
      if (stageData) {
        const newStageOrder = allStages.indexOf(stageData);
        await ctx.db.patch(stage._id, {
          order: newStageOrder,
          stageType: getStageType(newStageOrder, totalStages),
        });
      }
    }

    // Mettre à jour les dates de l'événement
    const sortedStages = allStages.sort((a, b) => a.scheduledAt - b.scheduledAt);
    await ctx.db.patch(args.eventId, {
      startsAt: sortedStages[0]!.scheduledAt,
      endsAt: sortedStages[sortedStages.length - 1]!.scheduledAt,
      updatedAt: Date.now(),
    });

    return stageId;
  },
});

/**
 * Met à jour une étape
 */
export const update = mutation({
  args: {
    stageId: v.id("eventStages"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      })
    ),
    address: v.optional(v.string()),
    scheduledAt: v.optional(v.number()),
    estimatedDurationMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const stage = await ctx.db.get(args.stageId);
    if (!stage) throw new Error("Stage not found");

    const updates: Record<string, unknown> = {};

    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.location !== undefined) updates.location = args.location;
    if (args.address !== undefined) updates.address = args.address;
    if (args.estimatedDurationMinutes !== undefined) {
      updates.estimatedDurationMinutes = args.estimatedDurationMinutes;
    }

    // Si la date change, il faut recalculer les ordres
    if (args.scheduledAt !== undefined && args.scheduledAt !== stage.scheduledAt) {
      updates.scheduledAt = args.scheduledAt;

      // Récupérer toutes les étapes
      const allStages = await ctx.db
        .query("eventStages")
        .withIndex("by_event", (q) => q.eq("eventId", stage.eventId))
        .collect();

      // Recalculer les ordres
      const updatedStages = allStages.map((s) => ({
        ...s,
        scheduledAt: s._id === args.stageId ? args.scheduledAt : s.scheduledAt,
      }));

      const sortedStages = updatedStages.sort((a, b) => (a.scheduledAt ?? 0) - (b.scheduledAt ?? 0));
      const totalStages = sortedStages.length;

      // Mettre à jour les ordres
      for (let i = 0; i < sortedStages.length; i++) {
        const s = sortedStages[i]!;
        if (s._id === args.stageId) {
          updates.order = i;
          updates.stageType = getStageType(i, totalStages);
        } else {
          await ctx.db.patch(s._id, {
            order: i,
            stageType: getStageType(i, totalStages),
          });
        }
      }

      // Mettre à jour les dates de l'événement
      await ctx.db.patch(stage.eventId, {
        startsAt: sortedStages[0]!.scheduledAt,
        endsAt: sortedStages[sortedStages.length - 1]!.scheduledAt,
        updatedAt: Date.now(),
      });
    }

    await ctx.db.patch(args.stageId, updates);

    // Mettre à jour l'événement
    await ctx.db.patch(stage.eventId, {
      updatedAt: Date.now(),
    });
  },
});

/**
 * Supprime une étape
 */
export const remove = mutation({
  args: { stageId: v.id("eventStages") },
  handler: async (ctx, args) => {
    const stage = await ctx.db.get(args.stageId);
    if (!stage) throw new Error("Stage not found");

    // Récupérer toutes les autres étapes
    const allStages = await ctx.db
      .query("eventStages")
      .withIndex("by_event", (q) => q.eq("eventId", stage.eventId))
      .collect();

    const remainingStages = allStages.filter((s) => s._id !== args.stageId);

    // Vérifier qu'il reste au moins 2 étapes
    if (remainingStages.length < 2) {
      throw new Error("Un événement doit avoir au moins 2 étapes");
    }

    // Supprimer l'étape
    await ctx.db.delete(args.stageId);

    // Recalculer les ordres
    const sortedStages = remainingStages.sort((a, b) => a.scheduledAt - b.scheduledAt);
    const totalStages = sortedStages.length;

    for (let i = 0; i < sortedStages.length; i++) {
      const s = sortedStages[i]!;
      await ctx.db.patch(s._id, {
        order: i,
        stageType: getStageType(i, totalStages),
      });
    }

    // Mettre à jour les dates de l'événement
    await ctx.db.patch(stage.eventId, {
      startsAt: sortedStages[0]!.scheduledAt,
      endsAt: sortedStages[sortedStages.length - 1]!.scheduledAt,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Récupère une étape par son ID
 */
export const get = query({
  args: { stageId: v.id("eventStages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.stageId);
  },
});

/**
 * Liste les étapes d'un événement (triées par ordre)
 */
export const listByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const stages = await ctx.db
      .query("eventStages")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    return stages.sort((a, b) => a.order - b.order);
  },
});
