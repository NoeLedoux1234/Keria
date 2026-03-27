import Link from "next/link";
import { PageBackground } from "@/components/page-background";

export default function MeetNotFound() {
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
        <span className="font-mono text-[10px] text-keria-muted/70">MEETPOINT</span>
      </header>

      <div className="relative z-20 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-keria-forest/30 bg-keria-forest/10">
            <svg
              className="h-10 w-10 text-keria-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
              <path d="M8 10h.01M16 10h.01" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-keria-cream sm:text-5xl">
            MeetPoint
            <br />
            <span className="text-keria-gold">non trouvé</span>
          </h1>

          <p className="mt-3 text-sm text-keria-muted">
            Ce MeetPoint n'existe pas ou a expiré.
          </p>

          <div className="mx-auto mt-6 h-px w-16 animate-line-expand bg-keria-gold/50" />

          <div className="mt-10 space-y-3">
            <Link
              href="/join"
              className="block rounded border border-keria-gold/30 bg-keria-gold/10 px-6 py-3 text-xs font-medium uppercase tracking-widest text-keria-gold transition-colors hover:border-keria-gold/50 hover:bg-keria-gold/20"
            >
              Rejoindre avec un code
            </Link>

            <Link
              href="/"
              className="block text-[10px] uppercase tracking-widest text-keria-muted/80 transition-colors hover:text-keria-gold"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-6 right-6 z-20">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-keria-muted/60">2026</span>
          <div className="h-2 w-2 rounded-full bg-keria-gold/30" />
        </div>
      </div>
    </main>
  );
}
