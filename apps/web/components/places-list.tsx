"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@meetpoint/ui";
import { usePlaces, useVotes, usePlaceSearch } from "@/hooks";
import type { Id, Doc } from "../../../convex/_generated/dataModel";
import type { Coordinates } from "@meetpoint/types";
import { PlaceModal } from "./places/place-modal";
import { StarRating } from "./places/star-rating";
import { CATEGORY_LABELS, CATEGORY_FILTERS, PRICE_LEVELS } from "./places/constants";

interface PlaceRankingItem {
  place: Doc<"places">;
  upvotes: number;
  downvotes: number;
  score: number;
}

interface PlacesListProps {
  meetId: Id<"meets">;
  midpoint: Coordinates | null;
  participantId?: Id<"participants">;
}

export function PlacesList({ meetId, midpoint, participantId }: PlacesListProps) {
  const { ranking, isLoading } = usePlaces(meetId);
  const { votes, castVote } = useVotes(meetId);
  const { isSearching, searchError, setSearchError, search } = usePlaceSearch(meetId);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchRadius, setSearchRadius] = useState(1000);
  const [selectedPlace, setSelectedPlace] = useState<PlaceRankingItem | null>(null);

  const handleSearch = (contextual = false) => {
    void search({ midpoint, categoryFilter, searchRadius, contextual });
  };

  const handleVote = async (placeId: Id<"places">, vote: "up" | "down") => {
    if (!participantId) return;

    try {
      await castVote({ meetId, placeId, participantId, vote });
    } catch {
      setSearchError("Erreur lors du vote");
    }
  };

  const filteredRanking = ranking?.filter(
    ({ place }: PlaceRankingItem) => categoryFilter === "all" || place.category === categoryFilter
  );

  const getUserVote = (placeId: Id<"places">) => {
    if (!participantId || !votes) return null;
    const vote = votes.find(
      (v: Doc<"votes">) => v.placeId === placeId && v.participantId === participantId
    );
    return vote?.vote ?? null;
  };

  return (
    <>
      {/* Modale de détails */}
      {selectedPlace && (
        <PlaceModal
          place={selectedPlace.place}
          isOpen={!!selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onVote={(vote) => handleVote(selectedPlace.place._id, vote)}
          userVote={getUserVote(selectedPlace.place._id)}
          score={selectedPlace.score}
          upvotes={selectedPlace.upvotes}
          downvotes={selectedPlace.downvotes}
          canVote={!!participantId}
        />
      )}

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Lieux suggérés</CardTitle>
            {ranking && ranking.length > 0 && <Badge variant="default">{ranking.length}</Badge>}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {midpoint && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      categoryFilter === cat.value
                        ? "bg-keria-gold text-keria-darker"
                        : "bg-keria-forest/30 text-keria-cream hover:bg-keria-forest/50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-keria-muted text-xs">Rayon:</span>
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="border-keria-forest/30 bg-keria-darker text-keria-cream rounded border px-3 py-1.5 text-xs"
                >
                  <option value={500}>500m</option>
                  <option value={1000}>1 km</option>
                  <option value={2000}>2 km</option>
                  <option value={5000}>5 km</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleSearch(false)}
                  isLoading={isSearching}
                  className="flex-1"
                >
                  Rechercher
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSearch(true)}
                  isLoading={isSearching}
                  title="Suggestions basées sur l'heure"
                >
                  Auto
                </Button>
              </div>

              {searchError && <p className="text-keria-error-light text-xs">{searchError}</p>}
            </div>
          )}

          {isLoading ? (
            <div className="text-keria-muted py-4 text-center text-sm">Chargement...</div>
          ) : filteredRanking && filteredRanking.length > 0 ? (
            <motion.ul
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {filteredRanking.map((item: PlaceRankingItem) => {
                const { place, score, upvotes, downvotes } = item;
                const userVote = getUserVote(place._id);
                const categoryInfo = CATEGORY_LABELS[place.category] ?? { label: "Autre" };

                return (
                  <motion.li
                    key={place._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedPlace(item)}
                    className="border-keria-forest/30 bg-keria-forest/10 hover:border-keria-gold/50 hover:bg-keria-forest/20 cursor-pointer overflow-hidden rounded-lg border transition-all"
                  >
                    {place.photoUrl && (
                      <div className="bg-keria-darker/50 relative h-32 w-full">
                        <img
                          src={place.photoUrl}
                          alt={place.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        {place.openNow !== undefined && (
                          <div
                            className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                              place.openNow
                                ? "bg-keria-success text-keria-cream"
                                : "bg-keria-error text-keria-cream"
                            }`}
                          >
                            {place.openNow ? "Ouvert" : "Fermé"}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-keria-muted text-[10px] uppercase">
                              {categoryInfo.label}
                            </span>
                            <span className="text-keria-forest">·</span>
                            <span className="text-keria-cream truncate font-medium">
                              {place.name}
                            </span>
                          </div>

                          {place.rating && (
                            <div className="mt-1 flex items-center gap-2">
                              <StarRating rating={place.rating} />
                              <span className="text-keria-cream text-sm font-medium">
                                {place.rating.toFixed(1)}
                              </span>
                              {place.userRatingsTotal && (
                                <span className="text-keria-muted text-xs">
                                  ({place.userRatingsTotal})
                                </span>
                              )}
                            </div>
                          )}

                          <div className="mt-1 flex items-center gap-2">
                            {place.priceLevel !== undefined && place.priceLevel > 0 && (
                              <span className="text-keria-success-light text-xs font-medium">
                                {PRICE_LEVELS[place.priceLevel]}
                              </span>
                            )}
                            <p className="text-keria-muted truncate text-xs">{place.address}</p>
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-center">
                          <div
                            className={`text-lg font-bold ${
                              score > 0
                                ? "text-keria-success-light"
                                : score < 0
                                  ? "text-keria-error-light"
                                  : "text-keria-muted"
                            }`}
                          >
                            {score > 0 ? "+" : ""}
                            {score}
                          </div>
                          <div className="text-keria-muted text-xs">
                            {upvotes}↑ {downvotes}↓
                          </div>
                        </div>
                      </div>

                      {userVote && (
                        <div className="mt-2 text-center text-xs">
                          <span
                            className={
                              userVote === "up"
                                ? "text-keria-success-light"
                                : "text-keria-error-light"
                            }
                          >
                            Vous avez voté {userVote === "up" ? "Pour" : "Contre"}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          ) : (
            <div className="text-keria-muted py-4 text-center text-sm">
              {midpoint
                ? "Cliquez sur 'Rechercher' pour trouver des lieux"
                : "Ajoutez des participants pour voir les suggestions"}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
