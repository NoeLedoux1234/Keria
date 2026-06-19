"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@meetpoint/ui";
import type { EventStatus } from "@/lib/event-status";

interface LifecycleTransition {
  target: EventStatus;
  label: string;
  variant: "primary" | "outline" | "destructive";
}

interface EventLifecycleControlsProps {
  status: EventStatus;
  onChangeStatus: (status: EventStatus) => Promise<unknown>;
}

const TRANSITIONS_BY_STATUS: Record<EventStatus, LifecycleTransition[]> = {
  draft: [{ target: "published", label: "Publier", variant: "primary" }],
  published: [
    { target: "completed", label: "Clôturer", variant: "outline" },
    { target: "cancelled", label: "Annuler", variant: "destructive" },
  ],
  ongoing: [
    { target: "completed", label: "Clôturer", variant: "outline" },
    { target: "cancelled", label: "Annuler", variant: "destructive" },
  ],
  completed: [],
  cancelled: [{ target: "published", label: "Republier", variant: "primary" }],
};

export function EventLifecycleControls({ status, onChangeStatus }: EventLifecycleControlsProps) {
  const [pendingTarget, setPendingTarget] = useState<EventStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transitions = TRANSITIONS_BY_STATUS[status];

  if (transitions.length === 0) return null;

  const handleTransition = async (target: EventStatus) => {
    setError(null);
    setPendingTarget(target);
    try {
      await onChangeStatus(target);
    } catch {
      setError("Erreur lors du changement de statut");
    } finally {
      setPendingTarget(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {transitions.map((transition) => (
          <motion.div
            key={transition.target}
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={transition.variant}
              size="sm"
              className="w-full text-[10px] uppercase tracking-wider"
              onClick={() => handleTransition(transition.target)}
              isLoading={pendingTarget === transition.target}
            >
              {transition.label}
            </Button>
          </motion.div>
        ))}
      </div>

      {error && (
        <div className="border-keria-error/30 bg-keria-error/10 text-keria-error-light rounded border p-2 text-xs">
          {error}
        </div>
      )}
    </div>
  );
}
