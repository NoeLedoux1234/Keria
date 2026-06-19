"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@meetpoint/ui";
import { useEventAi } from "@/hooks";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { ItineraryIdea } from "@/types/ai";

interface ItineraryAssistantProps {
  eventId: Id<"events">;
}

const GENERIC_ERROR = "L'assistant n'a pas pu générer de suggestions. Réessayez.";

export function ItineraryAssistant({ eventId }: ItineraryAssistantProps) {
  const { isEnabled, isSuggesting, suggest } = useEventAi();

  const [description, setDescription] = useState("");
  const [ideas, setIdeas] = useState<ItineraryIdea[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (isEnabled !== true) return null;

  const handleSubmit = async () => {
    const trimmed = description.trim();
    if (trimmed.length === 0) return;

    setError(null);

    try {
      const result = await suggest({ eventId, description: trimmed });

      if (result.success) {
        setIdeas(result.ideas);
      } else {
        setIdeas([]);
        setError(GENERIC_ERROR);
      }
    } catch (_error) {
      setIdeas([]);
      setError(GENERIC_ERROR);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Assistant d'itinéraire</CardTitle>
          <Badge variant="primary" className="text-[10px] uppercase tracking-wider">
            IA
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          aria-label="Décrivez l'ambiance ou ce que vous voulez pour cette sortie"
          placeholder="Une sortie conviviale, une pause gourmande entre deux étapes, un peu de temps libre…"
          className="border-keria-forest/30 bg-keria-darker text-keria-cream placeholder:text-keria-muted focus:border-keria-gold/50 focus:ring-keria-gold/30 w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        />

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSuggesting}
            disabled={description.trim().length === 0}
            className="w-full"
          >
            Suggérer des idées
          </Button>
        </motion.div>

        {error && (
          <p role="alert" aria-live="assertive" className="text-keria-error-light text-xs">
            {error}
          </p>
        )}

        <AnimatePresence mode="popLayout">
          {ideas.length > 0 && (
            <motion.ul
              key="itinerary-ideas"
              className="space-y-3 pt-1"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {ideas.map((idea, index) => (
                <motion.li
                  key={`${idea.title}-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="border-keria-forest/30 bg-keria-forest/10 rounded-lg border p-3"
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge variant="default" className="text-[10px] uppercase tracking-wider">
                      {idea.category}
                    </Badge>
                  </div>
                  <h3 className="font-display text-keria-cream font-semibold">{idea.title}</h3>
                  <p className="text-keria-cream/80 mt-1.5 text-sm">{idea.reason}</p>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
