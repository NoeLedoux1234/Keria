import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  meets: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    creatorName: v.string(),
    shareCode: v.string(),

    midpoint: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      })
    ),

    fairnessScore: v.optional(v.number()),
    averageDistanceKm: v.optional(v.number()),

    filters: v.object({
      maxTravelTimeMinutes: v.optional(v.number()),
      placeCategories: v.optional(v.array(v.string())),
      priceLevel: v.optional(v.array(v.number())),
      openNow: v.optional(v.boolean()),
    }),

    selectedPlaceId: v.optional(v.string()),

    status: v.union(
      v.literal("draft"),
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),

    scheduledFor: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),

    lastSearchedAt: v.optional(v.number()),
  })
    .index("by_creator", ["creatorName"])
    .index("by_share_code", ["shareCode"])
    .index("by_status", ["status"]),

  participants: defineTable({
    meetId: v.id("meets"),
    userId: v.optional(v.string()),
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

    travelTimeMinutes: v.optional(v.number()),
    travelDistanceKm: v.optional(v.number()),

    isCreator: v.boolean(),
    joinedAt: v.number(),
  })
    .index("by_meet", ["meetId"])
    .index("by_user", ["userId"]),

  places: defineTable({
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

    createdAt: v.number(),

    lastRefreshedAt: v.optional(v.number()),
  })
    .index("by_meet", ["meetId"])
    .index("by_category", ["meetId", "category"]),

  votes: defineTable({
    meetId: v.id("meets"),
    placeId: v.id("places"),
    participantId: v.id("participants"),

    vote: v.union(v.literal("up"), v.literal("down")),

    votedAt: v.number(),
  })
    .index("by_meet", ["meetId"])
    .index("by_place", ["placeId"])
    .index("by_participant", ["participantId"])
    .index("by_place_participant", ["placeId", "participantId"]),

  events: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    creatorName: v.string(),
    shareCode: v.string(),

    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("ongoing"),
      v.literal("completed"),
      v.literal("cancelled")
    ),

    startsAt: v.number(),
    endsAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creator", ["creatorName"])
    .index("by_share_code", ["shareCode"])
    .index("by_status", ["status"]),

  eventStages: defineTable({
    eventId: v.id("events"),

    name: v.string(),
    description: v.optional(v.string()),

    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    address: v.string(),

    scheduledAt: v.number(),
    estimatedDurationMinutes: v.optional(v.number()),

    order: v.number(),
    stageType: v.union(
      v.literal("departure"),
      v.literal("intermediate"),
      v.literal("arrival")
    ),

    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_order", ["eventId", "order"]),

  eventParticipants: defineTable({
    eventId: v.id("events"),
    userId: v.optional(v.string()),
    name: v.string(),

    rsvpStatus: v.union(
      v.literal("yes"),
      v.literal("no"),
      v.literal("maybe"),
      v.literal("pending")
    ),

    isCreator: v.boolean(),
    respondedAt: v.optional(v.number()),
    joinedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_rsvp", ["eventId", "rsvpStatus"]),
});
