"use client";

import { useState } from "react";
import { Input, Button } from "@meetpoint/ui";
import { AddressInput } from "../address-input";
import type { Coordinates } from "@meetpoint/types";

export interface StageFormData {
  name: string;
  description?: string;
  location: Coordinates;
  address: string;
  scheduledAt: number;
  estimatedDurationMinutes?: number;
}

interface StageFormProps {
  initialData?: Partial<StageFormData>;
  onSubmit: (data: StageFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export function StageForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Ajouter",
  isLoading = false,
}: StageFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [location, setLocation] = useState<Coordinates | null>(
    initialData?.location ?? null
  );
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [date, setDate] = useState(
    initialData?.scheduledAt
      ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
      : ""
  );
  const [duration, setDuration] = useState(
    initialData?.estimatedDurationMinutes?.toString() ?? ""
  );

  const handleAddressSelect = (coords: Coordinates, addr: string) => {
    setLocation(coords);
    setAddress(addr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !location || !date) return;

    onSubmit({
      name,
      description: description || undefined,
      location,
      address,
      scheduledAt: new Date(date).getTime(),
      estimatedDurationMinutes: duration ? parseInt(duration) : undefined,
    });
  };

  const isValid = name && location && date;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom de l'étape */}
      <div>
        <label className="mb-1 block text-sm font-medium text-keria-cream">
          Nom de l'étape *
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Point de départ, Pause café, Arrivée..."
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-keria-cream">
          Description (optionnel)
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Détails sur cette étape..."
        />
      </div>

      {/* Adresse */}
      <div>
        <label className="mb-1 block text-sm font-medium text-keria-cream">
          Lieu *
        </label>
        <AddressInput
          onSelect={handleAddressSelect}
          placeholder="Rechercher une adresse..."
          initialValue={address}
        />
        {location && (
          <p className="mt-1 text-xs text-keria-success-light">
            Lieu sélectionné
          </p>
        )}
      </div>

      {/* Date et heure */}
      <div>
        <label className="mb-1 block text-sm font-medium text-keria-cream">
          Date et heure *
        </label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-keria-forest bg-keria-darker/50 px-3 py-2 text-sm text-keria-cream focus:border-keria-gold focus:outline-none focus:ring-2 focus:ring-keria-gold/20"
          required
        />
      </div>

      {/* Durée estimée */}
      <div>
        <label className="mb-1 block text-sm font-medium text-keria-cream">
          Durée estimée (minutes, optionnel)
        </label>
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Ex: 30"
          min="0"
        />
      </div>

      {/* Boutons */}
      <div className="flex gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid}
          isLoading={isLoading}
          className="flex-1"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
