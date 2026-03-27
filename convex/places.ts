import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Ajoute un lieu suggéré à un meeting
 */
export const add = mutation({
  args: {
    meetId: v.id("meets"),
    externalId: v.string(),
    name: v.string(),
    address: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    category: v.string(),
    priceLevel: v.optional(v.number()),
    rating: v.optional(v.number()),
    userRatingsTotal: v.optional(v.number()),
    photoUrl: v.optional(v.string()),
    photos: v.optional(v.array(v.string())),
    openNow: v.optional(v.boolean()),
    openingHours: v.optional(v.array(v.string())),
    phoneNumber: v.optional(v.string()),
    website: v.optional(v.string()),
    reviews: v.optional(
      v.array(
        v.object({
          authorName: v.string(),
          authorPhoto: v.optional(v.string()),
          rating: v.number(),
          text: v.string(),
          relativeTime: v.string(),
        })
      )
    ),
    relevanceScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Vérifier si le lieu existe déjà pour ce meeting
    const existing = await ctx.db
      .query("places")
      .withIndex("by_meet", (q) => q.eq("meetId", args.meetId))
      .filter((q) => q.eq(q.field("externalId"), args.externalId))
      .first();

    if (existing) {
      // Mettre à jour les infos
      await ctx.db.patch(existing._id, {
        name: args.name,
        address: args.address,
        location: args.location,
        priceLevel: args.priceLevel,
        rating: args.rating,
        userRatingsTotal: args.userRatingsTotal,
        photoUrl: args.photoUrl,
        photos: args.photos,
        openNow: args.openNow,
        openingHours: args.openingHours,
        phoneNumber: args.phoneNumber,
        website: args.website,
        reviews: args.reviews,
        relevanceScore: args.relevanceScore,
        lastRefreshedAt: Date.now(),
      });
      return existing._id;
    }

    const now = Date.now();
    return await ctx.db.insert("places", {
      meetId: args.meetId,
      externalId: args.externalId,
      name: args.name,
      address: args.address,
      location: args.location,
      category: args.category,
      priceLevel: args.priceLevel,
      rating: args.rating,
      userRatingsTotal: args.userRatingsTotal,
      photoUrl: args.photoUrl,
      photos: args.photos,
      openNow: args.openNow,
      openingHours: args.openingHours,
      phoneNumber: args.phoneNumber,
      website: args.website,
      reviews: args.reviews,
      relevanceScore: args.relevanceScore,
      createdAt: now,
      lastRefreshedAt: now,
    });
  },
});

/**
 * Récupère les lieux suggérés pour un meeting
 */
export const listByMeet = query({
  args: { meetId: v.id("meets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withIndex("by_meet", (q) => q.eq("meetId", args.meetId))
      .collect();
  },
});

/**
 * Récupère les lieux par catégorie
 */
export const listByCategory = query({
  args: {
    meetId: v.id("meets"),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withIndex("by_category", (q) => q.eq("meetId", args.meetId).eq("category", args.category))
      .collect();
  },
});

/**
 * Supprime tous les lieux d'un meeting
 */
export const clearByMeet = mutation({
  args: { meetId: v.id("meets") },
  handler: async (ctx, args) => {
    const places = await ctx.db
      .query("places")
      .withIndex("by_meet", (q) => q.eq("meetId", args.meetId))
      .collect();

    for (const place of places) {
      // Supprimer les votes associés
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
