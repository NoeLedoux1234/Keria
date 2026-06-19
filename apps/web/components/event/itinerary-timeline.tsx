"use client";

import { motion } from "framer-motion";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

interface ItineraryTimelineProps {
  itinerary: Doc<"eventItineraries">;
  stages: Doc<"eventStages">[];
}

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDuration = (minutes: number) => {
  const rounded = Math.round(minutes);
  if (rounded < 60) return `${rounded} min`;
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest}`;
};

const isUnavailableSegment = (segment: Doc<"eventItineraries">["segments"][number]) =>
  segment.durationMinutes === 0 && segment.polyline.length === 0;

export function ItineraryTimeline({ itinerary, stages }: ItineraryTimelineProps) {
  const stageById = new Map<Id<"eventStages">, Doc<"eventStages">>(
    stages.map((stage) => [stage._id, stage])
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="border-keria-gold/30 bg-keria-gold/5 space-y-4 rounded border p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-keria-gold/20 border-b pb-4"
      >
        <p className="text-keria-muted text-[10px] uppercase tracking-wider">Départ recommandé</p>
        <p className="font-display text-keria-gold text-3xl font-bold">
          {formatTime(itinerary.recommendedDepartureAt)}
        </p>
        <div className="text-keria-muted mt-2 flex items-center gap-4 text-[10px] uppercase tracking-wider">
          <span>{formatDuration(itinerary.totalDurationMinutes)} de trajet</span>
          <span>{Math.round(itinerary.totalDistanceKm * 10) / 10} km</span>
        </div>
      </motion.div>

      <ol className="relative">
        {itinerary.segments.map((segment, index) => {
          const stage = stageById.get(segment.toStageId);
          const isLast = index === itinerary.segments.length - 1;
          const unavailable = isUnavailableSegment(segment);

          return (
            <motion.li
              key={segment.toStageId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
              className={`relative flex gap-3 ${!isLast ? "pb-5" : ""}`}
            >
              {!isLast && (
                <span className="bg-keria-forest/50 absolute left-[5px] top-4 h-full w-0.5" />
              )}
              <span
                className={`relative z-10 mt-1 h-3 w-3 flex-shrink-0 rounded-full ${
                  unavailable ? "bg-keria-error" : "bg-keria-gold"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-keria-cream truncate text-sm font-medium">
                    {stage?.name ?? "Étape"}
                  </span>
                  {stage && (
                    <span className="text-keria-gold flex-shrink-0 font-mono text-xs">
                      {formatTime(stage.scheduledAt)}
                    </span>
                  )}
                </div>
                {unavailable ? (
                  <p className="text-keria-error-light mt-0.5 text-[10px] uppercase tracking-wider">
                    Trajet indisponible
                  </p>
                ) : (
                  <p className="text-keria-muted mt-0.5 text-[10px] uppercase tracking-wider">
                    {formatDuration(segment.durationMinutes)} •{" "}
                    {Math.round(segment.distanceKm * 10) / 10} km
                  </p>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}
