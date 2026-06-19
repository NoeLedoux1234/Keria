"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@meetpoint/ui";
import { AddressInput } from "@/components/address-input";
import { useGeolocation } from "@/hooks";
import type { Coordinates, TransportMode } from "@meetpoint/types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface ParticipantLogisticsFormProps {
  participantId: Id<"eventParticipants">;
  eventId: Id<"events">;
  initialLocation?: Coordinates;
  initialAddress?: string;
  initialTransportMode?: TransportMode;
  hasLogistics: boolean;
  isCalculating: boolean;
  onSubmit: (args: {
    participantId: Id<"eventParticipants">;
    location: Coordinates;
    address?: string;
    transportMode: TransportMode;
  }) => Promise<unknown>;
  onCalculate: (args: {
    eventId: Id<"events">;
    eventParticipantId: Id<"eventParticipants">;
  }) => Promise<unknown>;
}

const TransportIcons: Record<TransportMode, ReactNode> = {
  driving: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 11l1.5-4.5a2 2 0 011.9-1.5h7.2a2 2 0 011.9 1.5L19 11" />
      <path d="M5 11v6a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-6" />
      <path d="M5 11h14" />
      <circle cx="7.5" cy="14" r="1" />
      <circle cx="16.5" cy="14" r="1" />
    </svg>
  ),
  transit: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="6" y="3" width="12" height="14" rx="2" />
      <path d="M6 12h12" />
      <circle cx="8.5" cy="15" r="1" />
      <circle cx="15.5" cy="15" r="1" />
      <path d="M8 20l-1 2m9-2l1 2" />
    </svg>
  ),
  cycling: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17l3-7h4l3 7" />
      <path d="M9 10l3-4" />
      <circle cx="12" cy="5" r="1" />
    </svg>
  ),
  walking: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v5l3 4" />
      <path d="M12 11l-3 4" />
      <path d="M9 21l2-6" />
      <path d="M15 21l-2-6" />
    </svg>
  ),
};

const TRANSPORT_OPTIONS: { value: TransportMode; label: string }[] = [
  { value: "driving", label: "Voiture" },
  { value: "transit", label: "Transports" },
  { value: "cycling", label: "Vélo" },
  { value: "walking", label: "À pied" },
];

export function ParticipantLogisticsForm({
  participantId,
  eventId,
  initialLocation,
  initialAddress,
  initialTransportMode,
  hasLogistics,
  isCalculating,
  onSubmit,
  onCalculate,
}: ParticipantLogisticsFormProps) {
  const {
    coordinates: geoCoordinates,
    error: geoError,
    isLoading: geoLoading,
    requestLocation,
  } = useGeolocation();

  const [isEditing, setIsEditing] = useState(!hasLogistics);
  const [location, setLocation] = useState<Coordinates | null>(initialLocation ?? null);
  const [address, setAddress] = useState<string>(initialAddress ?? "");
  const [transportMode, setTransportMode] = useState<TransportMode>(
    initialTransportMode ?? "driving"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveLocation = location ?? geoCoordinates;

  const handleAddressSelect = (coordinates: Coordinates, selectedAddress: string) => {
    setLocation(coordinates);
    setAddress(selectedAddress);
    setError(null);
  };

  const handleUseGeolocation = () => {
    requestLocation();
    setAddress("");
  };

  const handleSubmit = async () => {
    setError(null);
    const submitLocation = location ?? geoCoordinates;
    if (!submitLocation) {
      setError("Indiquez votre point de départ");
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({
        participantId,
        location: submitLocation,
        address: address.trim() || undefined,
        transportMode,
      });
    } catch {
      setError("Impossible d'enregistrer votre logistique");
      setIsSaving(false);
      return;
    }

    setIsEditing(false);
    try {
      await onCalculate({ eventId, eventParticipantId: participantId });
    } catch {
      setError("Impossible de calculer votre itinéraire");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing && hasLogistics) {
    const selectedOption = TRANSPORT_OPTIONS.find(
      (option) => option.value === initialTransportMode
    );

    return (
      <div className="border-keria-forest/30 bg-keria-forest/10 rounded border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-keria-muted text-[10px] uppercase tracking-wider">Point de départ</p>
            <p className="text-keria-cream mt-1 truncate text-sm font-medium">
              {initialAddress ?? "Position enregistrée"}
            </p>
            {selectedOption && (
              <div className="text-keria-gold mt-2 flex items-center gap-2">
                {TransportIcons[selectedOption.value]}
                <span className="text-[10px] uppercase tracking-wider">{selectedOption.label}</span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-[10px] uppercase tracking-wider"
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-keria-gold/30 bg-keria-gold/5 space-y-4 rounded border p-4"
    >
      <div>
        <label className="text-keria-muted mb-2 block text-[10px] font-medium uppercase tracking-wider">
          Votre point de départ
        </label>
        <AddressInput
          onSelect={handleAddressSelect}
          initialValue={address}
          placeholder="Adresse de départ..."
        />
        <button
          type="button"
          onClick={handleUseGeolocation}
          disabled={geoLoading}
          className="border-keria-forest/30 bg-keria-darker/50 text-keria-muted hover:border-keria-gold/50 hover:text-keria-cream mt-2 flex w-full items-center justify-center gap-2 rounded border p-3 text-xs backdrop-blur-sm transition-all disabled:opacity-50"
        >
          {geoLoading ? (
            <>
              <div className="border-keria-gold h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              <span>Localisation...</span>
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
              </svg>
              <span>Ma position</span>
            </>
          )}
        </button>
        {geoError && <p className="text-keria-error-light mt-2 text-xs">{geoError}</p>}
        {effectiveLocation && !geoError && (
          <p className="text-keria-success-light mt-2 flex items-center gap-2 text-[10px]">
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Position prête
          </p>
        )}
      </div>

      <div>
        <label className="text-keria-muted mb-2 block text-[10px] font-medium uppercase tracking-wider">
          Mode de transport
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TRANSPORT_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => setTransportMode(option.value)}
              className={`flex flex-col items-center gap-1.5 rounded border p-3 transition-colors ${
                transportMode === option.value
                  ? "border-keria-gold bg-keria-gold/10 text-keria-gold"
                  : "border-keria-forest/30 bg-keria-darker/30 text-keria-muted hover:border-keria-forest hover:text-keria-cream"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {TransportIcons[option.value]}
              <span className="text-[10px] uppercase tracking-wider">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-keria-error/30 bg-keria-error/10 text-keria-error-light overflow-hidden rounded border p-2 text-xs"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        {hasLogistics && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-[10px] uppercase tracking-wider"
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          className="flex-1 text-[10px] uppercase tracking-wider"
          onClick={handleSubmit}
          isLoading={isSaving || isCalculating}
        >
          Calculer mon itinéraire
        </Button>
      </div>
    </motion.div>
  );
}
