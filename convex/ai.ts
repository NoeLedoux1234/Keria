import { action, internalAction, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { fetchWithTimeout } from "./lib/http";

// Allow suggestions slightly outside the participants' bounding box (~55 km).
const BBOX_MARGIN_DEG = 0.5;

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = "claude-haiku-4-5";

interface AnthropicContentBlock {
  type: string;
  text: string;
}

interface AnthropicResponse {
  content: AnthropicContentBlock[];
}

interface SuggestedCity {
  name: string;
  region: string;
  coordinates: { lat: number; lng: number };
  reason: string;
  matchScore: number;
}

interface ParsedAiResponse {
  understoodPreferences: string[];
  cities: SuggestedCity[];
}

interface SuggestCitiesResult {
  success: boolean;
  cities: SuggestedCity[];
  error?: string;
}

interface ParticipantLocation {
  lat: number;
  lng: number;
  city?: string;
}

interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface GeoCenter {
  lat: number;
  lng: number;
}

function computeBoundingBox(locations: ParticipantLocation[]): BoundingBox {
  const lats = locations.map((location) => location.lat);
  const lngs = locations.map((location) => location.lng);

  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}

function computeCenter(locations: ParticipantLocation[]): GeoCenter {
  const total = locations.length;
  const sumLat = locations.reduce((accumulator, location) => accumulator + location.lat, 0);
  const sumLng = locations.reduce((accumulator, location) => accumulator + location.lng, 0);

  return {
    lat: sumLat / total,
    lng: sumLng / total,
  };
}

function clampMatchScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function isWithinBoundingBox(
  coordinates: { lat: number; lng: number },
  box: BoundingBox,
  margin: number
): boolean {
  return (
    coordinates.lat >= box.minLat - margin &&
    coordinates.lat <= box.maxLat + margin &&
    coordinates.lng >= box.minLng - margin &&
    coordinates.lng <= box.maxLng + margin
  );
}

function isValidCity(value: unknown): value is SuggestedCity {
  if (typeof value !== "object" || value === null) return false;

  const city = value as Record<string, unknown>;
  const coordinates = city.coordinates as Record<string, unknown> | undefined;

  return (
    typeof city.name === "string" &&
    typeof city.region === "string" &&
    typeof city.reason === "string" &&
    typeof city.matchScore === "number" &&
    typeof coordinates === "object" &&
    coordinates !== null &&
    typeof coordinates.lat === "number" &&
    typeof coordinates.lng === "number"
  );
}

function sanitizeReason(reason: string): string {
  return reason
    .replace(/optimal central meeting point/gi, "centre")
    .replace(/central meeting point/gi, "centre")
    .replace(/point central optimal/gi, "centre")
    .replace(/central point/gi, "centre")
    .replace(/point central/gi, "centre")
    .replace(/bounding box/gi, "secteur")
    .replace(/\s*\bcoordinates?\b/gi, "")
    .replace(/\s*\bcoordonn[ée]es?\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function buildSystemPrompt(): string {
  return [
    "You are a travel assistant that suggests French cities for a group meetup.",
    "You must only suggest real, well-known French cities or communes (towns) located strictly inside the geographic bounding box delimited by the participants.",
    "Never suggest neighborhoods, districts, boroughs, or arrondissements: suggest the actual city or commune instead (for example never 'Paris - Montmartre' nor '18e arrondissement', but a real standalone commune).",
    "The suggested cities must be located between the participants, inside the bounding box, and must constitute a fair meeting point: prioritize the cities that are the closest to the optimal central meeting point provided.",
    "Each city must match the group preferences as closely as possible.",
    "Always answer with a single strict JSON object and nothing else.",
    'The JSON must have exactly this shape: { "understoodPreferences": string[], "cities": [{ "name": string, "region": string, "coordinates": { "lat": number, "lng": number }, "reason": string, "matchScore": number }] }.',
    "matchScore is an integer between 0 and 100 that must reflect both how well the city matches the preferences and its geographic relevance, meaning its fairness and its proximity to the optimal central meeting point.",
    'Write the "reason" and "region" fields in French, addressed to the user.',
    'The "reason" must be a single concise sentence and must never mention technical terms such as coordinates, bounding box, or central point.',
    "Provide between 3 and 5 cities.",
  ].join(" ");
}

function buildUserPrompt(
  locations: ParticipantLocation[],
  boundingBox: BoundingBox,
  center: GeoCenter,
  preferences: string
): string {
  const participantLines = locations
    .map((location, index) => {
      const label = location.city ? ` (${location.city})` : "";
      return `Participant ${index + 1}: lat ${location.lat}, lng ${location.lng}${label}`;
    })
    .join("\n");

  return [
    "Participants locations:",
    participantLines,
    "",
    "Geographic bounding box to stay within:",
    `Latitude from ${boundingBox.minLat} to ${boundingBox.maxLat}`,
    `Longitude from ${boundingBox.minLng} to ${boundingBox.maxLng}`,
    "",
    `Optimal central meeting point: lat ${center.lat}, lng ${center.lng}`,
    "Prioritize the real French cities or communes that are the closest to this optimal central meeting point while staying inside the bounding box.",
    "",
    "Group preferences:",
    preferences,
    "",
    "Suggest 3 to 5 real French cities located inside the bounding box, as close as possible to the optimal central meeting point, and matching these preferences.",
  ].join("\n");
}

export const _suggestCities = internalAction({
  args: {
    participantLocations: v.array(
      v.object({
        lat: v.number(),
        lng: v.number(),
        city: v.optional(v.string()),
      })
    ),
    preferences: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        cities: [],
        error: "ANTHROPIC_API_KEY not configured",
      };
    }

    const boundingBox = computeBoundingBox(args.participantLocations);
    const center = computeCenter(args.participantLocations);
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(
      args.participantLocations,
      boundingBox,
      center,
      args.preferences
    );

    try {
      const response = await fetchWithTimeout(ANTHROPIC_API_URL, {
        method: "POST",
        timeoutMs: 30_000,
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 2048,
          system: systemPrompt,
          messages: [
            { role: "user", content: userPrompt },
            { role: "assistant", content: "{" },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Anthropic API error:", errorText);
        return {
          success: false,
          cities: [],
          error: "Anthropic API error",
        };
      }

      const data: AnthropicResponse = await response.json();
      const rawText = data.content[0]?.text ?? "";
      const jsonText = `{${rawText}`;

      let parsed: ParsedAiResponse;
      try {
        const candidate = JSON.parse(jsonText) as Record<string, unknown>;
        const understoodPreferences = Array.isArray(candidate.understoodPreferences)
          ? candidate.understoodPreferences.filter(
              (item): item is string => typeof item === "string"
            )
          : [];
        const cities = Array.isArray(candidate.cities) ? candidate.cities.filter(isValidCity) : [];
        parsed = { understoodPreferences, cities };
      } catch {
        return {
          success: false,
          cities: [],
          error: "Invalid AI response",
        };
      }

      const cities: SuggestedCity[] = parsed.cities
        .filter((city) => isWithinBoundingBox(city.coordinates, boundingBox, BBOX_MARGIN_DEG))
        .map((city) => ({
          name: city.name,
          region: city.region,
          coordinates: {
            lat: city.coordinates.lat,
            lng: city.coordinates.lng,
          },
          reason: sanitizeReason(city.reason),
          matchScore: clampMatchScore(city.matchScore),
        }));

      return {
        success: true,
        cities,
      };
    } catch (error) {
      console.error("Error suggesting cities with Anthropic:", error);
      return {
        success: false,
        cities: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const suggestCities = action({
  args: {
    meetId: v.id("meets"),
    preferences: v.string(),
    participantLocations: v.array(
      v.object({
        lat: v.number(),
        lng: v.number(),
        city: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args): Promise<SuggestCitiesResult> => {
    return await ctx.runAction(internal.ai._suggestCities, {
      participantLocations: args.participantLocations,
      preferences: args.preferences,
    });
  },
});

export const savePreferences = mutation({
  args: {
    meetId: v.id("meets"),
    preferences: v.string(),
    suggestedCities: v.array(
      v.object({
        name: v.string(),
        region: v.string(),
        coordinates: v.object({ lat: v.number(), lng: v.number() }),
        reason: v.string(),
        matchScore: v.number(),
      })
    ),
    selectedCity: v.optional(
      v.object({
        name: v.string(),
        coordinates: v.object({ lat: v.number(), lng: v.number() }),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.meetId, {
      preferences: args.preferences,
      suggestedCities: args.suggestedCities,
      selectedCity: args.selectedCity,
      updatedAt: Date.now(),
    });
  },
});

export const selectCity = mutation({
  args: {
    meetId: v.id("meets"),
    selectedCity: v.object({
      name: v.string(),
      coordinates: v.object({ lat: v.number(), lng: v.number() }),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.meetId, {
      selectedCity: args.selectedCity,
      updatedAt: Date.now(),
    });
  },
});

export const isEnabled = query({
  args: {},
  handler: async () => {
    return process.env.ANTHROPIC_API_KEY !== undefined;
  },
});
