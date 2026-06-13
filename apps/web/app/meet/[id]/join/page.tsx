"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input } from "@meetpoint/ui";
import { useMeet, useParticipants, useGeolocation } from "@/hooks";
import { AddressInput } from "@/components/address-input";
import { PageBackground } from "@/components/page-background";
import type { TransportMode, Coordinates } from "@meetpoint/types";
import type { Id } from "../../../../../../convex/_generated/dataModel";

const TransportIcons: Record<TransportMode, React.ReactNode> = {
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

export default function JoinMeetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const meetId = id as Id<"meets">;

  const { meet, isLoading: meetLoading } = useMeet(meetId);
  const { join } = useParticipants();
  const {
    coordinates: geoCoordinates,
    error: geoError,
    isLoading: geoLoading,
    requestLocation,
  } = useGeolocation();

  const [name, setName] = useState("");
  const [transportMode, setTransportMode] = useState<TransportMode>("driving");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [manualCoordinates, setManualCoordinates] = useState<Coordinates | null>(null);
  const [manualAddress, setManualAddress] = useState<string>("");
  const [useManualAddress, setUseManualAddress] = useState(false);

  const coordinates = useManualAddress ? manualCoordinates : geoCoordinates;

  const handleAddressSelect = (coords: Coordinates, address: string) => {
    setManualCoordinates(coords);
    setManualAddress(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Votre nom est requis");
      return;
    }

    if (!coordinates) {
      setError("Veuillez indiquer votre position");
      return;
    }

    setIsSubmitting(true);

    try {
      await join({
        meetId,
        name: name.trim(),
        location: coordinates,
        address: manualAddress || undefined,
        transportMode,
      });

      router.push(`/meet/${meetId}`);
    } catch {
      setError("Erreur lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (meetLoading) {
    return (
      <main className="bg-keria-darker relative flex min-h-screen items-center justify-center">
        <PageBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="border-keria-gold h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-keria-muted text-sm">Chargement...</span>
        </div>
      </main>
    );
  }

  if (!meet) {
    return (
      <main className="bg-keria-darker relative flex min-h-screen items-center justify-center">
        <PageBackground />
        <div className="relative z-10 text-center">
          <p className="text-keria-muted">MeetPoint non trouvé</p>
          <Link href="/" className="text-keria-gold mt-4 inline-block text-sm hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

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
        <span className="text-keria-muted/70 font-mono text-[10px]">REJOINDRE</span>
      </header>

      {/* Content */}
      <div className="relative z-20 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Title */}
          <div className="mb-8 text-center">
            <motion.p
              className="text-keria-muted mb-2 text-[10px] uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Rejoindre
            </motion.p>
            <motion.h1
              className="font-display text-keria-cream text-3xl font-bold tracking-tight"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {meet.name}
            </motion.h1>
            <motion.div
              className="bg-keria-gold/50 mx-auto mt-4 h-px w-16"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="border-keria-forest/20 bg-keria-darker/40 space-y-6 rounded-xl border p-8 backdrop-blur-md"
          >
            <div>
              <label
                htmlFor="participant-name"
                className="text-keria-muted mb-2 block text-xs font-medium uppercase tracking-wider"
              >
                Votre nom
              </label>
              <Input
                id="participant-name"
                placeholder="Ex: Pierre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-keria-forest/30 bg-keria-darker/50 backdrop-blur-sm"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-keria-muted text-xs font-medium uppercase tracking-wider">
                  Votre position
                </label>
                <button
                  type="button"
                  onClick={() => setUseManualAddress(!useManualAddress)}
                  className="text-keria-gold hover:text-keria-gold text-[10px] uppercase tracking-wider transition-colors"
                >
                  {useManualAddress ? "Utiliser GPS" : "Entrer adresse"}
                </button>
              </div>

              {useManualAddress ? (
                <div className="space-y-3">
                  <AddressInput
                    onSelect={handleAddressSelect}
                    placeholder="Rechercher une adresse..."
                  />
                  {manualCoordinates && (
                    <div className="border-keria-success/30 bg-keria-success/10 text-keria-success-light flex items-center gap-2 rounded border p-3 text-sm">
                      <div className="bg-keria-success h-2 w-2 rounded-full" />
                      <span className="truncate">{manualAddress}</span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {geoCoordinates ? (
                    <div className="border-keria-success/30 bg-keria-success/10 text-keria-success-light flex items-center gap-2 rounded border p-3 text-sm">
                      <div className="bg-keria-success h-2 w-2 rounded-full" />
                      <span>Position obtenue</span>
                      <span className="text-keria-success-light/60 ml-auto font-mono text-[10px]">
                        {geoCoordinates.lat.toFixed(4)}°N
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={requestLocation}
                      disabled={geoLoading}
                      className="border-keria-forest/30 bg-keria-darker/50 text-keria-muted hover:border-keria-gold/50 hover:text-keria-cream animate-pulse-soft flex w-full items-center justify-center gap-2 rounded border p-4 text-sm backdrop-blur-sm transition-all"
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
                          <span>Obtenir ma position</span>
                        </>
                      )}
                    </button>
                  )}
                  {geoError && <p className="text-keria-error-light mt-2 text-xs">{geoError}</p>}
                </>
              )}
            </div>

            <div>
              <label className="text-keria-muted mb-3 block text-xs font-medium uppercase tracking-wider">
                Mode de transport
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TRANSPORT_OPTIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setTransportMode(option.value)}
                    className={`flex flex-col items-center gap-2 rounded border p-3 transition-colors ${
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

            {error && (
              <div className="border-keria-error/30 bg-keria-error/10 text-keria-error-light rounded border p-3 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-xs uppercase tracking-widest"
              isLoading={isSubmitting}
              disabled={!coordinates}
            >
              Rejoindre le MeetPoint
            </Button>
          </form>

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
