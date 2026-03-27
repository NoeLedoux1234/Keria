import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const cast = mutation({
  args: {
    meetId: v.id("meets"),
    placeId: v.id("places"),
    participantId: v.id("participants"),
    vote: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db.get(args.participantId);
    if (!participant || participant.meetId !== args.meetId) {
      throw new Error("Invalid participant");
    }

    const place = await ctx.db.get(args.placeId);
    if (!place || place.meetId !== args.meetId) {
      throw new Error("Invalid place");
    }

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_place_participant", (q) =>
        q.eq("placeId", args.placeId).eq("participantId", args.participantId)
      )
      .first();

    if (existingVote) {
      await ctx.db.patch(existingVote._id, {
        vote: args.vote,
        votedAt: Date.now(),
      });
      return existingVote._id;
    }

    return await ctx.db.insert("votes", {
      meetId: args.meetId,
      placeId: args.placeId,
      participantId: args.participantId,
      vote: args.vote,
      votedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    placeId: v.id("places"),
    participantId: v.id("participants"),
  },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("votes")
      .withIndex("by_place_participant", (q) =>
        q.eq("placeId", args.placeId).eq("participantId", args.participantId)
      )
      .first();

    if (vote) {
      await ctx.db.delete(vote._id);
    }
  },
});

export const listByMeet = query({
  args: { meetId: v.id("meets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("votes")
      .withIndex("by_meet", (q) => q.eq("meetId", args.meetId))
      .collect();
  },
});

export const listByPlace = query({
  args: { placeId: v.id("places") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("votes")
      .withIndex("by_place", (q) => q.eq("placeId", args.placeId))
      .collect();
  },
});

export const getPlaceScore = query({
  args: { placeId: v.id("places") },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_place", (q) => q.eq("placeId", args.placeId))
      .collect();

    const upvotes = votes.filter((v) => v.vote === "up").length;
    const downvotes = votes.filter((v) => v.vote === "down").length;

    return {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
      total: votes.length,
    };
  },
});

export const getPlaceRanking = query({
  args: { meetId: v.id("meets") },
  handler: async (ctx, args) => {
    const places = await ctx.db
      .query("places")
      .withIndex("by_meet", (q) => q.eq("meetId", args.meetId))
      .collect();

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_meet", (q) => q.eq("meetId", args.meetId))
      .collect();

    const placeScores = places.map((place) => {
      const placeVotes = votes.filter((v) => v.placeId === place._id);
      const upvotes = placeVotes.filter((v) => v.vote === "up").length;
      const downvotes = placeVotes.filter((v) => v.vote === "down").length;

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
