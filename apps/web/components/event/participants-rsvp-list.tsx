"use client";

import { Badge } from "@meetpoint/ui";
import { RSVPBadge } from "./rsvp-buttons";
import type { Doc } from "../../../../convex/_generated/dataModel";

type RSVPStatus = "yes" | "no" | "maybe" | "pending";

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

const SECTION_CONFIG: Record<RSVPStatus, { label: string; order: number }> = {
  yes: { label: "Participants", order: 1 },
  maybe: { label: "Peut-être", order: 2 },
  pending: { label: "En attente", order: 3 },
  no: { label: "Ne participent pas", order: 4 },
};

const SectionIndicators: Record<RSVPStatus, React.ReactNode> = {
  yes: <span className="h-2 w-2 rounded-full bg-green-500" />,
  maybe: <span className="h-2 w-2 rounded-full bg-keria-gold" />,
  pending: <span className="h-2 w-2 rounded-full bg-keria-muted" />,
  no: <span className="h-2 w-2 rounded-full bg-red-500" />,
};

export function ParticipantsRSVPList({
  participants,
  currentParticipantId,
  rsvpCounts,
}: ParticipantsRSVPListProps) {
  // Grouper les participants par statut RSVP
  const groupedParticipants = participants.reduce(
    (acc, participant) => {
      const status = participant.rsvpStatus as RSVPStatus;
      if (!acc[status]) acc[status] = [];
      acc[status].push(participant);
      return acc;
    },
    {} as Record<RSVPStatus, Doc<"eventParticipants">[]>
  );

  // Trier les sections par ordre
  const sortedStatuses = (Object.keys(SECTION_CONFIG) as RSVPStatus[]).sort(
    (a, b) => SECTION_CONFIG[a].order - SECTION_CONFIG[b].order
  );

  // Générer une couleur basée sur le nom
  const getInitialColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-teal-500",
      "bg-indigo-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-4">
      {/* Résumé des RSVP */}
      {rsvpCounts && (
        <div className="flex flex-wrap gap-2 rounded-lg bg-keria-forest/30 p-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-keria-cream">{rsvpCounts.yes} oui</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-keria-gold" />
            <span className="text-sm text-keria-cream">{rsvpCounts.maybe} peut-être</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-sm text-keria-cream">{rsvpCounts.no} non</span>
          </div>
          {rsvpCounts.pending > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-keria-muted" />
              <span className="text-sm text-keria-cream">{rsvpCounts.pending} en attente</span>
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
            <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-keria-muted">
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
                        ? "bg-keria-gold/10 ring-1 ring-keria-gold/50"
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
                          <span className="font-medium text-keria-cream">{participant.name}</span>
                          {participant.isCreator && (
                            <Badge variant="primary" className="text-xs">
                              Organisateur
                            </Badge>
                          )}
                          {isCurrent && (
                            <span className="text-xs text-keria-gold">Vous</span>
                          )}
                        </div>
                        {participant.respondedAt && (
                          <p className="text-xs text-keria-muted">
                            Répondu{" "}
                            {new Date(participant.respondedAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <RSVPBadge status={participant.rsvpStatus as RSVPStatus} />
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {participants.length === 0 && (
        <p className="py-4 text-center text-sm text-keria-muted">
          Aucun participant pour le moment
        </p>
      )}
    </div>
  );
}
