import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const PLACE_CATEGORIES = {
  restaurant: ["amenity=restaurant"],
  cafe: ["amenity=cafe"],
  bar: ["amenity=bar", "amenity=pub"],
  fast_food: ["amenity=fast_food"],
  cinema: ["amenity=cinema"],
  park: ["leisure=park"],
} as const;

type PlaceCategory = keyof typeof PLACE_CATEGORIES;

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: {
    name?: string;
    amenity?: string;
    leisure?: string;
    cuisine?: string;
    "addr:street"?: string;
    "addr:housenumber"?: string;
    "addr:city"?: string;
    opening_hours?: string;
    phone?: string;
    website?: string;
  };
}

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
    const radius = args.radiusMeters ?? 1000;
    const limit = args.limit ?? 15;
    const categories = (args.categories ?? ["restaurant", "cafe", "bar"]) as PlaceCategory[];

    const tags = categories.flatMap((cat) => PLACE_CATEGORIES[cat] ?? []);

    const tagQueries = tags
      .map((tag) => {
        const [key, value] = tag.split("=");
        return `node["${key}"="${value}"](around:${radius},${args.lat},${args.lng});
                way["${key}"="${value}"](around:${radius},${args.lat},${args.lng});`;
      })
      .join("\n");

    const overpassQuery = `
      [out:json][timeout:25];
      (
        ${tagQueries}
      );
      out center ${limit};
    `;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: `data=${encodeURIComponent(overpassQuery)}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      const elements: OverpassElement[] = data.elements || [];

      const places = elements
        .filter((el) => el.tags?.name)
        .map((el) => {
          const lat = el.lat ?? el.center?.lat ?? 0;
          const lon = el.lon ?? el.center?.lon ?? 0;

          let category = "other";
          if (el.tags?.amenity === "restaurant") category = "restaurant";
          else if (el.tags?.amenity === "cafe") category = "cafe";
          else if (el.tags?.amenity === "bar" || el.tags?.amenity === "pub") category = "bar";
          else if (el.tags?.amenity === "fast_food") category = "fast_food";
          else if (el.tags?.amenity === "cinema") category = "cinema";
          else if (el.tags?.leisure === "park") category = "park";

          const addressParts = [];
          if (el.tags?.["addr:housenumber"]) addressParts.push(el.tags["addr:housenumber"]);
          if (el.tags?.["addr:street"]) addressParts.push(el.tags["addr:street"]);
          if (el.tags?.["addr:city"]) addressParts.push(el.tags["addr:city"]);
          const address = addressParts.join(" ") || "Adresse non disponible";

          return {
            externalId: `osm-${el.type}-${el.id}`,
            name: el.tags?.name || "Sans nom",
            address,
            location: { lat, lng: lon },
            category,
            cuisine: el.tags?.cuisine,
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
        });
      }

      return {
        success: true,
        count: places.length,
        places,
      };
    } catch (error) {
      console.error("Error searching places:", error);
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
    return await ctx.runAction(internal.searchPlaces._searchNearby, args);
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

    let categories: PlaceCategory[];
    if (hour >= 6 && hour < 11) {
      categories = ["cafe"];
    } else if (hour >= 11 && hour < 15) {
      categories = ["restaurant", "fast_food"];
    } else if (hour >= 15 && hour < 18) {
      categories = ["cafe", "park"];
    } else if (hour >= 18 && hour < 22) {
      categories = ["restaurant", "bar"];
    } else {
      categories = ["bar"];
    }

    return await ctx.runAction(internal.searchPlaces._searchNearby, {
      meetId: args.meetId,
      lat: args.lat,
      lng: args.lng,
      radiusMeters: args.radiusMeters,
      categories,
    });
  },
});
