import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Ajoute un participant à un meeting
 */
export const join = mutation({
  args: {
    meetId: v.id("meets"),
    name: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    address: v.optional(v.string()),
    transportMode: v.union(
      v.literal("driving"),
      v.literal("walking"),
      v.literal("cycling"),
      v.literal("transit")
    ),
  },
  handler: async (ctx, args) => {
    const meet = await ctx.db.get(args.meetId);
    if (!meet) {
      throw new Error("Meeting not found");
    }

    if (meet.status === "cancelled" || meet.status === "completed") {
      throw new Error("Cannot join a cancelled or completed meeting");
    }

    // Vérifier si le participant existe déjà (par nom pour l'instant)
    const existingParticipant = await ctx.db
      .query("participants")
      .withIndex("by_meet", (q) => q.eq("meetId", args.meetId))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existingParticipant) {
      // Mettre à jour la localisation existante
      await ctx.db.patch(existingParticipant._id, {
        location: args.location,
        address: args.address,
        transportMode: args.transportMode,
      });
      return existingParticipant._id;
    }

    // Créer nouveau participant
    const participantId = await ctx.db.insert("participants", {
      meetId: args.meetId,
      name: args.name,
      location: args.location,
      address: args.address,
      transportMode: args.transportMode,
      isCreator: false,
      joinedAt: Date.now(),
    });

    // Mettre à jour le timestamp du meeting
    await ctx.db.patch(args.meetId, {
      updatedAt: Date.now(),
    });

    return participantId;
  },
});

/**
 * Met à jour la localisation d'un participant
 */
export const updateLocation = mutation({
  args: {
    participantId: v.id("participants"),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db.get(args.participantId);
    if (!participant) {
      throw new Error("Participant not found");
    }

    await ctx.db.patch(args.participantId, {
      location: args.location,
      address: args.address,
    });

    // Mettre à jour le timestamp du meeting
    await ctx.db.patch(participant.meetId, {
      updatedAt: Date.now(),
    });
  },
});

/**
 * Met à jour le temps de trajet d'un participant
 */
export const updateTravelTime = mutation({
  args: {
    participantId: v.id("participants"),
    travelTimeMinutes: v.number(),
    travelDistanceKm: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.participantId, {
      travelTimeMinutes: args.travelTimeMinutes,
      travelDistanceKm: args.travelDistanceKm,
    });
  },
});

/**
 * Supprime un participant
 */
export const remove = mutation({
  args: {
    participantId: v.id("participants"),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db.get(args.participantId);
    if (!participant) {
      throw new Error("Participant not found");
    }

    if (participant.isCreator) {
      throw new Error("Cannot remove the creator");
    }

    // Supprimer les votes du participant
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    // Supprimer le participant
    await ctx.db.delete(args.participantId);

    // Mettre à jour le timestamp du meeting
    await ctx.db.patch(participant.meetId, {
      updatedAt: Date.now(),
    });
  },
});

/**
 * Récupère un participant par ID
 */
export const get = query({
  args: { id: v.id("participants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
