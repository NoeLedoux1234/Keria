"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input } from "@meetpoint/ui";
import { useEvent, useEventParticipants } from "@/hooks";
import { RSVPButtons } from "@/components/event";
import type { Id } from "../../../../../../convex/_generated/dataModel";

export default function JoinEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("code");

  const eventId = id as Id<"events">;
  const { event, stages, isLoading } = useEvent(eventId);
  const { join } = useEventParticipants(eventId);

  const [name, setName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"yes" | "no" | "maybe">("yes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Votre nom est requis");
      return;
    }

    setIsSubmitting(true);

    try {
      const participantId = await join({
        eventId,
        name: name.trim(),
        rsvpStatus,
      });

      localStorage.setItem(`meetpoint-event-participant-${eventId}`, participantId);
      router.push(`/event/${eventId}${shareCode ? `?code=${shareCode}` : ""}`);
    } catch (err) {
      setError("Erreur lors de l'inscription");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-keria-darker">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-keria-gold border-t-transparent" />
          <span className="text-sm text-keria-muted">Chargement...</span>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-keria-darker">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 text-center">
          <p className="text-keria-muted">Événement non trouvé</p>
          <Link href="/" className="mt-4 inline-block text-sm text-keria-gold hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

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
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.03]"
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
        <span className="font-mono text-[10px] text-keria-muted/70">ÉVÉNEMENT</span>
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
              className="mb-2 text-[10px] uppercase tracking-widest text-keria-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Rejoindre l'événement
            </motion.p>
            <motion.h1
              className="font-display text-3xl font-bold tracking-tight text-keria-cream"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {event.name}
            </motion.h1>
            <motion.div
              className="mx-auto mt-4 h-px w-16 bg-keria-gold/50"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>

          {/* Event summary */}
          <div className="mb-8 rounded border border-keria-forest/30 bg-keria-darker/50 p-4 backdrop-blur-sm">
            {event.description && (
              <p className="mb-3 text-sm text-keria-muted">{event.description}</p>
            )}
            <div className="space-y-1 text-[10px] uppercase tracking-wider text-keria-muted">
              <p className="text-keria-cream">{formatDate(event.startsAt)}</p>
              <p>
                {formatTime(event.startsAt)}
                {event.endsAt && ` — ${formatTime(event.endsAt)}`}
              </p>
              {stages && stages.length > 0 && (
                <p className="mt-2 text-keria-gold">{stages.length} étapes prévues</p>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-keria-forest/20 bg-keria-darker/40 p-8 backdrop-blur-md">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-keria-muted">
                Votre nom
              </label>
              <Input
                placeholder="Ex: Marie"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-keria-forest/30 bg-keria-darker/50 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-keria-muted">
                Votre réponse
              </label>
              <RSVPButtons
                currentStatus={rsvpStatus}
                onRSVP={(status) => setRsvpStatus(status)}
              />
            </div>

            {error && (
              <div className="rounded border border-keria-error/30 bg-keria-error/10 p-3 text-sm text-keria-error-light">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-xs uppercase tracking-widest"
              isLoading={isSubmitting}
              disabled={!name.trim()}
            >
              Rejoindre l'événement
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-[10px] uppercase tracking-widest text-keria-muted/80 transition-colors hover:text-keria-gold"
            >
              Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative corner */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-20">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-keria-muted/60">2026</span>
          <div className="h-2 w-2 rounded-full bg-keria-gold/30" />
        </div>
      </div>
    </main>
  );
}
