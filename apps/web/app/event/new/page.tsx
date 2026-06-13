"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input } from "@meetpoint/ui";
import { useCreateEvent } from "@/hooks";
import dynamic from "next/dynamic";
import { StageForm, type StageFormData } from "@/components/event";
import { MapStageMarker, MapStagePath } from "@/components/map";
import { PageBackground } from "@/components/page-background";
import type { MapContainerHandle } from "@/components/map";

const MapContainer = dynamic(
  () => import("@/components/map/map-container").then((m) => ({ default: m.MapContainer })),
  { ssr: false }
);

type Step = 1 | 2 | 3;

interface TemporaryStage extends StageFormData {
  id: string;
  order: number;
  stageType: "departure" | "intermediate" | "arrival";
}

export default function NewEventPage() {
  const router = useRouter();
  const { create } = useCreateEvent();
  const mapRef = useRef<MapContainerHandle>(null);

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [stages, setStages] = useState<TemporaryStage[]>([]);
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStageTypes = (stagesList: TemporaryStage[]): TemporaryStage[] => {
    const sorted = [...stagesList].sort((a, b) => a.scheduledAt - b.scheduledAt);
    return sorted.map((stage, index) => ({
      ...stage,
      order: index,
      stageType:
        index === 0 ? "departure" : index === sorted.length - 1 ? "arrival" : "intermediate",
    }));
  };

  useEffect(() => {
    if (stages.length >= 2 && step === 3) {
      const locations = stages.map((s) => s.location);
      setTimeout(() => {
        mapRef.current?.fitBounds(locations, 60);
      }, 300);
    }
  }, [stages.length, step]);

  const handleAddStage = (data: StageFormData) => {
    const newStage: TemporaryStage = {
      ...data,
      id: `temp-${Date.now()}`,
      order: stages.length,
      stageType: "intermediate",
    };

    const updatedStages = updateStageTypes([...stages, newStage]);
    setStages(updatedStages);
    setIsAddingStage(false);
  };

  const handleRemoveStage = (id: string) => {
    if (stages.length <= 2) return;
    const filtered = stages.filter((s) => s.id !== id);
    const updatedStages = updateStageTypes(filtered);
    setStages(updatedStages);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim() || !creatorName.trim()) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (stages.length < 2) {
      setError("Un événement doit avoir au moins 2 étapes");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await create({
        name: name.trim(),
        description: description.trim() || undefined,
        creatorName: creatorName.trim(),
        stages: stages.map((s) => ({
          name: s.name,
          description: s.description,
          location: s.location,
          address: s.address,
          scheduledAt: s.scheduledAt,
          estimatedDurationMinutes: s.estimatedDurationMinutes,
        })),
      });

      localStorage.setItem(`meetpoint-event-participant-${result.eventId}`, result.participantId);
      router.push(`/event/${result.eventId}?code=${result.shareCode}`);
    } catch {
      setError("Erreur lors de la création de l'événement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = name.trim() && creatorName.trim();
  const canProceedToStep3 = stages.length >= 2;

  return (
    <main className="bg-keria-darker relative min-h-screen overflow-hidden">
      <PageBackground />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-display text-keria-cream/80 hover:text-keria-cream text-lg font-bold transition-colors"
        >
          KERIA
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-keria-muted/70 font-mono text-[10px]">ÉVÉNEMENT</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="bg-keria-forest/30 relative h-1.5 w-6 overflow-hidden rounded-full"
              >
                <motion.div
                  className="bg-keria-gold absolute inset-0 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: s <= step ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-20 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg"
        >
          {/* Step 1: Basic info */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10 text-center">
                  <span className="text-keria-gold mb-2 block text-[10px] font-medium uppercase tracking-widest">
                    Étape 1/3
                  </span>
                  <h1 className="font-display text-keria-cream text-4xl font-bold tracking-tight">
                    Nouvel
                    <br />
                    <span className="text-keria-gold">Événement</span>
                  </h1>
                  <div className="bg-keria-gold/50 mx-auto mt-4 h-px w-16" />
                </div>

                <div className="border-keria-forest/20 bg-keria-darker/40 space-y-5 rounded-xl border p-8 backdrop-blur-md">
                  <div>
                    <label
                      htmlFor="event-name"
                      className="text-keria-muted mb-2 block text-xs font-medium uppercase tracking-wider"
                    >
                      Nom de l'événement
                    </label>
                    <Input
                      id="event-name"
                      placeholder="Ex: Tour à moto du dimanche"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-keria-forest/30 bg-keria-darker/50 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="event-description"
                      className="text-keria-muted mb-2 block text-xs font-medium uppercase tracking-wider"
                    >
                      Description <span className="text-keria-forest">(optionnel)</span>
                    </label>
                    <Input
                      id="event-description"
                      placeholder="Décrivez votre événement..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-keria-forest/30 bg-keria-darker/50 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="event-creator-name"
                      className="text-keria-muted mb-2 block text-xs font-medium uppercase tracking-wider"
                    >
                      Votre nom
                    </label>
                    <Input
                      id="event-creator-name"
                      placeholder="Ex: Jean"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="border-keria-forest/30 bg-keria-darker/50 backdrop-blur-sm"
                    />
                  </div>

                  <Button
                    variant="primary"
                    className="w-full py-4 text-xs uppercase tracking-widest"
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                  >
                    Continuer
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Add stages */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 text-center">
                  <span className="text-keria-gold mb-2 block text-[10px] font-medium uppercase tracking-widest">
                    Étape 2/3
                  </span>
                  <h1 className="font-display text-keria-cream text-3xl font-bold tracking-tight">
                    Les étapes
                  </h1>
                  <p className="text-keria-muted mt-2 text-sm">
                    Ajoutez au moins 2 étapes (départ et arrivée)
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Stages list */}
                  {stages.length > 0 && (
                    <div className="space-y-2">
                      {[...stages]
                        .sort((a, b) => a.scheduledAt - b.scheduledAt)
                        .map((stage, index) => (
                          <motion.div
                            key={stage.id}
                            className="border-keria-forest/30 bg-keria-darker/50 flex items-center gap-3 rounded border p-3 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.08 }}
                          >
                            <div
                              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                                stage.stageType === "departure"
                                  ? "bg-keria-success"
                                  : stage.stageType === "arrival"
                                    ? "bg-keria-error"
                                    : "bg-keria-gold"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-keria-cream truncate font-medium">{stage.name}</p>
                              <p className="text-keria-muted text-[10px] uppercase tracking-wider">
                                {new Date(stage.scheduledAt).toLocaleString("fr-FR", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {stages.length > 2 && (
                              <button
                                onClick={() => handleRemoveStage(stage.id)}
                                className="text-keria-muted hover:bg-keria-error/20 hover:text-keria-error-light rounded p-1.5 transition-colors"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  )}

                  {/* Add stage form */}
                  {isAddingStage ? (
                    <div className="border-keria-gold/30 bg-keria-gold/5 rounded border p-4">
                      <h4 className="text-keria-gold mb-4 text-xs font-medium uppercase tracking-wider">
                        Nouvelle étape
                      </h4>
                      <StageForm
                        onSubmit={handleAddStage}
                        onCancel={() => setIsAddingStage(false)}
                        submitLabel="Ajouter"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingStage(true)}
                      className="border-keria-forest/50 text-keria-muted hover:border-keria-gold/50 hover:text-keria-gold flex w-full items-center justify-center gap-2 rounded border border-dashed bg-transparent p-4 text-sm transition-all"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Ajouter une étape
                    </button>
                  )}

                  {/* Navigation */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 py-3 text-xs uppercase tracking-widest"
                      onClick={() => setStep(1)}
                    >
                      Retour
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1 py-3 text-xs uppercase tracking-widest"
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                    >
                      Aperçu
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 text-center">
                  <span className="text-keria-gold mb-2 block text-[10px] font-medium uppercase tracking-widest">
                    Étape 3/3
                  </span>
                  <h1 className="font-display text-keria-cream text-3xl font-bold tracking-tight">
                    Aperçu
                  </h1>
                </div>

                <div className="space-y-4">
                  {/* Summary */}
                  <div className="border-keria-forest/30 bg-keria-darker/50 rounded border p-4 backdrop-blur-sm">
                    <h3 className="font-display text-keria-cream text-lg font-semibold">{name}</h3>
                    {description && <p className="text-keria-muted mt-1 text-sm">{description}</p>}
                    <p className="text-keria-muted mt-2 text-[10px] uppercase tracking-wider">
                      Organisé par {creatorName} • {stages.length} étapes
                    </p>
                  </div>

                  {/* Map */}
                  <div className="border-keria-forest/30 h-48 overflow-hidden rounded border">
                    <MapContainer
                      ref={mapRef}
                      initialCenter={stages[0]?.location ?? { lat: 48.8566, lng: 2.3522 }}
                      initialZoom={10}
                    >
                      <MapStagePath
                        stages={stages.map((s) => ({
                          order: s.order,
                          location: s.location,
                        }))}
                      />
                      {stages.map((stage) => (
                        <MapStageMarker
                          key={stage.id}
                          coordinates={stage.location}
                          name={stage.name}
                          description={stage.description}
                          stageType={stage.stageType}
                          order={stage.order}
                          scheduledAt={stage.scheduledAt}
                        />
                      ))}
                    </MapContainer>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-1">
                    {[...stages]
                      .sort((a, b) => a.order - b.order)
                      .map((stage) => (
                        <div key={stage.id} className="flex items-center gap-2 text-sm">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              stage.stageType === "departure"
                                ? "bg-keria-success"
                                : stage.stageType === "arrival"
                                  ? "bg-keria-error"
                                  : "bg-keria-gold"
                            }`}
                          />
                          <span className="text-keria-cream font-medium">{stage.name}</span>
                          <span className="text-keria-forest">—</span>
                          <span className="text-keria-muted text-xs">
                            {new Date(stage.scheduledAt).toLocaleString("fr-FR", {
                              weekday: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))}
                  </div>

                  {error && (
                    <div className="border-keria-error/30 bg-keria-error/10 text-keria-error-light rounded border p-3 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 py-3 text-xs uppercase tracking-widest"
                      onClick={() => setStep(2)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1 py-3 text-xs uppercase tracking-widest"
                      onClick={handleSubmit}
                      isLoading={isSubmitting}
                    >
                      Créer
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-keria-muted/80 hover:text-keria-gold text-[10px] uppercase tracking-widest transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative corner */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-20">
        <div className="flex items-center gap-2">
          <span className="text-keria-muted/60 font-mono text-[10px]">2026</span>
          <div className="bg-keria-gold/30 h-2 w-2 rounded-full" />
        </div>
      </div>
    </main>
  );
}
