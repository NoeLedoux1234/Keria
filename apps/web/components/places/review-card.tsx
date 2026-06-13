"use client";

import { useState } from "react";

const AVATAR_COLORS = [
  "bg-keria-gold/20 text-keria-gold",
  "bg-keria-success/20 text-keria-success-light",
  "bg-keria-info/20 text-keria-info-light",
  "bg-keria-error/20 text-keria-error-light",
  "bg-keria-forest/50 text-keria-cream",
];

export interface PlaceReview {
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export function ReviewCard({ review, index }: { review: PlaceReview; index: number }) {
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
