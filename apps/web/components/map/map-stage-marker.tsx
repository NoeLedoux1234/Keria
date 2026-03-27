"use client";

import { Marker, Popup } from "react-map-gl";
import { useState } from "react";
import type { Coordinates } from "@meetpoint/types";

type StageType = "departure" | "intermediate" | "arrival";

interface MapStageMarkerProps {
  coordinates: Coordinates;
  name: string;
  description?: string;
  stageType: StageType;
  order: number;
  scheduledAt: number;
  onClick?: () => void;
}

const STAGE_COLORS: Record<StageType, string> = {
  departure: "#6b8f4a", // keria-success
  intermediate: "#c9a227", // keria-gold
  arrival: "#a65a4a", // keria-error
};

const StageTypeLabels: Record<StageType, string> = {
  departure: "Départ",
  intermediate: "Étape",
  arrival: "Arrivée",
};

export function MapStageMarker({
  coordinates,
  name,
  description,
  stageType,
  order,
  scheduledAt,
  onClick,
}: MapStageMarkerProps) {
  const [showPopup, setShowPopup] = useState(false);

  const formattedTime = new Date(scheduledAt).toLocaleString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Marker
        latitude={coordinates.lat}
        longitude={coordinates.lng}
        anchor="center"
        onClick={() => {
          setShowPopup(true);
          onClick?.();
        }}
      >
        <div className="flex flex-col items-center cursor-pointer">
          {/* Numéro de l'étape */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg transition-transform hover:scale-110"
            style={{ backgroundColor: STAGE_COLORS[stageType] }}
          >
            {order + 1}
          </div>
          {/* Label */}
          <div className="mt-1 rounded-full bg-keria-darker/90 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-keria-cream shadow-md">
            {name}
          </div>
        </div>
      </Marker>

      {showPopup && (
        <Popup
          latitude={coordinates.lat}
          longitude={coordinates.lng}
          anchor="bottom"
          offset={25}
          closeOnClick={false}
          onClose={() => setShowPopup(false)}
        >
          <div className="min-w-[180px] p-2">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: STAGE_COLORS[stageType] }}
              >
                {order + 1}
              </span>
              <h3 className="font-semibold">{name}</h3>
            </div>
            <p className="mt-1 text-xs text-keria-muted">{formattedTime}</p>
            {description && (
              <p className="mt-2 text-sm text-keria-cream/80">{description}</p>
            )}
            <div className="mt-2 flex items-center gap-1 text-xs text-keria-muted">
              {stageType === "departure" && "Point de départ"}
              {stageType === "intermediate" && "Étape intermédiaire"}
              {stageType === "arrival" && "Point d'arrivée"}
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
