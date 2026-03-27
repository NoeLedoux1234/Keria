"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input } from "@meetpoint/ui";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageBackground } from "@/components/page-background";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const meet = useQuery(
    api.meets.getByShareCode,
    code.length === 6 ? { shareCode: code.toUpperCase() } : "skip"
  );

  useEffect(() => {
    if (meet) {
      router.push(`/meet/${meet._id}/join`);
    }
  }, [meet, router]);

  useEffect(() => {
    if (code.length === 6 && meet === null) {
      setError("Aucun MeetPoint trouvé avec ce code");
    } else {
      setError(null);
    }
  }, [code.length, meet]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    setCode(value);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-keria-darker">
      <PageBackground />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6">
        <Link href="/" className="font-display text-lg font-bold text-keria-cream/80 transition-colors hover:text-keria-cream">
          KERIA
        </Link>
        <span className="font-mono text-[10px] text-keria-muted/70">MEETPOINT</span>
      </header>

      {/* Content */}
      <div className="relative z-20 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-sm text-center"
        >
          {/* Title */}
          <motion.h1
            className="font-display text-4xl font-bold tracking-tight text-keria-cream sm:text-5xl"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Rejoindre un
            <br />
            <span className="text-keria-gold">MeetPoint</span>
          </motion.h1>
          <motion.p
            className="mt-3 text-sm text-keria-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Entrez le code de partage
          </motion.p>
          <motion.div
            className="mx-auto mt-6 h-px w-16 bg-keria-gold/50"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          {/* Code input */}
          <div className="mt-10 rounded-xl border border-keria-forest/20 bg-keria-darker/40 p-8 backdrop-blur-md">
            <div className="space-y-6">
              <div>
                <Input
                  placeholder="ABC123"
                  value={code}
                  onChange={handleCodeChange}
                  maxLength={6}
                  className="border-keria-forest/30 bg-keria-darker/50 text-center font-mono text-3xl tracking-[0.3em] backdrop-blur-sm"
                />
                <p className="mt-3 text-[10px] uppercase tracking-wider text-keria-muted/80">
                  Code à 6 caractères
                </p>
              </div>

              {meet === undefined && code.length === 6 && (
                <div className="flex items-center justify-center gap-2 text-sm text-keria-muted">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-keria-gold border-t-transparent" />
                  <span>Recherche...</span>
                </div>
              )}

              {error && (
                <div className="rounded border border-keria-error/30 bg-keria-error/10 p-3 text-sm text-keria-error-light">
                  {error}
                </div>
              )}

              <Button
                variant="outline"
                className="w-full py-4 text-xs uppercase tracking-widest"
                onClick={() => router.push("/")}
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-20">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-keria-muted/60">2026</span>
          <div className="h-2 w-2 rounded-full bg-keria-gold/30" />
        </div>
      </div>
    </main>
  );
}
