export default function NewEventLoading() {
  return (
    <main className="min-h-screen bg-keria-darker">
      <header className="flex items-center justify-between px-6 py-6">
        <div className="h-6 w-16 animate-pulse rounded bg-keria-forest/20" />
        <div className="flex items-center gap-4">
          <div className="h-3 w-16 animate-pulse rounded bg-keria-forest/10" />
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-1.5 w-6 rounded-full bg-keria-forest/20" />
            ))}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <div className="w-full max-w-lg">
          <div className="mb-10 flex flex-col items-center gap-3">
            <div className="h-3 w-16 animate-pulse rounded bg-keria-gold/20" />
            <div className="h-10 w-40 animate-pulse rounded bg-keria-forest/20" />
            <div className="h-px w-16 animate-pulse bg-keria-gold/30" />
          </div>

          <div className="space-y-5 rounded-xl border border-keria-forest/20 bg-keria-darker/40 p-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mb-2 h-3 w-32 animate-pulse rounded bg-keria-forest/10" />
                <div className="h-10 w-full animate-pulse rounded bg-keria-forest/20" />
              </div>
            ))}

            <div className="h-12 w-full animate-pulse rounded bg-keria-forest/20" />
          </div>
        </div>
      </div>
    </main>
  );
}
