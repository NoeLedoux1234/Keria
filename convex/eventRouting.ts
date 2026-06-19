import { v } from "convex/values";
import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const DEPARTURE_SAFETY_MARGIN_MS = 5 * 60 * 1000;

type Coordinates = {
  lat: number;
  lng: number;
};

type ItinerarySegment = {
  fromStageId?: Id<"eventStages">;
  toStageId: Id<"eventStages">;
  durationMinutes: number;
  distanceKm: number;
  polyline: Coordinates[];
  error?: string;
};

type ItineraryResult =
  | { success: false; error: string }
  | {
      success: true;
      totalDurationMinutes: number;
      totalDistanceKm: number;
      recommendedDepartureAt: number;
      segments: ItinerarySegment[];
    };

const segmentValidator = v.object({
  fromStageId: v.optional(v.id("eventStages")),
  toStageId: v.id("eventStages"),
  durationMinutes: v.number(),
  distanceKm: v.number(),
  polyline: v.array(
    v.object({
      lat: v.number(),
      lng: v.number(),
    })
  ),
});

export const _getParticipant = internalQuery({
  args: { eventParticipantId: v.id("eventParticipants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.eventParticipantId);
  },
});

export const _getStages = internalQuery({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const stages = await ctx.db
      .query("eventStages")
      .withIndex("by_event_order", (q) => q.eq("eventId", args.eventId))
      .collect();

    return stages.sort((a, b) => a.order - b.order);
  },
});

export const _saveItinerary = internalMutation({
  args: {
    eventId: v.id("events"),
    eventParticipantId: v.id("eventParticipants"),
    totalDurationMinutes: v.number(),
    totalDistanceKm: v.number(),
    recommendedDepartureAt: v.number(),
    segments: v.array(segmentValidator),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existing = await ctx.db
      .query("eventItineraries")
      .withIndex("by_participant", (q) => q.eq("eventParticipantId", args.eventParticipantId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        totalDurationMinutes: args.totalDurationMinutes,
        totalDistanceKm: args.totalDistanceKm,
        recommendedDepartureAt: args.recommendedDepartureAt,
        segments: args.segments,
        computedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("eventItineraries", {
      eventId: args.eventId,
      eventParticipantId: args.eventParticipantId,
      totalDurationMinutes: args.totalDurationMinutes,
      totalDistanceKm: args.totalDistanceKm,
      recommendedDepartureAt: args.recommendedDepartureAt,
      segments: args.segments,
      computedAt: now,
    });
  },
});

export const calculateParticipantItinerary = action({
  args: {
    eventId: v.id("events"),
    eventParticipantId: v.id("eventParticipants"),
  },
  handler: async (ctx, args): Promise<ItineraryResult> => {
    const participant = await ctx.runQuery(internal.eventRouting._getParticipant, {
      eventParticipantId: args.eventParticipantId,
    });

    if (!participant) {
      return { success: false as const, error: "Participant non trouvé" };
    }

    if (!participant.location || !participant.transportMode) {
      return { success: false as const, error: "Logistique du participant manquante" };
    }

    const stages = await ctx.runQuery(internal.eventRouting._getStages, {
      eventId: args.eventId,
    });

    const [firstStage, ...remainingStages] = stages;
    if (!firstStage) {
      return { success: false as const, error: "Aucune étape pour cet événement" };
    }

    const transportMode = participant.transportMode;

    const legs: Array<{
      fromStageId?: Id<"eventStages">;
      toStageId: Id<"eventStages">;
      origin: Coordinates;
      destination: Coordinates;
    }> = [
      {
        toStageId: firstStage._id,
        origin: participant.location,
        destination: firstStage.location,
      },
    ];

    let previousStage = firstStage;
    for (const stage of remainingStages) {
      legs.push({
        fromStageId: previousStage._id,
        toStageId: stage._id,
        origin: previousStage.location,
        destination: stage.location,
      });
      previousStage = stage;
    }

    const segments: ItinerarySegment[] = [];
    let totalDurationMinutes = 0;
    let totalDistanceKm = 0;

    for (const leg of legs) {
      const route = await ctx.runAction(internal.routingInternal.calculateRoute, {
        originLat: leg.origin.lat,
        originLng: leg.origin.lng,
        destLat: leg.destination.lat,
        destLng: leg.destination.lng,
        transportMode,
      });

      if (route.success && route.durationMinutes !== null && route.distanceKm !== null) {
        totalDurationMinutes += route.durationMinutes;
        totalDistanceKm += route.distanceKm;
        segments.push({
          fromStageId: leg.fromStageId,
          toStageId: leg.toStageId,
          durationMinutes: route.durationMinutes,
          distanceKm: route.distanceKm,
          polyline: route.polyline,
        });
      } else {
        segments.push({
          fromStageId: leg.fromStageId,
          toStageId: leg.toStageId,
          durationMinutes: 0,
          distanceKm: 0,
          polyline: [],
          error: route.error,
        });
      }
    }

    const firstSegment = segments[0];
    const firstSegmentDurationMinutes = firstSegment ? firstSegment.durationMinutes : 0;
    const recommendedDepartureAt =
      firstStage.scheduledAt - firstSegmentDurationMinutes * 60 * 1000 - DEPARTURE_SAFETY_MARGIN_MS;

    await ctx.runMutation(internal.eventRouting._saveItinerary, {
      eventId: args.eventId,
      eventParticipantId: args.eventParticipantId,
      totalDurationMinutes,
      totalDistanceKm,
      recommendedDepartureAt,
      segments: segments.map((segment) => ({
        fromStageId: segment.fromStageId,
        toStageId: segment.toStageId,
        durationMinutes: segment.durationMinutes,
        distanceKm: segment.distanceKm,
        polyline: segment.polyline,
      })),
    });

    return {
      success: true as const,
      totalDurationMinutes,
      totalDistanceKm,
      recommendedDepartureAt,
      segments,
    };
  },
});

export const getItinerary = query({
  args: { eventParticipantId: v.id("eventParticipants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventItineraries")
      .withIndex("by_participant", (q) => q.eq("eventParticipantId", args.eventParticipantId))
      .first();
  },
});
