"use client";

import { Marker } from "react-map-gl";
import type { Coordinates, TransportMode } from "@meetpoint/types";

interface MapMarkerProps {
  coordinates: Coordinates;
  label?: string;
  color?: "blue" | "red" | "green" | "orange" | "purple";
  transportMode?: TransportMode;
  onClick?: () => void;
}

const COLORS = {
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  orange: "#f97316",
  purple: "#8b5cf6",
};

const TransportIconsSvg: Record<TransportMode, React.ReactNode> = {
  driving: (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 11l1.5-4.5a2 2 0 011.9-1.5h7.2a2 2 0 011.9 1.5L19 11" />
      <path d="M5 11v6a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-6" />
      <path d="M5 11h14" />
    </svg>
  ),
  transit: (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="3" width="12" height="14" rx="2" />
      <path d="M6 12h12" />
    </svg>
  ),
  cycling: (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17l3-7h4l3 7" />
    </svg>
  ),
  walking: (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v5l3 4M12 11l-3 4M9 21l2-6M15 21l-2-6" />
    </svg>
  ),
};

export function MapMarker({
  coordinates,
  label,
  color = "blue",
  transportMode,
  onClick,
}: MapMarkerProps) {
  return (
    <Marker
      latitude={coordinates.lat}
      longitude={coordinates.lng}
      anchor="bottom"
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        {label && (
          <div className="mb-1 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium shadow-md">
            {transportMode && <span className="text-gray-600">{TransportIconsSvg[transportMode]}</span>}
            {label}
          </div>
        )}
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
          <path
            d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z"
            fill={COLORS[color]}
          />
          <circle cx="12" cy="12" r="4" fill="white" />
        </svg>
      </div>
    </Marker>
  );
}
