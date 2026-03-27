"use client";

import { Badge } from "@meetpoint/ui";
import type { Doc } from "../../../../convex/_generated/dataModel";

type StageType = "departure" | "intermediate" | "arrival";

interface StagesListProps {
  stages: Doc<"eventStages">[];
  onStageClick?: (stage: Doc<"eventStages">) => void;
  selectedStageId?: string;
  showActions?: boolean;
  onRemoveStage?: (stageId: string) => void;
}

const STAGE_COLORS: Record<StageType, string> = {
  departure: "bg-keria-success",
  intermediate: "bg-keria-gold",
  arrival: "bg-keria-error",
};

const STAGE_LABELS: Record<StageType, string> = {
  departure: "Départ",
  intermediate: "Étape",
  arrival: "Arrivée",
};

export function StagesList({
  stages,
  onStageClick,
  selectedStageId,
  showActions = false,
  onRemoveStage,
}: StagesListProps) {
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative">
      {sortedStages.map((stage, index) => {
        const isLast = index === sortedStages.length - 1;
        const isSelected = stage._id === selectedStageId;

        return (
          <div
            key={stage._id}
            className={`relative flex gap-3 ${!isLast ? "pb-6" : ""}`}
          >
            {/* Ligne verticale de connexion */}
            {!isLast && (
              <div className="absolute left-4 top-8 h-full w-0.5 bg-keria-forest/50" />
            )}

            {/* Cercle numéroté */}
            <div
              className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${STAGE_COLORS[stage.stageType as StageType]}`}
            >
              {stage.order + 1}
            </div>

            {/* Contenu de l'étape */}
            <div
              className={`flex-1 cursor-pointer rounded-lg border p-3 transition-all ${
                isSelected
                  ? "border-keria-gold bg-keria-gold/10 ring-1 ring-keria-gold"
                  : "border-keria-forest/50 bg-keria-forest/20 hover:border-keria-muted hover:bg-keria-forest/30"
              }`}
              onClick={() => onStageClick?.(stage)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-keria-cream">{stage.name}</h4>
                    <Badge
                      variant={
                        stage.stageType === "departure"
                          ? "success"
                          : stage.stageType === "arrival"
                            ? "danger"
                            : "primary"
                      }
                      className="text-xs"
                    >
                      {STAGE_LABELS[stage.stageType as StageType]}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-keria-muted">
                    {formatDateTime(stage.scheduledAt)}
                  </p>
                  <p className="mt-1 text-sm text-keria-muted line-clamp-1">
                    {stage.address}
                  </p>
                  {stage.description && (
                    <p className="mt-1 text-sm text-keria-muted line-clamp-2">
                      {stage.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {showActions && onRemoveStage && sortedStages.length > 2 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveStage(stage._id);
                    }}
                    className="rounded p-1 text-keria-muted transition-colors hover:bg-keria-error/20 hover:text-keria-error-light"
                    title="Supprimer cette étape"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Durée estimée */}
              {stage.estimatedDurationMinutes && (
                <div className="mt-2 flex items-center gap-1 text-xs text-keria-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{stage.estimatedDurationMinutes} min sur place</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
