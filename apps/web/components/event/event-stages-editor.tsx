"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StageForm, type StageFormData } from "./stage-form";
import { StagesList } from "./stages-list";
import type { Coordinates } from "@meetpoint/types";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

interface AddStageInput {
  name: string;
  description?: string;
  location: Coordinates;
  address: string;
  scheduledAt: number;
  estimatedDurationMinutes?: number;
}

interface UpdateStageInput extends AddStageInput {
  stageId: Id<"eventStages">;
}

interface EventStagesEditorProps {
  stages: Doc<"eventStages">[];
  onAddStage: (input: AddStageInput) => Promise<unknown>;
  onUpdateStage: (input: UpdateStageInput) => Promise<unknown>;
  onRemoveStage: (stageId: Id<"eventStages">) => Promise<unknown>;
  onStageClick?: (stage: Doc<"eventStages">) => void;
  selectedStageId?: string;
}

type EditorMode =
  | { type: "closed" }
  | { type: "add" }
  | { type: "edit"; stage: Doc<"eventStages"> };

export function EventStagesEditor({
  stages,
  onAddStage,
  onUpdateStage,
  onRemoveStage,
  onStageClick,
  selectedStageId,
}: EventStagesEditorProps) {
  const [mode, setMode] = useState<EditorMode>({ type: "closed" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    setMode({ type: "closed" });
    setError(null);
  };

  const handleSubmit = async (data: StageFormData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode.type === "add") {
        await onAddStage(data);
      } else if (mode.type === "edit") {
        await onUpdateStage({ stageId: mode.stage._id, ...data });
      }
      closeModal();
    } catch {
      setError("Erreur lors de l'enregistrement de l'étape");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (stageId: string) => {
    if (stages.length <= 2) return;
    setError(null);
    try {
      await onRemoveStage(stageId as Id<"eventStages">);
    } catch {
      setError("Impossible de supprimer cette étape");
    }
  };

  const editInitialData =
    mode.type === "edit"
      ? {
          name: mode.stage.name,
          description: mode.stage.description,
          location: mode.stage.location,
          address: mode.stage.address,
          scheduledAt: mode.stage.scheduledAt,
          estimatedDurationMinutes: mode.stage.estimatedDurationMinutes,
        }
      : undefined;

  return (
    <div className="space-y-3">
      {stages.length > 0 ? (
        <StagesList
          stages={stages}
          onStageClick={(stage) => {
            onStageClick?.(stage);
            setMode({ type: "edit", stage });
          }}
          selectedStageId={selectedStageId}
          showActions
          onRemoveStage={handleRemove}
        />
      ) : (
        <p className="text-keria-muted text-sm">Aucune étape</p>
      )}

      {error && (
        <div className="border-keria-error/30 bg-keria-error/10 text-keria-error-light rounded border p-2 text-xs">
          {error}
        </div>
      )}

      <motion.button
        onClick={() => setMode({ type: "add" })}
        className="border-keria-forest/50 text-keria-muted hover:border-keria-gold/50 hover:text-keria-gold flex w-full items-center justify-center gap-2 rounded border border-dashed bg-transparent p-3 text-xs uppercase tracking-wider transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Ajouter une étape
      </motion.button>

      <AnimatePresence>
        {mode.type !== "closed" && (
          <motion.div
            className="bg-keria-darker/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
          >
            <motion.div
              className="border-keria-forest/30 bg-keria-darker w-full max-w-lg overflow-y-auto rounded-xl border p-6 shadow-2xl"
              style={{ maxHeight: "90vh" }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-keria-cream text-lg font-bold">
                  {mode.type === "add" ? "Nouvelle étape" : "Modifier l'étape"}
                </h3>
                <button
                  onClick={closeModal}
                  aria-label="Fermer"
                  className="text-keria-muted hover:bg-keria-forest/30 hover:text-keria-cream rounded p-1.5 transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <StageForm
                initialData={editInitialData}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                submitLabel={mode.type === "add" ? "Ajouter" : "Enregistrer"}
                isLoading={isSubmitting}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
