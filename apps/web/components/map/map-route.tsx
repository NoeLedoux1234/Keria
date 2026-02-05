"use client";

import { Source, Layer } from "react-map-gl";
import type { Coordinates } from "@meetpoint/types";

interface RouteData {
  participantId: string;
  participantName: string;
  color: string;
  polyline: Coordinates[];
  durationMinutes: number;
  distanceKm: number;
}

interface MapRouteProps {
  routes: RouteData[];
}

export function MapRoute({ routes }: MapRouteProps) {
  return (
    <>
      {routes.map((route) => {
        if (!route.polyline || route.polyline.length === 0) return null;

        // Convertir les coordonnées en format GeoJSON
        const coordinates = route.polyline.map((coord) => [coord.lng, coord.lat]);

        const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
          type: "Feature",
          properties: {
            name: route.participantName,
            duration: route.durationMinutes,
            distance: route.distanceKm,
          },
          geometry: {
            type: "LineString",
            coordinates,
          },
        };

        return (
          <Source
            key={`route-${route.participantId}`}
            id={`route-source-${route.participantId}`}
            type="geojson"
            data={geojson}
          >
            {/* Bordure de la ligne (pour meilleure visibilité) */}
            <Layer
              id={`route-outline-${route.participantId}`}
              type="line"
              paint={{
                "line-color": "#ffffff",
                "line-width": 6,
                "line-opacity": 0.8,
              }}
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
            />
            {/* Ligne principale */}
            <Layer
              id={`route-line-${route.participantId}`}
              type="line"
              paint={{
                "line-color": route.color,
                "line-width": 4,
                "line-opacity": 0.9,
              }}
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
            />
          </Source>
        );
      })}
    </>
  );
}
