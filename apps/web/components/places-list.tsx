"use client";

import { useState, useRef, useId } from "react";
import { useAction } from "convex/react";
import { motion } from "framer-motion";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Modal } from "@meetpoint/ui";
import { api } from "../../../convex/_generated/api";
import { usePlaces, useVotes } from "@/hooks";
import type { Id, Doc } from "../../../convex/_generated/dataModel";
import type { Coordinates } from "@meetpoint/types";

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

const CATEGORY_LABELS: Record<string, { label: string }> = {
  restaurant: { label: "Restaurant" },
  cafe: { label: "Café" },
  bar: { label: "Bar" },
  fast_food: { label: "Fast-food" },
  cinema: { label: "Cinéma" },
  park: { label: "Parc" },
  other: { label: "Autre" },
};

const CATEGORY_FILTERS = [
  { value: "all", label: "Tous" },
  { value: "restaurant", label: "Restaurants" },
  { value: "cafe", label: "Cafés" },
  { value: "bar", label: "Bars" },
  { value: "fast_food", label: "Fast-food" },
];

const PRICE_LEVELS = ["", "€", "€€", "€€€", "€€€€"];

function StarIcon({
  filled,
  half,
  size,
  gradientId,
}: {
  filled?: boolean;
  half?: boolean;
  size: number;
  gradientId?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {half && gradientId ? (
        <>
          <defs>
            <linearGradient id={gradientId}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={`url(#${gradientId})`}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-keria-gold"
          />
        </>
      ) : (
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={filled ? "text-keria-gold" : "text-keria-forest"}
        />
      )}
    </svg>
  );
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const uniqueId = useId();
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const iconSize = size === "lg" ? 20 : 14;

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Note : ${rating.toFixed(1)} sur 5`}
    >
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon key={`full-${i}`} filled size={iconSize} />
      ))}
      {hasHalfStar ? (
        <StarIcon key="half" half size={iconSize} gradientId={`halfStar-${uniqueId}`} />
      ) : null}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarIcon key={`empty-${i}`} size={iconSize} />
      ))}
    </div>
  );
}

function PhotoCarousel({ photos, name }: { photos: string[]; name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) return null;

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-keria-darker/50 relative h-56 w-full">
      <img
        src={photos[currentIndex]}
        alt={`${name} - Photo ${currentIndex + 1}`}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "/placeholder-restaurant.jpg";
        }}
      />

      {/* Navigation arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Photo count */}
      <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}

const AVATAR_COLORS = [
  "bg-keria-gold/20 text-keria-gold",
  "bg-keria-success/20 text-keria-success-light",
  "bg-keria-info/20 text-keria-info-light",
  "bg-keria-error/20 text-keria-error-light",
  "bg-keria-forest/50 text-keria-cream",
];

function ReviewCard({
  review,
  index,
}: {
  review: {
    authorName: string;
    authorPhoto?: string;
    rating: number;
    text: string;
    relativeTime: string;
  };
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 150;
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div className="bg-keria-forest/20 rounded-lg p-3">
      <div className="flex items-start gap-3">
        {/* Avatar avec initiale - les photos de profil Google ne sont pas accessibles directement */}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${avatarColor} flex-shrink-0 font-semibold`}
        >
          {review.authorName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium">{review.authorName}</span>
            <span className="text-keria-muted flex-shrink-0 text-xs">{review.relativeTime}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < review.rating ? "text-keria-gold" : "text-keria-forest"}`}
              >
                ★
              </span>
            ))}
          </div>
          {review.text && (
            <p className="text-keria-cream/80 mt-2 text-sm">
              {isLong && !expanded ? `${review.text.slice(0, 150)}...` : review.text}
              {isLong && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-keria-gold ml-1 hover:underline"
                >
                  {expanded ? "Voir moins" : "Voir plus"}
                </button>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaceModal({
  place,
  isOpen,
  onClose,
  onVote,
  userVote,
  score,
  upvotes,
  downvotes,
  canVote,
}: {
  place: Doc<"places">;
  isOpen: boolean;
  onClose: () => void;
  onVote: (vote: "up" | "down") => void;
  userVote: "up" | "down" | null;
  score: number;
  upvotes: number;
  downvotes: number;
  canVote: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "hours">("info");
  const categoryInfo = CATEGORY_LABELS[place.category] ?? { label: "Autre" };

  const googleMapsUrl = place.externalId.startsWith("google-")
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.externalId.replace("google-", "")}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`;

  const photos = place.photos ?? (place.photoUrl ? [place.photoUrl] : []);
  const reviews = place.reviews ?? [];
  const openingHours = place.openingHours ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      {/* Photos Carousel */}
      {photos.length > 0 ? (
        <div className="relative">
          <PhotoCarousel photos={photos} name={place.name} />
          {/* Badge ouvert/fermé */}
          {place.openNow !== undefined && (
            <div
              className={`absolute bottom-3 right-3 rounded-full px-3 py-1 text-sm font-medium ${
                place.openNow
                  ? "bg-keria-success text-keria-cream"
                  : "bg-keria-error text-keria-cream"
              }`}
            >
              {place.openNow ? "Ouvert" : "Fermé"}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-keria-forest/20 flex h-32 items-center justify-center">
          <span className="text-keria-muted text-lg font-medium">{categoryInfo.label}</span>
        </div>
      )}

      <div className="p-5">
        {/* En-tête */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold">{place.name}</h2>
            <p className="text-keria-muted text-sm">{categoryInfo.label}</p>
          </div>

          {/* Score */}
          <div className="flex-shrink-0 text-center">
            <div
              className={`text-2xl font-bold ${
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

        {/* Note et avis */}
        {place.rating && (
          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={place.rating} size="lg" />
            <span className="text-lg font-semibold">{place.rating.toFixed(1)}</span>
            {place.userRatingsTotal && (
              <span className="text-keria-muted text-sm">({place.userRatingsTotal} avis)</span>
            )}
            {place.priceLevel !== undefined && place.priceLevel > 0 && (
              <span className="text-keria-success-light text-sm font-medium">
                • {PRICE_LEVELS[place.priceLevel]}
              </span>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="border-keria-forest/30 mt-4 flex border-b">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${
              activeTab === "info"
                ? "border-keria-gold text-keria-gold border-b-2"
                : "text-keria-muted hover:text-keria-cream"
            }`}
          >
            Infos
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${
              activeTab === "reviews"
                ? "border-keria-gold text-keria-gold border-b-2"
                : "text-keria-muted hover:text-keria-cream"
            }`}
          >
            Avis ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("hours")}
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${
              activeTab === "hours"
                ? "border-keria-gold text-keria-gold border-b-2"
                : "text-keria-muted hover:text-keria-cream"
            }`}
          >
            Horaires
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 min-h-[150px]">
          {activeTab === "info" && (
            <div className="space-y-3">
              {/* Adresse */}
              <div className="flex items-start gap-3">
                <svg
                  className="text-keria-muted mt-0.5 h-4 w-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-keria-cream/80 text-sm">{place.address}</p>
              </div>

              {/* Téléphone */}
              {place.phoneNumber && (
                <div className="flex items-center gap-3">
                  <svg
                    className="text-keria-muted h-4 w-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <a
                    href={`tel:${place.phoneNumber}`}
                    className="text-keria-gold text-sm hover:underline"
                  >
                    {place.phoneNumber}
                  </a>
                </div>
              )}

              {/* Site web */}
              {place.website && (
                <div className="flex items-center gap-3">
                  <svg
                    className="text-keria-muted h-4 w-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-keria-gold truncate text-sm hover:underline"
                  >
                    {place.website.replace(/^https?:\/\//, "").split("/")[0]}
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-h-[250px] space-y-3 overflow-y-auto">
              {reviews.length > 0 ? (
                <>
                  {reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} index={index} />
                  ))}
                  {/* Note sur la limite des avis */}
                  {place.userRatingsTotal && place.userRatingsTotal > 5 && (
                    <p className="text-keria-muted py-2 text-center text-xs">
                      Seuls les 5 avis les plus récents sont affichés.
                      <br />
                      <a
                        href={
                          place.externalId.startsWith("google-")
                            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.externalId.replace("google-", "")}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-keria-gold hover:underline"
                      >
                        Voir les {place.userRatingsTotal} avis sur Google Maps
                      </a>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-keria-muted py-4 text-center text-sm">Aucun avis disponible</p>
              )}
            </div>
          )}

          {activeTab === "hours" && (
            <div className="space-y-2">
              {openingHours.length > 0 ? (
                openingHours.map((hours, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-keria-cream/80">{hours}</span>
                  </div>
                ))
              ) : (
                <p className="text-keria-muted py-4 text-center text-sm">
                  Horaires non disponibles
                </p>
              )}
            </div>
          )}
        </div>

        {/* Boutons de vote */}
        {canVote ? (
          <div className="mt-4 flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onVote("up")}
              aria-label={`Voter pour ${place.name}`}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                userVote === "up"
                  ? "bg-keria-success/20 text-keria-success-light ring-keria-success ring-2"
                  : "bg-keria-forest/30 text-keria-cream hover:bg-keria-success/10"
              }`}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
              </svg>
              Pour
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onVote("down")}
              aria-label={`Voter contre ${place.name}`}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                userVote === "down"
                  ? "bg-keria-error/20 text-keria-error-light ring-keria-error ring-2"
                  : "bg-keria-forest/30 text-keria-cream hover:bg-keria-error/10"
              }`}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
              </svg>
              Contre
            </motion.button>
          </div>
        ) : (
          <p className="text-keria-gold mt-4 text-center text-sm">
            Sélectionnez-vous dans la liste des participants pour voter
          </p>
        )}

        {/* Lien Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-keria-gold text-keria-darker hover:bg-keria-gold-dark mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Voir sur Google Maps
        </a>
      </div>
    </Modal>
  );
}

export function PlacesList({ meetId, midpoint, participantId }: PlacesListProps) {
  const { ranking, isLoading } = usePlaces(meetId);
  const { votes, castVote } = useVotes(meetId);

  const searchGoogle = useAction(api.googlePlaces.searchNearby);
  const searchGoogleContextual = useAction(api.googlePlaces.searchContextual);
  const searchOverpass = useAction(api.searchPlaces.searchNearby);
  const searchOverpassContextual = useAction(api.searchPlaces.searchContextual);

  const [isSearching, setIsSearching] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchRadius, setSearchRadius] = useState(1000);
  const [useGoogleApi, setUseGoogleApi] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<PlaceRankingItem | null>(null);

  const lastSearchTime = useRef(0);
  const DEBOUNCE_MS = 2000;

  const handleSearch = async (contextual = false) => {
    if (!midpoint) return;

    const now = Date.now();
    if (now - lastSearchTime.current < DEBOUNCE_MS) {
      return;
    }
    lastSearchTime.current = now;

    setIsSearching(true);
    setSearchError(null);

    try {
      let result;

      if (useGoogleApi) {
        if (contextual) {
          result = await searchGoogleContextual({
            meetId,
            lat: midpoint.lat,
            lng: midpoint.lng,
            radiusMeters: searchRadius,
          });
        } else {
          result = await searchGoogle({
            meetId,
            lat: midpoint.lat,
            lng: midpoint.lng,
            radiusMeters: searchRadius,
            categories:
              categoryFilter === "all"
                ? ["restaurant", "cafe", "bar", "fast_food"]
                : [categoryFilter],
          });
        }

        if (!result.success && result.error?.includes("GOOGLE_PLACES_API_KEY")) {
          setUseGoogleApi(false);
          if (contextual) {
            result = await searchOverpassContextual({
              meetId,
              lat: midpoint.lat,
              lng: midpoint.lng,
              radiusMeters: searchRadius,
            });
          } else {
            result = await searchOverpass({
              meetId,
              lat: midpoint.lat,
              lng: midpoint.lng,
              radiusMeters: searchRadius,
              categories:
                categoryFilter === "all"
                  ? ["restaurant", "cafe", "bar", "fast_food"]
                  : [categoryFilter],
            });
          }
        }
      } else {
        if (contextual) {
          result = await searchOverpassContextual({
            meetId,
            lat: midpoint.lat,
            lng: midpoint.lng,
            radiusMeters: searchRadius,
          });
        } else {
          result = await searchOverpass({
            meetId,
            lat: midpoint.lat,
            lng: midpoint.lng,
            radiusMeters: searchRadius,
            categories:
              categoryFilter === "all"
                ? ["restaurant", "cafe", "bar", "fast_food"]
                : [categoryFilter],
          });
        }
      }

      if (!result.success) {
        setSearchError(result.error ?? "Erreur de recherche");
      }
    } catch (_error) {
      setSearchError("Erreur de connexion");
    } finally {
      setIsSearching(false);
    }
  };

  const handleVote = async (placeId: Id<"places">, vote: "up" | "down") => {
    if (!participantId) return;

    try {
      await castVote({
        meetId,
        placeId,
        participantId,
        vote,
      });
    } catch (_error) {
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
