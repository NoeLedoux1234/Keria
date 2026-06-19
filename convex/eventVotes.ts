import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const cast = mutation({
  args: {
    eventStageId: v.id("eventStages"),
    placeId: v.id("places"),
    eventParticipantId: v.id("eventParticipants"),
    vote: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db.get(args.eventParticipantId);
    if (!participant) {
      throw new Error("Participant non trouvé");
    }

    const place = await ctx.db.get(args.placeId);
    if (!place || place.eventStageId !== args.eventStageId) {
      throw new Error("Lieu invalide pour cette étape");
    }

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_stage_participant", (q) =>
        q.eq("eventStageId", args.eventStageId).eq("eventParticipantId", args.eventParticipantId)
      )
      .filter((q) => q.eq(q.field("placeId"), args.placeId))
      .first();

    if (existingVote) {
      await ctx.db.patch(existingVote._id, {
        vote: args.vote,
        votedAt: Date.now(),
      });
      return existingVote._id;
    }

    return await ctx.db.insert("votes", {
      eventStageId: args.eventStageId,
      placeId: args.placeId,
      eventParticipantId: args.eventParticipantId,
      vote: args.vote,
      votedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    eventStageId: v.id("eventStages"),
    placeId: v.id("places"),
    eventParticipantId: v.id("eventParticipants"),
  },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("votes")
      .withIndex("by_stage_participant", (q) =>
        q.eq("eventStageId", args.eventStageId).eq("eventParticipantId", args.eventParticipantId)
      )
      .filter((q) => q.eq(q.field("placeId"), args.placeId))
      .first();

    if (vote) {
      await ctx.db.delete(vote._id);
    }
  },
});

export const listByStage = query({
  args: { eventStageId: v.id("eventStages") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("votes")
      .withIndex("by_stage", (q) => q.eq("eventStageId", args.eventStageId))
      .collect();
  },
});

export const getStageScore = query({
  args: { placeId: v.id("places") },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_place", (q) => q.eq("placeId", args.placeId))
      .collect();

    const upvotes = votes.filter((vote) => vote.vote === "up").length;
    const downvotes = votes.filter((vote) => vote.vote === "down").length;

    return {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
      total: votes.length,
    };
  },
});

export const getStageRanking = query({
  args: { eventStageId: v.id("eventStages") },
  handler: async (ctx, args) => {
    const places = await ctx.db
      .query("places")
      .withIndex("by_stage", (q) => q.eq("eventStageId", args.eventStageId))
      .collect();

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_stage", (q) => q.eq("eventStageId", args.eventStageId))
      .collect();

    const placeScores = places.map((place) => {
      const placeVotes = votes.filter((vote) => vote.placeId === place._id);
      const upvotes = placeVotes.filter((vote) => vote.vote === "up").length;
      const downvotes = placeVotes.filter((vote) => vote.vote === "down").length;

      return {
        place,
        upvotes,
        downvotes,
        score: upvotes - downvotes,
      };
    });

    return placeScores.sort((a, b) => b.score - a.score);
  },
});
