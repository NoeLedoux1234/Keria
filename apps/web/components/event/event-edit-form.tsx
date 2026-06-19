"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input } from "@meetpoint/ui";

interface EventEditFormProps {
  name: string;
  description?: string;
  onSave: (values: { name: string; description?: string }) => Promise<unknown>;
}

export function EventEditForm({ name, description, onSave }: EventEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftDescription, setDraftDescription] = useState(description ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setDraftName(name);
    setDraftDescription(description ?? "");
    setError(null);
    setIsOpen(true);
  };

  const handleSave = async () => {
    setError(null);
    if (!draftName.trim()) {
      setError("Le nom est obligatoire");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name: draftName.trim(),
        description: draftDescription.trim() || undefined,
      });
      setIsOpen(false);
    } catch {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-4">
      {isOpen ? null : (
        <motion.button
          onClick={handleOpen}
          className="border-keria-forest/50 text-keria-muted hover:border-keria-gold/50 hover:text-keria-gold flex w-full items-center justify-center gap-2 rounded border border-dashed bg-transparent py-2 text-[10px] font-medium uppercase tracking-wider transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" />
          </svg>
          Modifier l'événement
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-keria-gold/30 bg-keria-gold/5 space-y-4 rounded border p-4">
              <div>
                <label
                  htmlFor="event-edit-name"
                  className="text-keria-muted mb-1 block text-[10px] font-medium uppercase tracking-wider"
                >
                  Nom de l'événement
                </label>
                <Input
                  id="event-edit-name"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="border-keria-forest/30 bg-keria-darker/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="event-edit-description"
                  className="text-keria-muted mb-1 block text-[10px] font-medium uppercase tracking-wider"
                >
                  Description
                </label>
                <Input
                  id="event-edit-description"
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  placeholder="Décrivez votre événement..."
                  className="border-keria-forest/30 bg-keria-darker/50 backdrop-blur-sm"
                />
              </div>

              {error && (
                <div className="border-keria-error/30 bg-keria-error/10 text-keria-error-light rounded border p-2 text-xs">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-[10px] uppercase tracking-wider"
                  onClick={() => setIsOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-[10px] uppercase tracking-wider"
                  onClick={handleSave}
                  isLoading={isSaving}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
