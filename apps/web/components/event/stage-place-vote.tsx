"use client";

import { motion } from "framer-motion";

interface StagePlaceVoteProps {
  placeName: string;
  score: number;
  upvotes: number;
  downvotes: number;
  currentVote: "up" | "down" | null;
  canVote: boolean;
  onVote: (vote: "up" | "down") => void;
}

export function StagePlaceVote({
  placeName,
  score,
  upvotes,
  downvotes,
  currentVote,
  canVote,
  onVote,
}: StagePlaceVoteProps) {
  return (
    <div className="flex items-center gap-3">
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

      <div className="flex gap-1.5">
        <motion.button
          whileTap={canVote ? { scale: 0.9 } : undefined}
          onClick={() => onVote("up")}
          disabled={!canVote}
          aria-label={`Voter pour ${placeName}`}
          aria-pressed={currentVote === "up"}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            currentVote === "up"
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
        </motion.button>

        <motion.button
          whileTap={canVote ? { scale: 0.9 } : undefined}
          onClick={() => onVote("down")}
          disabled={!canVote}
          aria-label={`Voter contre ${placeName}`}
          aria-pressed={currentVote === "down"}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            currentVote === "down"
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
        </motion.button>
      </div>
    </div>
  );
}
