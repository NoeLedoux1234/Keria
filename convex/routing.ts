import { v } from "convex/values";
import { action, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// Query interne pour éviter la référence circulaire
export const _getParticipants = internalQuery({
  args: { meetId: v.id("meets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("participants")
      .withIndex("by_meet", (q) => q.eq("meetId", args.meetId))
      .collect();
  },
});

// Mutation interne pour éviter la référence circulaire
export const _updateTravelTime = internalMutation({
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
 * Calcule les temps de trajet pour tous les participants vers le midpoint
 */
export const calculateAllRoutes = action({
  args: {
    meetId: v.id("meets"),
    midpointLat: v.number(),
    midpointLng: v.number(),
  },
  handler: async (ctx, args) => {
    // Utiliser la query interne pour éviter la référence circulaire
    const participants = await ctx.runQuery(internal.routing._getParticipants, {
      meetId: args.meetId,
    });

    const results: Array<{
      participantId: Id<"participants">;
      participantName: string;
      transportMode: string;
      durationMinutes?: number;
      distanceKm?: number;
      polyline?: Array<{ lat: number; lng: number }>;
      error?: string;
    }> = [];

    for (const participant of participants) {
      const route = await ctx.runAction(internal.routingInternal.calculateRoute, {
        originLat: participant.location.lat,
        originLng: participant.location.lng,
        destLat: args.midpointLat,
        destLng: args.midpointLng,
        transportMode: participant.transportMode,
      });

      if (route.success && route.durationMinutes !== null && route.distanceKm !== null) {
        // Utiliser la mutation interne
        await ctx.runMutation(internal.routing._updateTravelTime, {
          participantId: participant._id,
          travelTimeMinutes: route.durationMinutes,
          travelDistanceKm: route.distanceKm,
        });

        results.push({
          participantId: participant._id,
          participantName: participant.name,
          transportMode: participant.transportMode,
          durationMinutes: route.durationMinutes,
          distanceKm: route.distanceKm,
          polyline: route.polyline,
        });
      } else {
        results.push({
          participantId: participant._id,
          participantName: participant.name,
          transportMode: participant.transportMode,
          error: route.error,
        });
      }
    }

    return {
      success: true,
      routes: results,
    };
  },
});

/**
 * Calcule les isochrones pour tous les participants d'un meet
 */
export const calculateAllIsochrones = action({
  args: {
    meetId: v.id("meets"),
    durationMinutes: v.number(),
  },
  handler: async (ctx, args) => {
    // Utiliser la query interne
    const participants = await ctx.runQuery(internal.routing._getParticipants, {
      meetId: args.meetId,
    });

    const results: Array<{
      participantId: Id<"participants">;
      participantName: string;
      transportMode: string;
      polygon: Array<{ lat: number; lng: number }>;
    }> = [];

    for (const participant of participants) {
      const result = await ctx.runAction(internal.routingInternal.calculateIsochrone, {
        lat: participant.location.lat,
        lng: participant.location.lng,
        transportMode: participant.transportMode,
        durationMinutes: [args.durationMinutes],
      });

      if (result.success && result.isochrones.length > 0) {
        results.push({
          participantId: participant._id,
          participantName: participant.name,
          transportMode: participant.transportMode,
          polygon: result.isochrones[0]!.polygon,
        });
      }
    }

    return {
      success: true,
      isochrones: results,
    };
  },
});
