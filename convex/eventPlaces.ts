import { v } from "convex/values";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { OverpassPlace } from "./searchPlaces";

interface StageSearchResult {
  success: boolean;
  count: number;
  error?: string;
}

export const addForStage = internalMutation({
  args: {
    eventStageId: v.id("eventStages"),
    externalId: v.string(),
    name: v.string(),
    address: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("places")
      .withIndex("by_stage", (q) => q.eq("eventStageId", args.eventStageId))
      .filter((q) => q.eq(q.field("externalId"), args.externalId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        address: args.address,
        location: args.location,
        lastRefreshedAt: Date.now(),
      });
      return existing._id;
    }

    const now = Date.now();
    return await ctx.db.insert("places", {
      eventStageId: args.eventStageId,
      externalId: args.externalId,
      name: args.name,
      address: args.address,
      location: args.location,
      category: args.category,
      createdAt: now,
      lastRefreshedAt: now,
    });
  },
});

export const listByStage = query({
  args: { eventStageId: v.id("eventStages") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withIndex("by_stage", (q) => q.eq("eventStageId", args.eventStageId))
      .collect();
  },
});

export const searchForStage = action({
  args: {
    eventStageId: v.id("eventStages"),
    radiusMeters: v.optional(v.number()),
    categories: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<StageSearchResult> => {
    const stage = await ctx.runQuery(internal.eventStages.getInternal, {
      stageId: args.eventStageId,
    });

    if (!stage) {
      return {
        success: false,
        count: 0,
        error: "Étape non trouvée",
      };
    }

    try {
      const places: OverpassPlace[] = await ctx.runAction(
        internal.searchPlaces._fetchOverpassPlaces,
        {
          lat: stage.location.lat,
          lng: stage.location.lng,
          radiusMeters: args.radiusMeters,
          categories: args.categories,
          limit: args.limit,
        }
      );

      for (const place of places) {
        await ctx.runMutation(internal.eventPlaces.addForStage, {
          eventStageId: args.eventStageId,
          externalId: place.externalId,
          name: place.name,
          address: place.address,
          location: place.location,
          category: place.category,
        });
      }

      return {
        success: true,
        count: places.length,
      };
    } catch (error) {
      console.error("Error searching stage places:", error);
      return {
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const clearByStage = mutation({
  args: { eventStageId: v.id("eventStages") },
  handler: async (ctx, args) => {
    const places = await ctx.db
      .query("places")
      .withIndex("by_stage", (q) => q.eq("eventStageId", args.eventStageId))
      .collect();

    for (const place of places) {
      const votes = await ctx.db
        .query("votes")
        .withIndex("by_place", (q) => q.eq("placeId", place._id))
        .collect();

      for (const vote of votes) {
        await ctx.db.delete(vote._id);
      }

      await ctx.db.delete(place._id);
    }
  },
});
