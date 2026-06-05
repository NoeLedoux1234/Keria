import { action, internalAction, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

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

function buildSystemPrompt(): string {
  return [
    "You are a travel assistant that suggests French cities for a group meetup.",
    "You must only suggest real French cities located strictly inside the geographic bounding box delimited by the participants.",
    "Each city must match the group preferences as closely as possible.",
    "Always answer with a single strict JSON object and nothing else.",
    'The JSON must have exactly this shape: { "understoodPreferences": string[], "cities": [{ "name": string, "region": string, "coordinates": { "lat": number, "lng": number }, "reason": string, "matchScore": number }] }.',
    "matchScore is an integer between 0 and 100 expressing how well the city matches the preferences.",
    'Write the "reason" and "region" fields in French, addressed to the user.',
    'The "reason" must be a single concise sentence and must never mention technical terms such as coordinates or bounding box.',
    "Provide between 3 and 5 cities.",
  ].join(" ");
}

function buildUserPrompt(
  locations: ParticipantLocation[],
  boundingBox: BoundingBox,
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
    "Group preferences:",
    preferences,
    "",
    "Suggest 3 to 5 French cities located inside the bounding box and matching these preferences.",
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
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(args.participantLocations, boundingBox, args.preferences);

    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
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

      const cities: SuggestedCity[] = parsed.cities.map((city) => ({
        name: city.name,
        region: city.region,
        coordinates: {
          lat: city.coordinates.lat,
          lng: city.coordinates.lng,
        },
        reason: city.reason,
        matchScore: city.matchScore,
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
  handler: async (ctx, args) => {
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
