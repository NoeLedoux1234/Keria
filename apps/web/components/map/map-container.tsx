"use client";

import { useRef, useCallback, useState, useImperativeHandle, forwardRef, type ReactNode } from "react";
import Map, { type MapRef, type ViewStateChangeEvent } from "react-map-gl";
import type { Coordinates } from "@meetpoint/types";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapContainerHandle {
  flyTo: (coordinates: Coordinates, zoom?: number) => void;
  fitBounds: (coordinates: Coordinates[], padding?: number) => void;
}

interface MapContainerProps {
  initialCenter?: Coordinates;
  initialZoom?: number;
  children?: ReactNode;
  onMove?: (center: Coordinates, zoom: number) => void;
  onClick?: (coordinates: Coordinates) => void;
  className?: string;
}

const DEFAULT_CENTER: Coordinates = { lat: 48.8566, lng: 2.3522 };
const DEFAULT_ZOOM = 12;

export const MapContainer = forwardRef<MapContainerHandle, MapContainerProps>(
  function MapContainer(
    {
      initialCenter = DEFAULT_CENTER,
      initialZoom = DEFAULT_ZOOM,
      children,
      onMove,
      onClick,
      className = "h-full w-full",
    },
    ref
  ) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: initialCenter.lat,
    longitude: initialCenter.lng,
    zoom: initialZoom,
  });

  const handleMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      setViewState(evt.viewState);
      onMove?.({ lat: evt.viewState.latitude, lng: evt.viewState.longitude }, evt.viewState.zoom);
    },
    [onMove]
  );

  const handleClick = useCallback(
    (evt: mapboxgl.MapLayerMouseEvent) => {
      onClick?.({ lat: evt.lngLat.lat, lng: evt.lngLat.lng });
    },
    [onClick]
  );

  const flyTo = useCallback((coordinates: Coordinates, zoom?: number) => {
    mapRef.current?.flyTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: zoom ?? mapRef.current.getZoom(),
      duration: 1500,
    });
  }, []);

  const fitBounds = useCallback((coordinates: Coordinates[], padding = 50) => {
    if (coordinates.length === 0) return;

    const bounds = coordinates.reduce(
      (acc, coord) => ({
        minLng: Math.min(acc.minLng, coord.lng),
        maxLng: Math.max(acc.maxLng, coord.lng),
        minLat: Math.min(acc.minLat, coord.lat),
        maxLat: Math.max(acc.maxLat, coord.lat),
      }),
      {
        minLng: coordinates[0]!.lng,
        maxLng: coordinates[0]!.lng,
        minLat: coordinates[0]!.lat,
        maxLat: coordinates[0]!.lat,
      }
    );

    mapRef.current?.fitBounds(
      [
        [bounds.minLng, bounds.minLat],
        [bounds.maxLng, bounds.maxLat],
      ],
      { padding, duration: 1500 }
    );
  }, []);

  useImperativeHandle(ref, () => ({
    flyTo,
    fitBounds,
  }), [flyTo, fitBounds]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div className={`flex items-center justify-center bg-keria-darker ${className}`}>
        <p className="text-keria-muted">
          Token Mapbox non configuré. Ajoutez NEXT_PUBLIC_MAPBOX_TOKEN dans .env.local
        </p>
      </div>
    );
  }

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={handleMove}
      onClick={handleClick}
      mapboxAccessToken={mapboxToken}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
      reuseMaps
    >
      {children}
    </Map>
  );
});
