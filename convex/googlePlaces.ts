import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const GOOGLE_PLACES_BASE_URL = "https://places.googleapis.com/v1/places";

const CATEGORY_TO_GOOGLE_TYPES: Record<string, string[]> = {
  restaurant: ["restaurant", "french_restaurant", "italian_restaurant", "japanese_restaurant", "chinese_restaurant", "indian_restaurant", "mexican_restaurant", "thai_restaurant", "vietnamese_restaurant", "korean_restaurant", "mediterranean_restaurant", "american_restaurant"],
  cafe: ["cafe", "coffee_shop"],
  bar: ["bar", "wine_bar"],
  fast_food: ["fast_food_restaurant", "hamburger_restaurant", "pizza_restaurant", "sandwich_shop"],
  cinema: ["movie_theater"],
  park: ["park"],
};

interface GooglePlace {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
  }>;
  regularOpeningHours?: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  reviews?: Array<{
    name: string;
    rating: number;
    text?: {
      text: string;
      languageCode: string;
    };
    authorAttribution: {
      displayName: string;
      photoUri?: string;
    };
    relativePublishTimeDescription: string;
  }>;
  primaryType?: string;
  types?: string[];
}

interface PlacesResponse {
  places: GooglePlace[];
}

function getPhotoUrl(photoName: string, apiKey: string, maxWidth = 400): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${apiKey}`;
}

function getCategoryFromTypes(types: string[] | undefined): string {
  if (!types) return "other";

  for (const type of types) {
    if (type.includes("restaurant") || type === "restaurant") return "restaurant";
    if (type === "cafe" || type === "coffee_shop") return "cafe";
    if (type.includes("bar")) return "bar";
    if (type.includes("fast_food") || type === "hamburger_restaurant" || type === "pizza_restaurant") return "fast_food";
    if (type === "movie_theater") return "cinema";
    if (type.includes("park")) return "park";
  }

  return "other";
}

function getPriceLevelNumber(priceLevel: string | undefined): number | undefined {
  if (!priceLevel) return undefined;

  const mapping: Record<string, number> = {
    "PRICE_LEVEL_FREE": 0,
    "PRICE_LEVEL_INEXPENSIVE": 1,
    "PRICE_LEVEL_MODERATE": 2,
    "PRICE_LEVEL_EXPENSIVE": 3,
    "PRICE_LEVEL_VERY_EXPENSIVE": 4,
  };

  return mapping[priceLevel];
}

const CACHE_TTL_MS = 60 * 60 * 1000;

export const _searchNearby = internalAction({
  args: {
    meetId: v.id("meets"),
    lat: v.number(),
    lng: v.number(),
    radiusMeters: v.optional(v.number()),
    categories: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const meet = await ctx.runQuery(api.meets.get, { id: args.meetId });
    const now = Date.now();

    if (meet?.lastSearchedAt && (now - meet.lastSearchedAt) < CACHE_TTL_MS) {
      const cached = await ctx.runQuery(api.places.listByMeet, { meetId: args.meetId });
      if (cached.length > 0) {
        return {
          success: true,
          count: cached.length,
          places: cached,
          fromCache: true,
        };
      }
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        count: 0,
        places: [],
        error: "GOOGLE_PLACES_API_KEY not configured",
      };
    }

    const radius = args.radiusMeters ?? 1000;
    const limit = args.limit ?? 15;
    const categories = args.categories ?? ["restaurant", "cafe", "bar"];

    const includedTypes = categories.flatMap(
      (cat) => CATEGORY_TO_GOOGLE_TYPES[cat] ?? []
    );

    if (includedTypes.length === 0) {
      includedTypes.push("restaurant", "cafe", "bar");
    }

    try {
      const response = await fetch(`${GOOGLE_PLACES_BASE_URL}:searchNearby`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.photos,places.regularOpeningHours,places.primaryType,places.types,places.nationalPhoneNumber,places.websiteUri,places.reviews",
        },
        body: JSON.stringify({
          includedTypes,
          maxResultCount: limit,
          locationRestriction: {
            circle: {
              center: {
                latitude: args.lat,
                longitude: args.lng,
              },
              radius: radius,
            },
          },
          rankPreference: "DISTANCE",
          languageCode: "fr",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google Places API error:", errorText);
        return {
          success: false,
          count: 0,
          places: [],
          error: `Google Places API error: ${response.status}`,
        };
      }

      const data: PlacesResponse = await response.json();
      const googlePlaces = data.places || [];

      const places = googlePlaces.map((place) => {
        const category = getCategoryFromTypes(place.types);

        const photos = place.photos?.slice(0, 5).map((photo) =>
          getPhotoUrl(photo.name, apiKey, 800)
        ) ?? [];

        const photoUrl = photos[0];

        const reviews = place.reviews?.slice(0, 5).map((review) => ({
          authorName: review.authorAttribution.displayName,
          authorPhoto: review.authorAttribution.photoUri,
          rating: review.rating,
          text: review.text?.text ?? "",
          relativeTime: review.relativePublishTimeDescription,
        })) ?? [];

        return {
          externalId: `google-${place.id}`,
          name: place.displayName.text,
          address: place.formattedAddress,
          location: {
            lat: place.location.latitude,
            lng: place.location.longitude,
          },
          category,
          rating: place.rating,
          userRatingsTotal: place.userRatingCount,
          priceLevel: getPriceLevelNumber(place.priceLevel),
          photoUrl,
          photos,
          openNow: place.regularOpeningHours?.openNow,
          openingHours: place.regularOpeningHours?.weekdayDescriptions,
          phoneNumber: place.nationalPhoneNumber,
          website: place.websiteUri,
          reviews,
        };
      });

      for (const place of places) {
        await ctx.runMutation(api.places.add, {
          meetId: args.meetId,
          externalId: place.externalId,
          name: place.name,
          address: place.address,
          location: place.location,
          category: place.category,
          rating: place.rating,
          userRatingsTotal: place.userRatingsTotal,
          priceLevel: place.priceLevel,
          photoUrl: place.photoUrl,
          photos: place.photos,
          openNow: place.openNow,
          openingHours: place.openingHours,
          phoneNumber: place.phoneNumber,
          website: place.website,
          reviews: place.reviews,
        });
      }

      await ctx.runMutation(api.meets.updateLastSearchedAt, { meetId: args.meetId });

      return {
        success: true,
        count: places.length,
        places,
        fromCache: false,
      };
    } catch (error) {
      console.error("Error searching Google Places:", error);
      return {
        success: false,
        count: 0,
        places: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const searchNearby = action({
  args: {
    meetId: v.id("meets"),
    lat: v.number(),
    lng: v.number(),
    radiusMeters: v.optional(v.number()),
    categories: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.runAction(internal.googlePlaces._searchNearby, args);
  },
});

export const searchContextual = action({
  args: {
    meetId: v.id("meets"),
    lat: v.number(),
    lng: v.number(),
    radiusMeters: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const hour = new Date().getHours();

    let categories: string[];
    if (hour >= 6 && hour < 11) {
      categories = ["cafe"];
    } else if (hour >= 11 && hour < 15) {
      categories = ["restaurant", "fast_food"];
    } else if (hour >= 15 && hour < 18) {
      categories = ["cafe"];
    } else if (hour >= 18 && hour < 22) {
      categories = ["restaurant", "bar"];
    } else {
      categories = ["bar"];
    }

    return await ctx.runAction(internal.googlePlaces._searchNearby, {
      meetId: args.meetId,
      lat: args.lat,
      lng: args.lng,
      radiusMeters: args.radiusMeters,
      categories,
    });
  },
});
