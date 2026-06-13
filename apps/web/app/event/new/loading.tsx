export default function NewEventLoading() {
  return (
    <main className="bg-keria-darker min-h-screen">
      <header className="flex items-center justify-between px-6 py-6">
        <div className="bg-keria-forest/20 h-6 w-16 animate-pulse rounded" />
        <div className="flex items-center gap-4">
          <div className="bg-keria-forest/10 h-3 w-16 animate-pulse rounded" />
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-keria-forest/20 h-1.5 w-6 rounded-full" />
            ))}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <div className="w-full max-w-lg">
          <div className="mb-10 flex flex-col items-center gap-3">
            <div className="bg-keria-gold/20 h-3 w-16 animate-pulse rounded" />
            <div className="bg-keria-forest/20 h-10 w-40 animate-pulse rounded" />
            <div className="bg-keria-gold/30 h-px w-16 animate-pulse" />
          </div>

          <div className="border-keria-forest/20 bg-keria-darker/40 space-y-5 rounded-xl border p-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="bg-keria-forest/10 mb-2 h-3 w-32 animate-pulse rounded" />
                <div className="bg-keria-forest/20 h-10 w-full animate-pulse rounded" />
              </div>
            ))}

            <div className="bg-keria-forest/20 h-12 w-full animate-pulse rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
