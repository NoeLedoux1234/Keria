"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input } from "@meetpoint/ui";
import { useCreateMeet, useGeolocation } from "@/hooks";
import { AddressInput } from "@/components/address-input";
import type { TransportMode, Coordinates } from "@meetpoint/types";

const TransportIcons: Record<TransportMode, React.ReactNode> = {
  driving: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 11l1.5-4.5a2 2 0 011.9-1.5h7.2a2 2 0 011.9 1.5L19 11" />
      <path d="M5 11v6a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-6" />
      <path d="M5 11h14" />
      <circle cx="7.5" cy="14" r="1" />
      <circle cx="16.5" cy="14" r="1" />
    </svg>
  ),
  transit: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="3" width="12" height="14" rx="2" />
      <path d="M6 12h12" />
      <circle cx="8.5" cy="15" r="1" />
      <circle cx="15.5" cy="15" r="1" />
      <path d="M8 20l-1 2m9-2l1 2" />
    </svg>
  ),
  cycling: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17l3-7h4l3 7" />
      <path d="M9 10l3-4" />
      <circle cx="12" cy="5" r="1" />
    </svg>
  ),
  walking: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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

export default function NewMeetPage() {
  const router = useRouter();
  const { create } = useCreateMeet();
  const { coordinates: geoCoordinates, error: geoError, isLoading: geoLoading, requestLocation } = useGeolocation();

  const [name, setName] = useState("");
  const [creatorName, setCreatorName] = useState("");
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
      setError("Le nom du MeetPoint est requis");
      return;
    }

    if (!creatorName.trim()) {
      setError("Votre nom est requis");
      return;
    }

    if (!coordinates) {
      setError("Veuillez indiquer votre position");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await create({
        name: name.trim(),
        creatorName: creatorName.trim(),
        creatorLocation: coordinates,
        creatorAddress: manualAddress || undefined,
        transportMode,
      });

      router.push(`/meet/${result.meetId}?code=${result.shareCode}`);
    } catch (err) {
      setError("Erreur lors de la création du MeetPoint");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-keria-darker">
      {/* Background image with blur */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(40px) brightness(0.25) saturate(0.7)",
          transform: "scale(1.2)",
        }}
      />

      {/* Heavy grain */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%)",
        }}
      />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6">
        <Link href="/" className="font-display text-lg font-bold text-keria-cream/80 transition-colors hover:text-keria-cream">
          KERIA
        </Link>
        <span className="font-mono text-[10px] text-keria-muted/40">MEETPOINT</span>
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
          <div className="mb-10 text-center">
            <motion.h1
              className="font-display text-4xl font-bold tracking-tight text-keria-cream sm:text-5xl"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Nouveau
              <br />
              <span className="text-keria-gold">MeetPoint</span>
            </motion.h1>
            <motion.div
              className="mx-auto mt-4 h-px w-16 bg-keria-gold/50"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-keria-muted">
                Nom du MeetPoint
              </label>
              <Input
                placeholder="Ex: Dîner d'anniversaire"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-keria-forest/30 bg-keria-darker/50 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-keria-muted">
                Votre nom
              </label>
              <Input
                placeholder="Ex: Marie"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="border-keria-forest/30 bg-keria-darker/50 backdrop-blur-sm"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-keria-muted">
                  Votre position
                </label>
                <button
                  type="button"
                  onClick={() => setUseManualAddress(!useManualAddress)}
                  className="text-[10px] uppercase tracking-wider text-keria-gold/70 transition-colors hover:text-keria-gold"
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
                    <div className="flex items-center gap-2 rounded border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="truncate">{manualAddress}</span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {geoCoordinates ? (
                    <div className="flex items-center gap-2 rounded border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Position obtenue</span>
                      <span className="ml-auto font-mono text-[10px] text-green-400/60">
                        {geoCoordinates.lat.toFixed(4)}°N
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={requestLocation}
                      disabled={geoLoading}
                      className="flex w-full items-center justify-center gap-2 rounded border border-keria-forest/30 bg-keria-darker/50 p-4 text-sm text-keria-muted backdrop-blur-sm transition-all hover:border-keria-gold/50 hover:text-keria-cream"
                    >
                      {geoLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-keria-gold border-t-transparent" />
                          <span>Localisation...</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                          </svg>
                          <span>Obtenir ma position</span>
                        </>
                      )}
                    </button>
                  )}
                  {geoError && <p className="mt-2 text-xs text-red-400">{geoError}</p>}
                </>
              )}
            </div>

            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-keria-muted">
                Mode de transport
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TRANSPORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTransportMode(option.value)}
                    className={`flex flex-col items-center gap-2 rounded border p-3 transition-all ${
                      transportMode === option.value
                        ? "border-keria-gold bg-keria-gold/10 text-keria-gold"
                        : "border-keria-forest/30 bg-keria-darker/30 text-keria-muted hover:border-keria-forest hover:text-keria-cream"
                    }`}
                  >
                    {TransportIcons[option.value]}
                    <span className="text-[10px] uppercase tracking-wider">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
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
              Créer le MeetPoint
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-[10px] uppercase tracking-widest text-keria-muted/50 transition-colors hover:text-keria-gold"
            >
              Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative corner */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-20">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-keria-muted/30">2026</span>
          <div className="h-2 w-2 rounded-full bg-keria-gold/30" />
        </div>
      </div>
    </main>
  );
}
