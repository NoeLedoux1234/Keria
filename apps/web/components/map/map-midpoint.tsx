"use client";

import { Marker } from "react-map-gl";
import type { Coordinates } from "@meetpoint/types";

interface MapMidpointProps {
  coordinates: Coordinates;
  fairnessScore?: number;
  onClick?: () => void;
}

export function MapMidpoint({ coordinates, fairnessScore, onClick }: MapMidpointProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#6b8f4a";
    if (score >= 60) return "#c9a227";
    if (score >= 40) return "#a65a4a";
    return "#8a3a2a";
  };

  return (
    <Marker
      latitude={coordinates.lat}
      longitude={coordinates.lng}
      anchor="center"
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Cercle pulsant */}
          <div className="absolute inset-0 animate-ping rounded-full bg-keria-gold opacity-25" />

          {/* Marqueur principal */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-keria-cream bg-keria-gold shadow-lg">
            <svg
              className="h-5 w-5 text-keria-darker"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Badge score */}
        {fairnessScore !== undefined && (
          <div
            className="mt-1 rounded-full px-2 py-0.5 text-xs font-bold text-white shadow"
            style={{ backgroundColor: getScoreColor(fairnessScore) }}
          >
            {fairnessScore}% équitable
          </div>
        )}
      </div>
    </Marker>
  );
}
