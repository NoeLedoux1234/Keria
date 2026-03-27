"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@meetpoint/ui";
import { PageBackground } from "@/components/page-background";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (error.digest) {
      // eslint-disable-next-line no-console
      console.error("Error digest:", error.digest);
    }
  }, [error.digest]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-keria-darker">
      <PageBackground />

      <header className="relative z-20 flex items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-display text-lg font-bold text-keria-cream/80 transition-colors hover:text-keria-cream"
        >
          KERIA
        </Link>
        <span className="font-mono text-[10px] text-keria-muted/70">ERREUR</span>
      </header>

      <div className="relative z-20 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-sm text-center"
        >
          <motion.div
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-keria-error/30 bg-keria-error/10"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <svg
              className="h-10 w-10 text-keria-error-light"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 9v4m0 4h.01" strokeLinecap="round" />
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </motion.div>

          <motion.h1
            className="font-display text-4xl font-bold tracking-tight text-keria-cream sm:text-5xl"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Une erreur
            <br />
            <span className="text-keria-error-light">est survenue</span>
          </motion.h1>

          <motion.p
            className="mt-3 text-sm text-keria-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {error.message || "Quelque chose s'est mal passé"}
          </motion.p>

          <motion.div
            className="mx-auto mt-6 h-px w-16 bg-keria-error/50"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />

          <motion.div
            className="mt-10 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              variant="primary"
              className="w-full py-4 text-xs uppercase tracking-widest"
              onClick={reset}
            >
              Réessayer
            </Button>

            <Link
              href="/"
              className="block text-[10px] uppercase tracking-widest text-keria-muted/80 transition-colors hover:text-keria-gold"
            >
              Retour à l'accueil
            </Link>
          </motion.div>

          {error.digest && (
            <motion.p
              className="mt-8 font-mono text-[10px] text-keria-forest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              REF: {error.digest}
            </motion.p>
          )}
        </motion.div>
      </div>

      <div className="pointer-events-none fixed bottom-6 right-6 z-20">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-keria-muted/60">2026</span>
          <div className="h-2 w-2 rounded-full bg-keria-error/30" />
        </div>
      </div>
    </main>
  );
}
