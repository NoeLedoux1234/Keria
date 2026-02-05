"use client";

import { Source, Layer } from "react-map-gl";
import type { Coordinates } from "@meetpoint/types";

interface Stage {
  order: number;
  location: Coordinates;
}

interface MapStagePathProps {
  stages: Stage[];
  color?: string;
  dashed?: boolean;
}

export function MapStagePath({
  stages,
  color = "#6366f1", // indigo
  dashed = true,
}: MapStagePathProps) {
  // Trier les étapes par ordre et extraire les coordonnées
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  if (sortedStages.length < 2) return null;

  // Convertir en format GeoJSON
  const coordinates = sortedStages.map((stage) => [
    stage.location.lng,
    stage.location.lat,
  ]);

  const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates,
    },
  };

  return (
    <Source id="event-stages-path" type="geojson" data={geojson}>
      {/* Bordure blanche pour meilleure visibilité */}
      <Layer
        id="stages-path-outline"
        type="line"
        paint={{
          "line-color": "#ffffff",
          "line-width": 6,
          "line-opacity": 0.9,
        }}
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
      />
      {/* Ligne principale */}
      <Layer
        id="stages-path-line"
        type="line"
        paint={{
          "line-color": color,
          "line-width": 4,
          "line-opacity": 0.9,
          ...(dashed && {
            "line-dasharray": [2, 2],
          }),
        }}
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
      />
    </Source>
  );
}
