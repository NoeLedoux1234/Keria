"use client";

import { use, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAction } from "convex/react";
import { motion } from "framer-motion";
import { Button, Badge } from "@meetpoint/ui";
import { useMeet } from "@/hooks";
import { MapContainer, MapMarker, MapMidpoint, MapRoute, type MapContainerHandle } from "@/components/map";
import { PlacesList } from "@/components/places-list";
import { PageBackground } from "@/components/page-background";
import { calculateMidpointWithMetrics } from "@meetpoint/geo";
import { api } from "../../../../../convex/_generated/api";
import type { Id, Doc } from "../../../../../convex/_generated/dataModel";

const MARKER_COLORS = ["gold", "success", "muted", "forest", "error"] as const;

const TransportIcons: Record<string, React.ReactNode> = {
  driving: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 11l1.5-4.5a2 2 0 011.9-1.5h7.2a2 2 0 011.9 1.5L19 11" />
      <path d="M5 11v6a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-6" />
      <path d="M5 11h14" />
      <circle cx="7.5" cy="14" r="1" />
      <circle cx="16.5" cy="14" r="1" />
    </svg>
  ),
  transit: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="3" width="12" height="14" rx="2" />
      <path d="M6 12h12" />
      <circle cx="8.5" cy="15" r="1" />
      <circle cx="15.5" cy="15" r="1" />
      <path d="M8 20l-1 2m9-2l1 2" />
    </svg>
  ),
  cycling: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17l3-7h4l3 7" />
      <path d="M9 10l3-4" />
      <circle cx="12" cy="5" r="1" />
    </svg>
  ),
  walking: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v5l3 4" />
      <path d="M12 11l-3 4" />
      <path d="M9 21l2-6" />
      <path d="M15 21l-2-6" />
    </svg>
  ),
};

const COLOR_HEX: Record<string, string> = {
  gold: "#c9a227",
  success: "#6b8f4a",
  muted: "#8a8a78",
  forest: "#3d4435",
  error: "#a65a4a",
};

interface RouteData {
  participantId: string;
  participantName: string;
  transportMode: string;
  durationMinutes?: number;
  distanceKm?: number;
  polyline?: Array<{ lat: number; lng: number }>;
  error?: string;
}

export default function MeetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("code");

  const meetId = id as Id<"meets">;
  const { meet, participants, isLoading, updateMidpoint } = useMeet(meetId);
  const calculateAllRoutes = useAction(api.routing.calculateAllRoutes);

  const mapRef = useRef<MapContainerHandle>(null);

  const [currentParticipantId, setCurrentParticipantId] = useState<Id<"participants"> | null>(null);
  const [isCalculatingRoutes, setIsCalculatingRoutes] = useState(false);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = () => {
    if (!shareCode) return;
    navigator.clipboard.writeText(shareCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  useEffect(() => {
    const stored = localStorage.getItem(`meetpoint-participant-${meetId}`);
    if (stored && participants) {
      const participant = participants.find((p: Doc<"participants">) => p._id === stored);
      if (participant) {
        setCurrentParticipantId(participant._id);
      }
    }
  }, [meetId, participants]);

  const participantCount = participants?.length ?? 0;

  useEffect(() => {
    if (participants && participants.length >= 2) {
      const locations = participants.map((p: Doc<"participants">) => p.location);
      const timer = setTimeout(() => {
        mapRef.current?.fitBounds(locations, 80);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [participantCount]);

  const handleSelectParticipant = (participantId: Id<"participants">) => {
    localStorage.setItem(`meetpoint-participant-${meetId}`, participantId);
    setCurrentParticipantId(participantId);

    const participant = participants?.find((p: Doc<"participants">) => p._id === participantId);
    if (participant) {
      mapRef.current?.flyTo(participant.location, 14);
    }
  };

  const handleFitAllParticipants = () => {
    if (!participants || participants.length === 0) return;
    const locations = participants.map((p: Doc<"participants">) => p.location);
    if (midpointResult) {
      locations.push(midpointResult.midpoint);
    }
    mapRef.current?.fitBounds(locations, 80);
  };

  const midpointResult =
    participants && participants.length >= 2
      ? calculateMidpointWithMetrics(participants.map((p: Doc<"participants">) => p.location))
      : null;

  const handleRecalculate = async () => {
    if (!midpointResult) return;

    await updateMidpoint({
      meetId,
      midpoint: midpointResult.midpoint,
      fairnessScore: midpointResult.fairnessScore,
      averageDistanceKm: midpointResult.averageDistanceKm,
    });
  };

  const handleCalculateRoutes = async () => {
    if (!midpointResult) return;

    setIsCalculatingRoutes(true);
    try {
      const result = await calculateAllRoutes({
        meetId,
        midpointLat: midpointResult.midpoint.lat,
        midpointLng: midpointResult.midpoint.lng,
      });

      if (result.success) {
        setRoutes(result.routes);
      }
    } catch (_error) {
      setRoutes([]);
    } finally {
      setIsCalculatingRoutes(false);
    }
  };

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-keria-darker">
        <PageBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-keria-gold border-t-transparent" />
          <span className="text-sm text-keria-muted">Chargement...</span>
        </div>
      </main>
    );
  }

  if (!meet) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-keria-darker">
        <PageBackground />
        <div className="relative z-10 text-center">
          <p className="text-keria-muted">MeetPoint non trouvé</p>
          <Link href="/" className="mt-4 inline-block text-sm text-keria-gold hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/join` : "";
  const maxTravelTime = participants
    ? Math.max(...participants.map((p: Doc<"participants">) => p.travelTimeMinutes ?? 0))
    : 0;

  return (
    <main className="relative flex h-screen flex-col lg:flex-row bg-keria-darker">
      <PageBackground />

      {/* Sidebar */}
      <aside className="relative z-10 w-full overflow-y-auto border-b border-keria-forest/20 bg-keria-darker p-5 lg:w-[380px] lg:border-b-0 lg:border-r">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-bold text-keria-cream/80 transition-colors hover:text-keria-cream">
            KERIA
          </Link>
          <Badge variant={meet.status === "pending" ? "warning" : "success"} className="text-[10px] uppercase">
            {meet.status}
          </Badge>
        </div>

        {/* Meet info */}
        <div className="mb-6">
          <h1 className="border-l-2 border-keria-gold pl-3 font-display text-2xl font-bold text-keria-cream">{meet.name}</h1>

          {shareCode && (
            <div className="mt-4 rounded border border-keria-gold/30 bg-keria-gold/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wider text-keria-gold">Code de partage</p>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 rounded px-2 py-1 text-[10px] uppercase tracking-wider text-keria-gold transition-colors hover:bg-keria-gold/10 hover:text-keria-gold"
                >
                  {codeCopied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copié
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      Copier
                    </>
                  )}
                </button>
              </div>
              <p className="mt-1 font-mono text-3xl font-bold tracking-[0.2em] text-keria-gold">
                {shareCode}
              </p>
              <p className="mt-2 text-[10px] text-keria-muted">
                {shareUrl}
              </p>
            </div>
          )}
        </div>

        {/* Participants */}
        <div className="mb-6">
          <h2 className="mb-3 border-l-2 border-keria-gold pl-3 text-xs font-medium uppercase tracking-wider text-keria-muted">
            Participants ({participants?.length ?? 0})
          </h2>
          {participants && participants.length > 0 ? (
            <ul className="space-y-2">
              {participants.map((p: Doc<"participants">, i: number) => {
                const googleMapsUrl = midpointResult
                  ? `https://www.google.com/maps/dir/?api=1&origin=${p.location.lat},${p.location.lng}&destination=${midpointResult.midpoint.lat},${midpointResult.midpoint.lng}&travelmode=${p.transportMode === "transit" ? "transit" : p.transportMode}`
                  : null;

                return (
                  <motion.li
                    key={p._id}
                    className={`rounded border p-3 transition-colors ${
                      currentParticipantId === p._id
                        ? "border-keria-gold/50 bg-keria-gold/10"
                        : "border-keria-forest/30 bg-keria-forest/10 hover:border-keria-forest/50"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                  >
                    <div
                      onClick={() => handleSelectParticipant(p._id)}
                      className="flex cursor-pointer items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLOR_HEX[MARKER_COLORS[i % MARKER_COLORS.length]!] }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-keria-cream">{p.name}</span>
                            {p.isCreator && (
                              <span className="text-[9px] uppercase tracking-wider text-keria-gold">Créateur</span>
                            )}
                          </div>
                          {p.travelTimeMinutes !== undefined && p.travelTimeMinutes > 0 && (
                            <p className="text-[10px] text-keria-muted">
                              {p.travelTimeMinutes} min • {p.travelDistanceKm} km
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-keria-muted">
                        {currentParticipantId === p._id && (
                          <span className="text-[10px] text-keria-gold">Vous</span>
                        )}
                        {TransportIcons[p.transportMode]}
                      </div>
                    </div>

                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 flex items-center justify-center gap-2 rounded bg-keria-gold px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-keria-darker transition-colors hover:bg-keria-gold-light"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="3 11 22 2 13 21 11 13 3 11" />
                        </svg>
                        Itinéraire
                      </a>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-keria-muted">Aucun participant</p>
          )}
          {!currentParticipantId && participants && participants.length > 0 && (
            <p className="mt-3 text-[10px] text-keria-gold">
              Cliquez sur votre nom pour voter
            </p>
          )}
        </div>

        {/* Midpoint Stats */}
        {midpointResult && (
          <div className="mb-6 rounded border border-keria-forest/30 bg-keria-forest/10 p-4">
            <h2 className="mb-3 border-l-2 border-keria-gold pl-3 text-xs font-medium uppercase tracking-wider text-keria-muted">
              Point de rencontre
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-keria-muted">Équité</p>
                <p className="font-display text-3xl font-bold text-keria-gold">
                  {midpointResult.fairnessScore}%
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-keria-muted">Distance moy.</p>
                <p className="font-display text-3xl font-bold text-keria-cream">
                  {midpointResult.averageDistanceKm} <span className="text-lg">km</span>
                </p>
              </div>
            </div>

            {maxTravelTime > 0 && (
              <div className="mt-4 rounded bg-keria-darker/50 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-keria-muted">Trajet max</p>
                <p className="font-display text-2xl font-bold text-keria-cream">{maxTravelTime} min</p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-[10px] uppercase tracking-wider" onClick={handleRecalculate}>
                Recalculer
              </Button>
              <Button variant="primary" size="sm" className="flex-1 text-[10px] uppercase tracking-wider" onClick={handleCalculateRoutes} isLoading={isCalculatingRoutes}>
                Trajets
              </Button>
            </div>

            {routes.length > 0 && (
              <p className="mt-3 text-center text-[10px] text-keria-success-light">
                {routes.filter(r => r.polyline && r.polyline.length > 0).length} trajets affichés
              </p>
            )}
          </div>
        )}

        {/* Places */}
        <PlacesList
          meetId={meetId}
          midpoint={midpointResult?.midpoint ?? null}
          participantId={currentParticipantId ?? undefined}
        />
      </aside>

      {/* Map */}
      <div className="relative z-0 flex-1 border border-keria-forest/20">
        <motion.button
          onClick={handleFitAllParticipants}
          className="absolute left-4 top-4 z-10 rounded border border-keria-gold/30 bg-keria-darker/90 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-keria-cream backdrop-blur-md transition-colors hover:border-keria-gold/50 hover:text-keria-gold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Voir tout
        </motion.button>
        <MapContainer
          ref={mapRef}
          initialCenter={participants?.[0]?.location ?? { lat: 48.8566, lng: 2.3522 }}
          initialZoom={11}
        >
          {routes.length > 0 && (
            <MapRoute
              routes={routes
                .filter((r) => r.polyline && r.polyline.length > 0)
                .map((route) => {
                  const participantIndex = participants?.findIndex(
                    (p: Doc<"participants">) => p._id === route.participantId
                  ) ?? 0;
                  return {
                    participantId: route.participantId,
                    participantName: route.participantName,
                    color: COLOR_HEX[MARKER_COLORS[participantIndex % MARKER_COLORS.length]!] ?? "#c9a227",
                    polyline: route.polyline!,
                    durationMinutes: route.durationMinutes ?? 0,
                    distanceKm: route.distanceKm ?? 0,
                  };
                })}
            />
          )}

          {participants?.map((p: Doc<"participants">, i: number) => (
            <MapMarker
              key={p._id}
              coordinates={p.location}
              label={p.name}
              color={MARKER_COLORS[i % MARKER_COLORS.length]}
              transportMode={p.transportMode}
            />
          ))}

          {midpointResult && (
            <MapMidpoint
              coordinates={midpointResult.midpoint}
              fairnessScore={midpointResult.fairnessScore}
            />
          )}
        </MapContainer>
      </div>
    </main>
  );
}
