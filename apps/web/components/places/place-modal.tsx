"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@meetpoint/ui";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { StarRating } from "./star-rating";
import { PhotoCarousel } from "./photo-carousel";
import { ReviewCard } from "./review-card";
import { CATEGORY_LABELS, PRICE_LEVELS } from "./constants";

interface PlaceModalProps {
  place: Doc<"places">;
  isOpen: boolean;
  onClose: () => void;
  onVote: (vote: "up" | "down") => void;
  userVote: "up" | "down" | null;
  score: number;
  upvotes: number;
  downvotes: number;
  canVote: boolean;
}

function googleMapsUrlFor(place: Doc<"places">): string {
  return place.externalId.startsWith("google-")
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.externalId.replace("google-", "")}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address}`)}`;
}

export function PlaceModal({
  place,
  isOpen,
  onClose,
  onVote,
  userVote,
  score,
  upvotes,
  downvotes,
  canVote,
}: PlaceModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "hours">("info");
  const categoryInfo = CATEGORY_LABELS[place.category] ?? { label: "Autre" };
  const googleMapsUrl = googleMapsUrlFor(place);

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
                    <ReviewCard
                      key={`${review.authorName}-${index}`}
                      review={review}
                      index={index}
                    />
                  ))}
                  {/* Note sur la limite des avis */}
                  {place.userRatingsTotal && place.userRatingsTotal > 5 && (
                    <p className="text-keria-muted py-2 text-center text-xs">
                      Seuls les 5 avis les plus récents sont affichés.
                      <br />
                      <a
                        href={googleMapsUrl}
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
