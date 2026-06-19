"use client";

import { use, useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@meetpoint/ui";
import dynamic from "next/dynamic";
import { useEvent, useEventStages, useEventParticipants, useEventItinerary } from "@/hooks";
import { MapStageMarker, MapStagePath, MapRoute, MapMarker } from "@/components/map";
import { api } from "../../../../../convex/_generated/api";
import {
  StagesList,
  RSVPButtons,
  ParticipantsRSVPList,
  EventShareCard,
  EventEditForm,
  EventLifecycleControls,
  EventStagesEditor,
  ParticipantLogisticsForm,
  ItineraryTimeline,
  StagePlacesPanel,
} from "@/components/event";
import { PageBackground } from "@/components/page-background";
import {
  resolveDisplayStatus,
  getStatusLabel,
  getStatusBadgeVariant,
  type EventStatus,
} from "@/lib/event-status";
import type { MapContainerHandle } from "@/components/map";
import type { Id, Doc } from "../../../../../convex/_generated/dataModel";
import type { RsvpStatus, TransportMode } from "@meetpoint/types";

const MapContainer = dynamic(
  () => import("@/components/map/map-container").then((m) => ({ default: m.MapContainer })),
  { ssr: false }
);

type StageType = "departure" | "intermediate" | "arrival";

const PARTICIPANT_ROUTE_COLOR = "#c9a227";

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("code");

  const eventId = id as Id<"events">;
  const {
    event,
    stages,
    participants,
    rsvpCounts,
    isLoading,
    isEditor,
    updateEvent,
    updateStatus,
  } = useEvent(eventId);
  const { addStage, updateStage, removeStage } = useEventStages(eventId);
  const { rsvp } = useEventParticipants(eventId);

  const mapRef = useRef<MapContainerHandle>(null);
  const [currentParticipantId, setCurrentParticipantId] = useState<Id<"eventParticipants"> | null>(
    null
  );
  const { itinerary, isCalculating, setLogistics, calculate } = useEventItinerary(
    eventId,
    currentParticipantId
  );
  const [selectedStage, setSelectedStage] = useState<Doc<"eventStages"> | null>(null);

  const selectedStagePlaces = useQuery(
    api.eventPlaces.listByStage,
    selectedStage ? { eventStageId: selectedStage._id } : "skip"
  );

  useEffect(() => {
    if (!participants) return;
    const storageKey = `meetpoint-event-participant-${eventId}`;
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      setCurrentParticipantId(null);
      return;
    }
    const participant = participants.find((p: Doc<"eventParticipants">) => p._id === stored);
    if (participant) {
      setCurrentParticipantId(participant._id);
    } else {
      localStorage.removeItem(storageKey);
      setCurrentParticipantId(null);
    }
  }, [eventId, participants]);

  const stageCount = stages?.length ?? 0;

  useEffect(() => {
    if (stages && stages.length >= 2) {
      const locations = stages.map((s: Doc<"eventStages">) => s.location);
      const timer = setTimeout(() => {
        mapRef.current?.fitBounds(locations, 80);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stageCount]);

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

  const currentParticipant = participants?.find(
    (p: Doc<"eventParticipants">) => p._id === currentParticipantId
  );

  const hasLogistics = Boolean(currentParticipant?.location && currentParticipant?.transportMode);

  const itineraryRoutes = useMemo(() => {
    if (!itinerary || !currentParticipant) return [];
    const drawableSegments = itinerary.segments.filter((segment) => segment.polyline.length > 0);
    if (drawableSegments.length === 0) return [];

    return drawableSegments.map((segment) => ({
      participantId: `${currentParticipant._id}-${segment.toStageId}`,
      participantName: currentParticipant.name,
      color: PARTICIPANT_ROUTE_COLOR,
      polyline: segment.polyline,
      durationMinutes: segment.durationMinutes,
      distanceKm: segment.distanceKm,
    }));
  }, [itinerary, currentParticipant]);

  if (isLoading) {
    return (
      <main className="bg-keria-darker relative flex min-h-screen items-center justify-center">
        <PageBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="border-keria-gold h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-keria-muted text-sm">Chargement...</span>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="bg-keria-darker relative flex min-h-screen items-center justify-center">
        <PageBackground />
        <div className="relative z-10 text-center">
          <p className="text-keria-muted">Événement non trouvé</p>
          <Link href="/" className="text-keria-gold mt-4 inline-block text-sm hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

  const displayStatus = resolveDisplayStatus({
    status: event.status as EventStatus,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
  });

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

  return (
    <main className="bg-keria-darker relative flex h-screen flex-col lg:flex-row">
      <PageBackground />

      {/* Sidebar */}
      <aside className="border-keria-forest/20 bg-keria-darker relative z-10 max-h-[50vh] w-full overflow-y-auto border-b p-5 lg:h-screen lg:max-h-none lg:w-[380px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-keria-cream/80 hover:text-keria-cream text-lg font-bold transition-colors"
          >
            KERIA
          </Link>
          <Badge variant={getStatusBadgeVariant(displayStatus)} className="text-[10px] uppercase">
            {getStatusLabel(displayStatus)}
          </Badge>
        </div>

        {/* Event info */}
        <section className="mb-6">
          <h1 className="border-keria-gold font-display text-keria-cream border-l-2 pl-3 text-2xl font-bold">
            {event.name}
          </h1>
          {event.description && (
            <p className="text-keria-muted mt-2 text-sm">{event.description}</p>
          )}

          <div className="text-keria-muted mt-3 space-y-1 text-[10px] uppercase tracking-wider">
            <p className="text-keria-cream">{formatDate(event.startsAt)}</p>
            <p>
              {formatTime(event.startsAt)}
              {event.endsAt && ` — ${formatTime(event.endsAt)}`}
            </p>
          </div>

          {isEditor && (
            <EventEditForm name={event.name} description={event.description} onSave={updateEvent} />
          )}
        </section>

        {/* Lifecycle controls (creator only) */}
        {isEditor && (
          <section className="border-keria-forest/30 bg-keria-forest/10 mb-6 rounded border p-4">
            <h2 className="text-keria-muted mb-3 text-xs font-medium uppercase tracking-wider">
              Cycle de vie
            </h2>
            <EventLifecycleControls
              status={event.status as EventStatus}
              onChangeStatus={updateStatus}
            />
          </section>
        )}

        {/* Share card */}
        {shareCode && (
          <section className="mb-6">
            <EventShareCard eventName={event.name} shareCode={shareCode} />
          </section>
        )}

        {/* Stages */}
        <section className="mb-6">
          <h2 className="border-keria-gold text-keria-muted mb-3 border-l-2 pl-3 text-xs font-medium uppercase tracking-wider">
            Étapes ({stages?.length ?? 0})
          </h2>
          {isEditor ? (
            <EventStagesEditor
              stages={stages ?? []}
              onAddStage={addStage}
              onUpdateStage={updateStage}
              onRemoveStage={removeStage}
              onStageClick={handleStageClick}
              selectedStageId={selectedStage?._id}
            />
          ) : stages && stages.length > 0 ? (
            <StagesList
              stages={stages}
              onStageClick={handleStageClick}
              selectedStageId={selectedStage?._id}
            />
          ) : (
            <p className="text-keria-muted text-sm">Aucune étape</p>
          )}
        </section>

        {/* Suggested places & vote for the selected stage */}
        {selectedStage && (
          <StagePlacesPanel
            key={selectedStage._id}
            stage={selectedStage}
            currentParticipantId={currentParticipantId}
          />
        )}

        {/* Current participant RSVP */}
        {currentParticipant && (
          <section className="border-keria-forest/30 bg-keria-forest/10 mb-6 rounded border p-4">
            <h2 className="text-keria-muted mb-2 text-xs font-medium uppercase tracking-wider">
              Votre réponse
            </h2>
            <p className="text-keria-muted mb-3 text-sm">
              Vous participez en tant que{" "}
              <span className="text-keria-cream font-medium">{currentParticipant.name}</span>
            </p>
            <RSVPButtons
              currentStatus={currentParticipant.rsvpStatus as RsvpStatus}
              onRSVP={handleRSVP}
            />
          </section>
        )}

        {/* Current participant logistics & itinerary */}
        {currentParticipant && stages && stages.length > 0 ? (
          <section className="mb-6 space-y-4">
            <h2 className="border-keria-gold text-keria-muted border-l-2 pl-3 text-xs font-medium uppercase tracking-wider">
              Votre itinéraire
            </h2>
            <ParticipantLogisticsForm
              participantId={currentParticipant._id}
              eventId={eventId}
              initialLocation={currentParticipant.location}
              initialAddress={currentParticipant.address}
              initialTransportMode={currentParticipant.transportMode as TransportMode | undefined}
              hasLogistics={hasLogistics}
              isCalculating={isCalculating}
              onSubmit={setLogistics}
              onCalculate={calculate}
            />
            {itinerary ? <ItineraryTimeline itinerary={itinerary} stages={stages} /> : null}
          </section>
        ) : null}

        {/* Join prompt */}
        {!currentParticipantId && participants && participants.length > 0 && (
          <section className="border-keria-gold/30 bg-keria-gold/5 mb-6 rounded border p-4">
            <p className="text-keria-muted text-sm">Vous n'êtes pas encore inscrit.</p>
            <a
              href={`/event/${eventId}/join${shareCode ? `?code=${shareCode}` : ""}`}
              className="text-keria-gold mt-2 inline-block text-xs font-medium uppercase tracking-wider hover:underline"
            >
              Rejoindre l'événement
            </a>
          </section>
        )}

        {/* Participants */}
        <section>
          <h2 className="border-keria-gold text-keria-muted mb-3 border-l-2 pl-3 text-xs font-medium uppercase tracking-wider">
            Participants ({participants?.length ?? 0})
          </h2>
          {participants && participants.length > 0 ? (
            <ParticipantsRSVPList
              participants={participants}
              currentParticipantId={currentParticipantId ?? undefined}
              rsvpCounts={rsvpCounts ?? undefined}
            />
          ) : (
            <p className="text-keria-muted text-sm">Aucun participant</p>
          )}
        </section>
      </aside>

      {/* Map */}
      <div className="border-keria-forest/20 relative z-0 flex-1 border">
        <motion.button
          onClick={handleFitAllStages}
          className="border-keria-gold/30 bg-keria-darker/90 text-keria-cream hover:border-keria-gold/50 hover:text-keria-gold absolute left-4 top-4 z-10 rounded border px-4 py-2 text-[10px] font-medium uppercase tracking-wider backdrop-blur-md transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Voir tout
        </motion.button>

        <MapContainer
          ref={mapRef}
          initialCenter={stages?.[0]?.location ?? { lat: 48.8566, lng: 2.3522 }}
          initialZoom={10}
        >
          {itineraryRoutes.length > 0 && <MapRoute routes={itineraryRoutes} />}

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
              stageType={stage.stageType as StageType}
              order={stage.order}
              scheduledAt={stage.scheduledAt}
              onClick={() => handleStageClick(stage)}
            />
          ))}

          {selectedStagePlaces?.map((place: Doc<"places">) => (
            <MapMarker
              key={place._id}
              coordinates={place.location}
              label={place.name}
              color="gold"
            />
          ))}
        </MapContainer>
      </div>
    </main>
  );
}
