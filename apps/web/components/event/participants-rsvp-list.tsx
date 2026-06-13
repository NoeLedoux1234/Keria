"use client";

import { Badge } from "@meetpoint/ui";
import { RSVPBadge } from "./rsvp-buttons";
import type { Doc } from "../../../../convex/_generated/dataModel";
import type { RsvpStatus } from "@meetpoint/types";

interface ParticipantsRSVPListProps {
  participants: Doc<"eventParticipants">[];
  currentParticipantId?: string;
  rsvpCounts?: {
    yes: number;
    no: number;
    maybe: number;
    pending: number;
    total: number;
  };
}

const SECTION_CONFIG: Record<RsvpStatus, { label: string; order: number }> = {
  yes: { label: "Participants", order: 1 },
  maybe: { label: "Peut-être", order: 2 },
  pending: { label: "En attente", order: 3 },
  no: { label: "Ne participent pas", order: 4 },
};

const SectionIndicators: Record<RsvpStatus, React.ReactNode> = {
  yes: <span className="bg-keria-success h-2 w-2 rounded-full" />,
  maybe: <span className="bg-keria-gold h-2 w-2 rounded-full" />,
  pending: <span className="bg-keria-muted h-2 w-2 rounded-full" />,
  no: <span className="bg-keria-error h-2 w-2 rounded-full" />,
};

export function ParticipantsRSVPList({
  participants,
  currentParticipantId,
  rsvpCounts,
}: ParticipantsRSVPListProps) {
  const groupedParticipants = participants.reduce(
    (acc, participant) => {
      const status = participant.rsvpStatus as RsvpStatus;
      if (!acc[status]) acc[status] = [];
      acc[status].push(participant);
      return acc;
    },
    {} as Record<RsvpStatus, Doc<"eventParticipants">[]>
  );

  const sortedStatuses = (Object.keys(SECTION_CONFIG) as RsvpStatus[]).sort(
    (a, b) => SECTION_CONFIG[a].order - SECTION_CONFIG[b].order
  );

  const getInitialColor = (name: string) => {
    const colors = [
      "bg-keria-gold",
      "bg-keria-success",
      "bg-keria-info",
      "bg-keria-error",
      "bg-keria-forest",
      "bg-keria-muted",
      "bg-keria-success-dark",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-4">
      {/* Résumé des RSVP */}
      {rsvpCounts && (
        <div className="bg-keria-forest/30 flex flex-wrap gap-2 rounded-lg p-3">
          <div className="flex items-center gap-1.5">
            <span className="bg-keria-success h-2 w-2 rounded-full" />
            <span className="text-keria-cream text-sm">{rsvpCounts.yes} oui</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-keria-gold h-2 w-2 rounded-full" />
            <span className="text-keria-cream text-sm">{rsvpCounts.maybe} peut-être</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-keria-error h-2 w-2 rounded-full" />
            <span className="text-keria-cream text-sm">{rsvpCounts.no} non</span>
          </div>
          {rsvpCounts.pending > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="bg-keria-muted h-2 w-2 rounded-full" />
              <span className="text-keria-cream text-sm">{rsvpCounts.pending} en attente</span>
            </div>
          )}
        </div>
      )}

      {/* Sections par statut */}
      {sortedStatuses.map((status) => {
        const participantsInStatus = groupedParticipants[status] || [];
        if (participantsInStatus.length === 0) return null;

        const config = SECTION_CONFIG[status];

        return (
          <div key={status}>
            <h4 className="text-keria-muted mb-2 flex items-center gap-2 text-sm font-medium">
              {SectionIndicators[status]}
              <span>{config.label}</span>
              <span className="text-keria-forest">({participantsInStatus.length})</span>
            </h4>

            <ul className="space-y-2">
              {participantsInStatus.map((participant) => {
                const isCurrent = participant._id === currentParticipantId;

                return (
                  <li
                    key={participant._id}
                    className={`flex items-center justify-between rounded-lg p-2 ${
                      isCurrent
                        ? "bg-keria-gold/10 ring-keria-gold/50 ring-1"
                        : "bg-keria-forest/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {/* Avatar avec initiales */}
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white ${getInitialColor(participant.name)}`}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-keria-cream font-medium">{participant.name}</span>
                          {participant.isCreator && (
                            <Badge variant="primary" className="text-xs">
                              Organisateur
                            </Badge>
                          )}
                          {isCurrent && <span className="text-keria-gold text-xs">Vous</span>}
                        </div>
                        {participant.respondedAt && (
                          <p className="text-keria-muted text-xs">
                            Répondu{" "}
                            {new Date(participant.respondedAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <RSVPBadge status={participant.rsvpStatus as RsvpStatus} />
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {participants.length === 0 && (
        <p className="text-keria-muted py-4 text-center text-sm">
          Aucun participant pour le moment
        </p>
      )}
    </div>
  );
}
