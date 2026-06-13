"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input } from "@meetpoint/ui";
import { useEvent, useEventParticipants } from "@/hooks";
import { RSVPButtons } from "@/components/event";
import { PageBackground } from "@/components/page-background";
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
    } catch {
      setError("Erreur lors de l'inscription");
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
      <main className="bg-keria-darker relative flex min-h-screen items-center justify-center">
        <PageBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="border-keria-gold h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-keria-muted text-sm">Chargement...</span>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="bg-keria-darker relative flex min-h-screen items-center justify-center">
        <PageBackground />
        <div className="relative z-10 text-center">
          <p className="text-keria-muted">Événement non trouvé</p>
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
        <span className="text-keria-muted/70 font-mono text-[10px]">ÉVÉNEMENT</span>
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
              Rejoindre l'événement
            </motion.p>
            <motion.h1
              className="font-display text-keria-cream text-3xl font-bold tracking-tight"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {event.name}
            </motion.h1>
            <motion.div
              className="bg-keria-gold/50 mx-auto mt-4 h-px w-16"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>

          {/* Event summary */}
          <div className="border-keria-forest/30 bg-keria-darker/50 mb-8 rounded border p-4 backdrop-blur-sm">
            {event.description && (
              <p className="text-keria-muted mb-3 text-sm">{event.description}</p>
            )}
            <div className="text-keria-muted space-y-1 text-[10px] uppercase tracking-wider">
              <p className="text-keria-cream">{formatDate(event.startsAt)}</p>
              <p>
                {formatTime(event.startsAt)}
                {event.endsAt && ` — ${formatTime(event.endsAt)}`}
              </p>
              {stages && stages.length > 0 && (
                <p className="text-keria-gold mt-2">{stages.length} étapes prévues</p>
              )}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="border-keria-forest/20 bg-keria-darker/40 space-y-6 rounded-xl border p-8 backdrop-blur-md"
          >
            <div>
              <label
                htmlFor="event-participant-name"
                className="text-keria-muted mb-2 block text-xs font-medium uppercase tracking-wider"
              >
                Votre nom
              </label>
              <Input
                id="event-participant-name"
                placeholder="Ex: Marie"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-keria-forest/30 bg-keria-darker/50 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="text-keria-muted mb-3 block text-xs font-medium uppercase tracking-wider">
                Votre réponse
              </label>
              <RSVPButtons currentStatus={rsvpStatus} onRSVP={(status) => setRsvpStatus(status)} />
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
              disabled={!name.trim()}
            >
              Rejoindre l'événement
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
