import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MAX_SHARE_CODE_ATTEMPTS = 10;

function generateShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    creatorName: v.string(),
    creatorLocation: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    creatorAddress: v.optional(v.string()),
    transportMode: v.union(
      v.literal("driving"),
      v.literal("walking"),
      v.literal("cycling"),
      v.literal("transit")
    ),
    filters: v.optional(
      v.object({
        maxTravelTimeMinutes: v.optional(v.number()),
        placeCategories: v.optional(v.array(v.string())),
        priceLevel: v.optional(v.array(v.number())),
        openNow: v.optional(v.boolean()),
      })
    ),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let shareCode = generateShareCode();
    for (let attempt = 0; attempt < MAX_SHARE_CODE_ATTEMPTS; attempt++) {
      const existing = await ctx.db
        .query("meets")
        .withIndex("by_share_code", (q) => q.eq("shareCode", shareCode))
        .first();
      if (!existing) break;
      if (attempt === MAX_SHARE_CODE_ATTEMPTS - 1) {
        throw new Error("Failed to generate unique share code");
      }
      shareCode = generateShareCode();
    }

    const meetId = await ctx.db.insert("meets", {
      name: args.name,
      description: args.description,
      creatorName: args.creatorName,
      shareCode,
      filters: args.filters ?? {},
      status: "pending",
      scheduledFor: args.scheduledFor,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("participants", {
      meetId,
      name: args.creatorName,
      location: args.creatorLocation,
      address: args.creatorAddress,
      transportMode: args.transportMode,
      isCreator: true,
      joinedAt: now,
    });

    return { meetId, shareCode };
  },
});

export const get = query({
  args: { id: v.id("meets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByShareCode = query({
  args: { shareCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("meets")
      .withIndex("by_share_code", (q) => q.eq("shareCode", args.shareCode.toUpperCase()))
      .first();
  },
});

export const getParticipants = query({
  args: { meetId: v.id("meets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("participants")
      .withIndex("by_meet", (q) => q.eq("meetId", args.meetId))
      .collect();
  },
});

export const updateMidpoint = mutation({
  args: {
    meetId: v.id("meets"),
    midpoint: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    fairnessScore: v.number(),
    averageDistanceKm: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.meetId, {
      midpoint: args.midpoint,
      fairnessScore: args.fairnessScore,
      averageDistanceKm: args.averageDistanceKm,
      updatedAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    meetId: v.id("meets"),
    status: v.union(
      v.literal("draft"),
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.meetId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const selectPlace = mutation({
  args: {
    meetId: v.id("meets"),
    placeId: v.id("places"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.meetId, {
      selectedPlaceId: args.placeId,
      status: "confirmed",
      updatedAt: Date.now(),
    });
  },
});

export const updateLastSearchedAt = mutation({
  args: { meetId: v.id("meets") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.meetId, { lastSearchedAt: Date.now() });
  },
});
