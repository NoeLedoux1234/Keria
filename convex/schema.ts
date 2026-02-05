import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Schéma de la base de données MeetPoint
 */
export default defineSchema({
  /**
   * Table des meetings
   */
  meets: defineTable({
    // Infos de base
    name: v.string(),
    description: v.optional(v.string()),
    creatorId: v.string(),
    shareCode: v.string(), // Code court pour rejoindre (ex: "ABC123")

    // Point de rencontre calculé
    midpoint: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      })
    ),

    // Métriques d'équité
    fairnessScore: v.optional(v.number()),
    averageDistanceKm: v.optional(v.number()),

    // Filtres de recherche
    filters: v.object({
      maxTravelTimeMinutes: v.optional(v.number()),
      placeCategories: v.optional(v.array(v.string())),
      priceLevel: v.optional(v.array(v.number())),
      openNow: v.optional(v.boolean()),
    }),

    // Lieu sélectionné
    selectedPlaceId: v.optional(v.string()),

    // Statut
    status: v.union(
      v.literal("draft"),
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),

    // Dates
    scheduledFor: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creator", ["creatorId"])
    .index("by_share_code", ["shareCode"])
    .index("by_status", ["status"]),

  /**
   * Table des participants
   */
  participants: defineTable({
    meetId: v.id("meets"),
    userId: v.optional(v.string()), // Peut être anonyme
    name: v.string(),

    // Localisation
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    address: v.optional(v.string()),

    // Mode de transport
    transportMode: v.union(
      v.literal("driving"),
      v.literal("walking"),
      v.literal("cycling"),
      v.literal("transit")
    ),

    // Temps de trajet calculé vers le midpoint
    travelTimeMinutes: v.optional(v.number()),
    travelDistanceKm: v.optional(v.number()),

    // Métadonnées
    isCreator: v.boolean(),
    joinedAt: v.number(),
  })
    .index("by_meet", ["meetId"])
    .index("by_user", ["userId"]),

  /**
   * Table des lieux suggérés
   */
  places: defineTable({
    meetId: v.id("meets"),
    externalId: v.string(), // ID Google Places ou autre

    // Infos du lieu
    name: v.string(),
    address: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),

    // Catégorie et prix
    category: v.string(),
    priceLevel: v.optional(v.number()),

    // Métriques
    rating: v.optional(v.number()),
    userRatingsTotal: v.optional(v.number()),

    // Photos (multiple)
    photoUrl: v.optional(v.string()), // Photo principale
    photos: v.optional(v.array(v.string())), // Toutes les photos

    // Horaires d'ouverture
    openNow: v.optional(v.boolean()),
    openingHours: v.optional(v.array(v.string())), // Ex: ["Lundi: 9h-18h", ...]

    // Contact
    phoneNumber: v.optional(v.string()),
    website: v.optional(v.string()),

    // Avis
    reviews: v.optional(
      v.array(
        v.object({
          authorName: v.string(),
          authorPhoto: v.optional(v.string()),
          rating: v.number(),
          text: v.string(),
          relativeTime: v.string(), // Ex: "il y a 2 semaines"
        })
      )
    ),

    // Score de pertinence (calculé)
    relevanceScore: v.optional(v.number()),

    createdAt: v.number(),
  })
    .index("by_meet", ["meetId"])
    .index("by_category", ["meetId", "category"]),

  /**
   * Table des votes
   */
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

  // ============================================
  // ÉVÉNEMENTS (Multi-étapes)
  // ============================================

  /**
   * Table des événements
   */
  events: defineTable({
    // Infos de base
    name: v.string(),
    description: v.optional(v.string()),
    creatorId: v.string(),
    shareCode: v.string(), // Code court pour rejoindre (ex: "EVT123")

    // Statut
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("ongoing"),
      v.literal("completed"),
      v.literal("cancelled")
    ),

    // Dates (calculées à partir des étapes)
    startsAt: v.number(), // Timestamp de la première étape
    endsAt: v.optional(v.number()), // Timestamp de la dernière étape

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creator", ["creatorId"])
    .index("by_share_code", ["shareCode"])
    .index("by_status", ["status"]),

  /**
   * Table des étapes d'événements
   */
  eventStages: defineTable({
    eventId: v.id("events"),

    // Infos de base
    name: v.string(),
    description: v.optional(v.string()),

    // Localisation
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    address: v.string(),

    // Horaires
    scheduledAt: v.number(), // Timestamp de l'étape
    estimatedDurationMinutes: v.optional(v.number()),

    // Ordre dans l'événement
    order: v.number(), // 0 = départ, max = arrivée
    stageType: v.union(
      v.literal("departure"),
      v.literal("intermediate"),
      v.literal("arrival")
    ),

    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_order", ["eventId", "order"]),

  /**
   * Table des participants aux événements (RSVP)
   */
  eventParticipants: defineTable({
    eventId: v.id("events"),
    userId: v.optional(v.string()),
    name: v.string(),

    // Réponse RSVP
    rsvpStatus: v.union(
      v.literal("yes"),
      v.literal("no"),
      v.literal("maybe"),
      v.literal("pending")
    ),

    // Métadonnées
    isCreator: v.boolean(),
    respondedAt: v.optional(v.number()),
    joinedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_rsvp", ["eventId", "rsvpStatus"]),
});
