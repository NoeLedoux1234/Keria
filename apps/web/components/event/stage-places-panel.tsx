"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge, Button } from "@meetpoint/ui";
import { useEventPlaces } from "@/hooks";
import { StagePlaceVote } from "./stage-place-vote";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";

interface StagePlacesPanelProps {
  stage: Doc<"eventStages">;
  currentParticipantId: Id<"eventParticipants"> | null;
}

interface PlaceRankingItem {
  place: Doc<"places">;
  upvotes: number;
  downvotes: number;
  score: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  cafe: "Café",
  bar: "Bar",
  fast_food: "Fast-food",
  cinema: "Cinéma",
  park: "Parc",
  other: "Autre",
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function StagePlacesPanel({ stage, currentParticipantId }: StagePlacesPanelProps) {
  const { ranking, isLoading, isSearching, search, vote, getUserVote } = useEventPlaces(stage._id);
  const [error, setError] = useState<string | null>(null);

  const canVote = currentParticipantId !== null;

  const handleSearch = async () => {
    setError(null);
    try {
      const result = await search({ eventStageId: stage._id });
      if (!result.success) {
        setError(result.error ?? "Erreur de recherche");
      }
    } catch (_error) {
      setError("Erreur de connexion");
    }
  };

  const handleVote = async (placeId: Id<"places">, voteValue: "up" | "down") => {
    if (!currentParticipantId) return;
    setError(null);
    try {
      await vote({
        eventStageId: stage._id,
        placeId,
        eventParticipantId: currentParticipantId,
        vote: voteValue,
      });
    } catch (_error) {
      setError("Erreur lors du vote");
    }
  };

  const hasPlaces = ranking !== undefined && ranking.length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="border-keria-gold/30 bg-keria-gold/5 mb-6 rounded border p-4"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="border-keria-gold text-keria-cream border-l-2 pl-3 text-xs font-medium uppercase tracking-wider">
          Lieux près de {stage.name}
        </h2>
        {hasPlaces && <Badge variant="default">{ranking.length}</Badge>}
      </div>

      <Button
        size="sm"
        variant="primary"
        onClick={handleSearch}
        isLoading={isSearching}
        className="w-full"
      >
        Rechercher des lieux
      </Button>

      {error && (
        <p role="alert" aria-live="assertive" className="text-keria-error-light mt-2 text-xs">
          {error}
        </p>
      )}

      {!canVote && (
        <p className="text-keria-gold mt-3 text-xs">Rejoignez l'événement pour voter.</p>
      )}

      <div className="mt-4">
        {isLoading ? (
          <p className="text-keria-muted py-4 text-center text-sm">Chargement...</p>
        ) : hasPlaces ? (
          <motion.ul
            className="space-y-2.5"
            initial="hidden"
            animate="visible"
            variants={listVariants}
          >
            {ranking.map((item: PlaceRankingItem) => {
              const { place, score, upvotes, downvotes } = item;
              const categoryLabel = CATEGORY_LABELS[place.category] ?? "Autre";

              return (
                <motion.li
                  key={place._id}
                  variants={itemVariants}
                  className="border-keria-forest/30 bg-keria-forest/10 flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-keria-muted text-[10px] uppercase">
                        {categoryLabel}
                      </span>
                      <span className="text-keria-forest">·</span>
                      <span className="text-keria-cream truncate font-medium">{place.name}</span>
                    </div>
                    <p className="text-keria-muted mt-1 truncate text-xs">{place.address}</p>
                  </div>

                  <StagePlaceVote
                    placeName={place.name}
                    score={score}
                    upvotes={upvotes}
                    downvotes={downvotes}
                    currentVote={getUserVote(place._id, currentParticipantId)}
                    canVote={canVote}
                    onVote={(voteValue) => void handleVote(place._id, voteValue)}
                  />
                </motion.li>
              );
            })}
          </motion.ul>
        ) : (
          <p className="text-keria-muted py-4 text-center text-sm">
            Aucun lieu pour cette étape. Lancez une recherche pour en suggérer.
          </p>
        )}
      </div>
    </motion.section>
  );
}
