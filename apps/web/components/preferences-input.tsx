"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@meetpoint/ui";
import { useAiSuggestions } from "@/hooks";
import type { Id } from "../../../convex/_generated/dataModel";
import type { SuggestedCity } from "@/types/ai";

interface ParticipantLocation {
  lat: number;
  lng: number;
  city?: string;
}

interface PreferencesInputProps {
  meetId: Id<"meets">;
  participantLocations: ParticipantLocation[];
  onSuggestions: (cities: SuggestedCity[]) => void;
}

export function PreferencesInput({
  meetId,
  participantLocations,
  onSuggestions,
}: PreferencesInputProps) {
  const { suggestCities, savePreferences } = useAiSuggestions(meetId);

  const [preferences, setPreferences] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = preferences.trim();
    if (trimmed.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await suggestCities({
        meetId,
        preferences: trimmed,
        participantLocations,
      });

      if (result.success) {
        await savePreferences({
          meetId,
          preferences: trimmed,
          suggestedCities: result.cities,
        });
        onSuggestions(result.cities);
      } else {
        setError("L'assistant n'a pas pu générer de suggestions. Réessayez.");
      }
    } catch (_error) {
      setError("L'assistant n'a pas pu générer de suggestions. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Trouver une ville selon vos envies</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          rows={3}
          placeholder="Une ville sympa avec des bars et près d'un lac, de l'ambiance le soir…"
          className="border-keria-forest/30 bg-keria-darker text-keria-cream placeholder:text-keria-muted focus:border-keria-gold/50 focus:ring-keria-gold/30 w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        />

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={preferences.trim().length === 0}
            className="w-full"
          >
            Trouver des suggestions
          </Button>
        </motion.div>

        {error && <p className="text-keria-error-light text-xs">{error}</p>}
      </CardContent>
    </Card>
  );
}
