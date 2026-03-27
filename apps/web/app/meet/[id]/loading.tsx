export default function MeetLoading() {
  return (
    <main className="flex h-screen flex-col bg-keria-darker lg:flex-row">
      <aside className="w-full overflow-hidden border-b border-keria-forest/20 bg-keria-darker p-5 lg:w-[380px] lg:border-b-0 lg:border-r">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-16 animate-pulse rounded bg-keria-forest/20" />
          <div className="h-5 w-14 animate-pulse rounded-full bg-keria-forest/20" />
        </div>

        <div className="mb-6">
          <div className="border-l-2 border-keria-forest/30 pl-3">
            <div className="h-7 w-48 animate-pulse rounded bg-keria-forest/20" />
          </div>

          <div className="mt-4 animate-pulse rounded border border-keria-forest/20 bg-keria-forest/5 p-4">
            <div className="h-3 w-20 rounded bg-keria-forest/20" />
            <div className="mt-2 h-8 w-36 rounded bg-keria-forest/20" />
            <div className="mt-2 h-3 w-32 rounded bg-keria-forest/10" />
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 border-l-2 border-keria-forest/30 pl-3">
            <div className="h-3 w-24 animate-pulse rounded bg-keria-forest/20" />
          </div>

          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-3 rounded border border-keria-forest/20 bg-keria-forest/5 p-3"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="h-3 w-3 rounded-full bg-keria-forest/20" />
                <div className="flex-1">
                  <div className="h-4 w-24 rounded bg-keria-forest/20" />
                  <div className="mt-1 h-3 w-16 rounded bg-keria-forest/10" />
                </div>
                <div className="h-4 w-4 rounded bg-keria-forest/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="animate-pulse rounded border border-keria-forest/20 bg-keria-forest/5 p-4">
          <div className="mb-3 border-l-2 border-keria-forest/30 pl-3">
            <div className="h-3 w-28 rounded bg-keria-forest/20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-3 w-12 rounded bg-keria-forest/10" />
              <div className="mt-1 h-8 w-16 rounded bg-keria-forest/20" />
            </div>
            <div>
              <div className="h-3 w-16 rounded bg-keria-forest/10" />
              <div className="mt-1 h-8 w-20 rounded bg-keria-forest/20" />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 items-center justify-center bg-keria-dark/50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-keria-gold border-t-transparent" />
          <span className="text-xs text-keria-muted">Chargement de la carte...</span>
        </div>
      </div>
    </main>
  );
}
