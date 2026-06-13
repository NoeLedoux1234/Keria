import { v } from "convex/values";
import { action, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { mapWithConcurrency } from "./lib/concurrency";

// Bound parallel ORS calls so we cut latency without bursting the rate limit.
const ROUTE_CONCURRENCY = 4;

type RouteResult = {
  participantId: Id<"participants">;
  participantName: string;
  transportMode: string;
  durationMinutes?: number;
  distanceKm?: number;
  polyline?: Array<{ lat: number; lng: number }>;
  error?: string;
};

type IsochroneResult = {
  participantId: Id<"participants">;
  participantName: string;
  transportMode: string;
  polygon: Array<{ lat: number; lng: number }>;
};

export const _getParticipants = internalQuery({
  args: { meetId: v.id("meets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("participants")
      .withIndex("by_meet", (q) => q.eq("meetId", args.meetId))
      .collect();
  },
});

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

export const calculateAllRoutes = action({
  args: {
    meetId: v.id("meets"),
    midpointLat: v.number(),
    midpointLng: v.number(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; routes: RouteResult[] }> => {
    const participants = await ctx.runQuery(internal.routing._getParticipants, {
      meetId: args.meetId,
    });

    const results: RouteResult[] = await mapWithConcurrency(
      participants,
      ROUTE_CONCURRENCY,
      async (participant) => {
        const route = await ctx.runAction(internal.routingInternal.calculateRoute, {
          originLat: participant.location.lat,
          originLng: participant.location.lng,
          destLat: args.midpointLat,
          destLng: args.midpointLng,
          transportMode: participant.transportMode,
        });

        if (route.success && route.durationMinutes !== null && route.distanceKm !== null) {
          await ctx.runMutation(internal.routing._updateTravelTime, {
            participantId: participant._id,
            travelTimeMinutes: route.durationMinutes,
            travelDistanceKm: route.distanceKm,
          });

          return {
            participantId: participant._id,
            participantName: participant.name,
            transportMode: participant.transportMode,
            durationMinutes: route.durationMinutes,
            distanceKm: route.distanceKm,
            polyline: route.polyline,
          };
        }

        return {
          participantId: participant._id,
          participantName: participant.name,
          transportMode: participant.transportMode,
          error: route.error,
        };
      }
    );

    return {
      success: true,
      routes: results,
    };
  },
});

export const calculateAllIsochrones = action({
  args: {
    meetId: v.id("meets"),
    durationMinutes: v.number(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; isochrones: IsochroneResult[] }> => {
    const participants = await ctx.runQuery(internal.routing._getParticipants, {
      meetId: args.meetId,
    });

    const computed: Array<IsochroneResult | null> = await mapWithConcurrency(
      participants,
      ROUTE_CONCURRENCY,
      async (participant) => {
        const result = await ctx.runAction(internal.routingInternal.calculateIsochrone, {
          lat: participant.location.lat,
          lng: participant.location.lng,
          transportMode: participant.transportMode,
          durationMinutes: [args.durationMinutes],
        });

        if (result.success && result.isochrones.length > 0) {
          return {
            participantId: participant._id,
            participantName: participant.name,
            transportMode: participant.transportMode,
            polygon: result.isochrones[0]!.polygon,
          };
        }

        return null;
      }
    );

    const results = computed.filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    return {
      success: true,
      isochrones: results,
    };
  },
});
