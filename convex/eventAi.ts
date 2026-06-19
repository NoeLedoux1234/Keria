import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { DESCRIPTION_MAX } from "./validation";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = "claude-haiku-4-5";
const MIN_IDEAS = 3;
const MAX_IDEAS = 5;
const MAX_TOKENS = 1024;

type AnthropicContentBlock = {
  type: string;
  text: string;
};

type AnthropicResponse = {
  content: AnthropicContentBlock[];
};

type SuggestedIdea = {
  title: string;
  category: string;
  reason: string;
};

type ParsedAiResponse = {
  ideas: SuggestedIdea[];
};

type SuggestItineraryResult = {
  success: boolean;
  ideas: SuggestedIdea[];
  error?: string;
};

function isValidIdea(value: unknown): value is SuggestedIdea {
  if (typeof value !== "object" || value === null) return false;

  const idea = value as Record<string, unknown>;

  return (
    typeof idea.title === "string" &&
    typeof idea.category === "string" &&
    typeof idea.reason === "string"
  );
}

function sanitizeReason(reason: string): string {
  return reason
    .replace(/optimal meeting point/gi, "lieu de rendez-vous")
    .replace(/meeting point/gi, "lieu de rendez-vous")
    .replace(/bounding box/gi, "secteur")
    .replace(/\s*\bcoordinates?\b/gi, "")
    .replace(/\s*\bcoordonn[ée]es?\b/gi, "")
    .replace(/\s*\blatitude\b/gi, "")
    .replace(/\s*\blongitude\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatStageTime(scheduledAt: number): string {
  return new Date(scheduledAt).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildSystemPrompt(): string {
  return [
    "You are an itinerary assistant that enriches a multi-stage event for a group.",
    "Given the ordered stages of an event (names, addresses, times) and a free description of the atmosphere the group wants, suggest concrete ideas to enrich the itinerary.",
    "Ideas can be breaks, intermediate activities, or timing advice between or around the stages.",
    "Always answer with a single strict JSON object and nothing else.",
    'The JSON must have exactly this shape: { "ideas": [{ "title": string, "category": string, "reason": string }] }.',
    'Write the "title", "category", and "reason" fields in French, addressed to the user.',
    'The "title" must be a short label, the "category" a single word or short phrase, and the "reason" a single concise sentence.',
    'The "reason" must never mention technical terms such as coordinates, latitude, longitude, or bounding box.',
    `Provide between ${MIN_IDEAS} and ${MAX_IDEAS} ideas.`,
  ].join(" ");
}

function buildUserPrompt(stages: Doc<"eventStages">[], description: string): string {
  const stageLines = stages.map((stage, index) => {
    return `Stage ${index + 1}: ${stage.name} — ${stage.address} — ${formatStageTime(stage.scheduledAt)}`;
  });

  return [
    "Event stages in order:",
    ...stageLines,
    "",
    "Desired atmosphere described by the group:",
    description,
    "",
    `Suggest between ${MIN_IDEAS} and ${MAX_IDEAS} concrete ideas to enrich this itinerary.`,
  ].join("\n");
}

export const suggestItinerary = action({
  args: {
    eventId: v.id("events"),
    description: v.string(),
  },
  handler: async (ctx, args): Promise<SuggestItineraryResult> => {
    const cleaned = args.description.trim();
    if (cleaned.length === 0 || cleaned.length > DESCRIPTION_MAX) {
      return {
        success: false,
        ideas: [],
        error: "Description invalide",
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        ideas: [],
        error: "ANTHROPIC_API_KEY not configured",
      };
    }

    const stages = await ctx.runQuery(api.events.getStages, { eventId: args.eventId });
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(stages, cleaned);

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
          max_tokens: MAX_TOKENS,
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
          ideas: [],
          error: "Anthropic API error",
        };
      }

      const data: AnthropicResponse = await response.json();
      const rawText = data.content[0]?.text ?? "";
      const jsonText = `{${rawText}`;

      let parsed: ParsedAiResponse;
      try {
        const candidate = JSON.parse(jsonText) as Record<string, unknown>;
        const ideas = Array.isArray(candidate.ideas) ? candidate.ideas.filter(isValidIdea) : [];
        parsed = { ideas };
      } catch {
        return {
          success: false,
          ideas: [],
          error: "Invalid AI response",
        };
      }

      const ideas: SuggestedIdea[] = parsed.ideas.slice(0, MAX_IDEAS).map((idea) => ({
        title: idea.title,
        category: idea.category,
        reason: sanitizeReason(idea.reason),
      }));

      if (ideas.length < MIN_IDEAS) {
        return {
          success: false,
          ideas: [],
          error: "Invalid AI response",
        };
      }

      return {
        success: true,
        ideas,
      };
    } catch (error) {
      console.error("Error suggesting itinerary with Anthropic:", error);
      return {
        success: false,
        ideas: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
