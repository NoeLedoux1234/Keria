"use client";

import { use, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Badge } from "@meetpoint/ui";
import { useEvent, useEventParticipants } from "@/hooks";
import { MapContainer, MapStageMarker, MapStagePath, type MapContainerHandle } from "@/components/map";
import { StagesList, RSVPButtons, ParticipantsRSVPList } from "@/components/event";
import type { Id, Doc } from "../../../../../convex/_generated/dataModel";

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("code");

  const eventId = id as Id<"events">;
  const { event, stages, participants, rsvpCounts, isLoading } = useEvent(eventId);
  const { rsvp } = useEventParticipants(eventId);

  const mapRef = useRef<MapContainerHandle>(null);
  const [currentParticipantId, setCurrentParticipantId] = useState<Id<"eventParticipants"> | null>(null);
  const [selectedStage, setSelectedStage] = useState<Doc<"eventStages"> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`meetpoint-event-participant-${eventId}`);
    if (stored && participants) {
      const participant = participants.find((p: Doc<"eventParticipants">) => p._id === stored);
      if (participant) {
        setCurrentParticipantId(participant._id);
      }
    }
  }, [eventId, participants]);

  useEffect(() => {
    if (stages && stages.length >= 2) {
      const locations = stages.map((s: Doc<"eventStages">) => s.location);
      const timer = setTimeout(() => {
        mapRef.current?.fitBounds(locations, 80);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stages?.length]);

  const handleStageClick = (stage: Doc<"eventStages">) => {
    setSelectedStage(stage);
    mapRef.current?.flyTo(stage.location, 14);
  };

  const handleRSVP = async (status: "yes" | "no" | "maybe") => {
    if (!currentParticipantId) return;
    await rsvp({ participantId: currentParticipantId, rsvpStatus: status });
  };

  const handleFitAllStages = () => {
    if (!stages || stages.length === 0) return;
    const locations = stages.map((s: Doc<"eventStages">) => s.location);
    mapRef.current?.fitBounds(locations, 80);
  };

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-keria-darker">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-keria-gold border-t-transparent" />
          <span className="text-sm text-keria-muted">Chargement...</span>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-keria-darker">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 text-center">
          <p className="text-keria-muted">Événement non trouvé</p>
          <Link href="/" className="mt-4 inline-block text-sm text-keria-gold hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/join-event` : "";
  const currentParticipant = participants?.find((p: Doc<"eventParticipants">) => p._id === currentParticipantId);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusLabels: Record<string, string> = {
    published: "Publié",
    ongoing: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
    draft: "Brouillon",
  };

  return (
    <main className="relative flex h-screen flex-col lg:flex-row bg-keria-darker">
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Sidebar */}
      <aside className="relative z-10 w-full overflow-y-auto border-b border-keria-forest/20 bg-keria-darker p-5 lg:w-[380px] lg:border-b-0 lg:border-r">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-bold text-keria-cream/80 transition-colors hover:text-keria-cream">
            KERIA
          </Link>
          <Badge
            variant={
              event.status === "published"
                ? "success"
                : event.status === "ongoing"
                  ? "warning"
                  : event.status === "completed"
                    ? "primary"
                    : "danger"
            }
            className="text-[10px] uppercase"
          >
            {statusLabels[event.status]}
          </Badge>
        </div>

        {/* Event info */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-keria-cream">{event.name}</h1>
          {event.description && (
            <p className="mt-2 text-sm text-keria-muted">{event.description}</p>
          )}

          <div className="mt-3 space-y-1 text-[10px] uppercase tracking-wider text-keria-muted">
            <p className="text-keria-cream">{formatDate(event.startsAt)}</p>
            <p>
              {formatTime(event.startsAt)}
              {event.endsAt && ` — ${formatTime(event.endsAt)}`}
            </p>
          </div>

          {shareCode && (
            <div className="mt-4 rounded border border-keria-gold/30 bg-keria-gold/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-keria-gold/70">Code de partage</p>
              <p className="mt-1 font-mono text-3xl font-bold tracking-[0.2em] text-keria-gold">
                {shareCode}
              </p>
              <p className="mt-2 text-[10px] text-keria-muted">
                {shareUrl}
              </p>
            </div>
          )}
        </div>

        {/* Stages */}
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-keria-muted">
            Étapes ({stages?.length ?? 0})
          </h2>
          {stages && stages.length > 0 ? (
            <StagesList
              stages={stages}
              onStageClick={handleStageClick}
              selectedStageId={selectedStage?._id}
            />
          ) : (
            <p className="text-sm text-keria-muted">Aucune étape</p>
          )}
        </div>

        {/* Current participant RSVP */}
        {currentParticipant && (
          <div className="mb-6 rounded border border-keria-forest/30 bg-keria-forest/10 p-4">
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-keria-muted">
              Votre réponse
            </h2>
            <p className="mb-3 text-sm text-keria-muted">
              Vous participez en tant que <span className="font-medium text-keria-cream">{currentParticipant.name}</span>
            </p>
            <RSVPButtons
              currentStatus={currentParticipant.rsvpStatus as "yes" | "no" | "maybe" | "pending"}
              onRSVP={handleRSVP}
            />
          </div>
        )}

        {/* Join prompt */}
        {!currentParticipantId && participants && participants.length > 0 && (
          <div className="mb-6 rounded border border-keria-gold/30 bg-keria-gold/5 p-4">
            <p className="text-sm text-keria-muted">Vous n'êtes pas encore inscrit.</p>
            <a
              href={`/event/${eventId}/join${shareCode ? `?code=${shareCode}` : ""}`}
              className="mt-2 inline-block text-xs font-medium uppercase tracking-wider text-keria-gold hover:underline"
            >
              Rejoindre l'événement
            </a>
          </div>
        )}

        {/* Participants */}
        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-keria-muted">
            Participants ({participants?.length ?? 0})
          </h2>
          {participants && participants.length > 0 ? (
            <ParticipantsRSVPList
              participants={participants}
              currentParticipantId={currentParticipantId ?? undefined}
              rsvpCounts={rsvpCounts ?? undefined}
            />
          ) : (
            <p className="text-sm text-keria-muted">Aucun participant</p>
          )}
        </div>
      </aside>

      {/* Map */}
      <div className="relative z-0 flex-1">
        <button
          onClick={handleFitAllStages}
          className="absolute left-4 top-4 z-10 rounded border border-keria-forest/50 bg-keria-darker/90 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-keria-cream backdrop-blur-sm transition-colors hover:border-keria-gold/50 hover:text-keria-gold"
        >
          Voir tout
        </button>

        <MapContainer
          ref={mapRef}
          initialCenter={stages?.[0]?.location ?? { lat: 48.8566, lng: 2.3522 }}
          initialZoom={10}
        >
          {stages && stages.length >= 2 && (
            <MapStagePath
              stages={stages.map((s: Doc<"eventStages">) => ({
                order: s.order,
                location: s.location,
              }))}
            />
          )}

          {stages?.map((stage: Doc<"eventStages">) => (
            <MapStageMarker
              key={stage._id}
              coordinates={stage.location}
              name={stage.name}
              description={stage.description}
              stageType={stage.stageType as "departure" | "intermediate" | "arrival"}
              order={stage.order}
              scheduledAt={stage.scheduledAt}
              onClick={() => handleStageClick(stage)}
            />
          ))}
        </MapContainer>
      </div>
    </main>
  );
}
