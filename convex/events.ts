import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MAX_SHARE_CODE_ATTEMPTS = 10;

function generateEventShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "E";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getStageType(order: number, totalStages: number): "departure" | "intermediate" | "arrival" {
  if (order === 0) return "departure";
  if (order === totalStages - 1) return "arrival";
  return "intermediate";
}

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
    if (args.stages.length < 2) {
      throw new Error("Un événement doit avoir au moins 2 étapes (départ et arrivée)");
    }

    const now = Date.now();

    let shareCode = generateEventShareCode();
    for (let attempt = 0; attempt < MAX_SHARE_CODE_ATTEMPTS; attempt++) {
      const existing = await ctx.db
        .query("events")
        .withIndex("by_share_code", (q) => q.eq("shareCode", shareCode))
        .first();
      if (!existing) break;
      if (attempt === MAX_SHARE_CODE_ATTEMPTS - 1) {
        throw new Error("Failed to generate unique share code");
      }
      shareCode = generateEventShareCode();
    }

    const sortedStages = [...args.stages].sort((a, b) => a.scheduledAt - b.scheduledAt);

    const eventId = await ctx.db.insert("events", {
      name: args.name,
      description: args.description,
      creatorName: args.creatorName,
      shareCode,
      status: "published",
      startsAt: sortedStages[0]!.scheduledAt,
      endsAt: sortedStages[sortedStages.length - 1]!.scheduledAt,
      createdAt: now,
      updatedAt: now,
    });

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

export const get = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByShareCode = query({
  args: { shareCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_share_code", (q) => q.eq("shareCode", args.shareCode.toUpperCase()))
      .first();
  },
});

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

export const getParticipants = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
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

export const update = mutation({
  args: {
    eventId: v.id("events"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Partial<{ name: string; description: string; updatedAt: number }> = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.eventId, updates);
  },
});

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

export const remove = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const stages = await ctx.db
      .query("eventStages")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const stage of stages) {
      await ctx.db.delete(stage._id);
    }

    const participants = await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const participant of participants) {
      await ctx.db.delete(participant._id);
    }

    await ctx.db.delete(args.eventId);
  },
});
