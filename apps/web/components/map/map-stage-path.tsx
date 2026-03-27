"use client";

import { useId } from "react";
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
  color = "#6366f1",
  dashed = true,
}: MapStagePathProps) {
  const uniqueId = useId();
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  if (sortedStages.length < 2) return null;

  const sourceId = `event-stages-path-${uniqueId}`;
  const outlineLayerId = `stages-path-outline-${uniqueId}`;
  const lineLayerId = `stages-path-line-${uniqueId}`;

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
    <Source id={sourceId} type="geojson" data={geojson}>
      <Layer
        id={outlineLayerId}
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
      <Layer
        id={lineLayerId}
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
