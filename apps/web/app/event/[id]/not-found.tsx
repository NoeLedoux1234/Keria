import Link from "next/link";
import { PageBackground } from "@/components/page-background";

export default function EventNotFound() {
  return (
    <main className="bg-keria-darker relative min-h-screen overflow-hidden">
      <PageBackground />

      <header className="relative z-20 flex items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-display text-keria-cream/80 hover:text-keria-cream text-lg font-bold transition-colors"
        >
          KERIA
        </Link>
        <span className="text-keria-muted/70 font-mono text-[10px]">ÉVÉNEMENT</span>
      </header>

      <div className="relative z-20 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm text-center">
          <div className="border-keria-forest/30 bg-keria-forest/10 mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border">
            <svg
              className="text-keria-muted h-10 w-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
              <path d="M10 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="font-display text-keria-cream text-4xl font-bold tracking-tight sm:text-5xl">
            Événement
            <br />
            <span className="text-keria-gold">non trouvé</span>
          </h1>

          <p className="text-keria-muted mt-3 text-sm">
            Cet événement n'existe pas ou a été supprimé.
          </p>

          <div className="animate-line-expand bg-keria-gold/50 mx-auto mt-6 h-px w-16" />

          <div className="mt-10 space-y-3">
            <Link
              href="/join-event"
              className="border-keria-gold/30 bg-keria-gold/10 text-keria-gold hover:border-keria-gold/50 hover:bg-keria-gold/20 block rounded border px-6 py-3 text-xs font-medium uppercase tracking-widest transition-colors"
            >
              Rejoindre avec un code
            </Link>

            <Link
              href="/"
              className="text-keria-muted/80 hover:text-keria-gold block text-[10px] uppercase tracking-widest transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-6 right-6 z-20">
        <div className="flex items-center gap-2">
          <span className="text-keria-muted/60 font-mono text-[10px]">2026</span>
          <div className="bg-keria-gold/30 h-2 w-2 rounded-full" />
        </div>
      </div>
    </main>
  );
}
