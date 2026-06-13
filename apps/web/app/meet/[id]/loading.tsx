export default function MeetLoading() {
  return (
    <main className="bg-keria-darker flex h-screen flex-col lg:flex-row">
      <aside className="border-keria-forest/20 bg-keria-darker w-full overflow-hidden border-b p-5 lg:w-[380px] lg:border-b-0 lg:border-r">
        <div className="mb-6 flex items-center justify-between">
          <div className="bg-keria-forest/20 h-6 w-16 animate-pulse rounded" />
          <div className="bg-keria-forest/20 h-5 w-14 animate-pulse rounded-full" />
        </div>

        <div className="mb-6">
          <div className="border-keria-forest/30 border-l-2 pl-3">
            <div className="bg-keria-forest/20 h-7 w-48 animate-pulse rounded" />
          </div>

          <div className="border-keria-forest/20 bg-keria-forest/5 mt-4 animate-pulse rounded border p-4">
            <div className="bg-keria-forest/20 h-3 w-20 rounded" />
            <div className="bg-keria-forest/20 mt-2 h-8 w-36 rounded" />
            <div className="bg-keria-forest/10 mt-2 h-3 w-32 rounded" />
          </div>
        </div>

        <div className="mb-6">
          <div className="border-keria-forest/30 mb-3 flex items-center gap-2 border-l-2 pl-3">
            <div className="bg-keria-forest/20 h-3 w-24 animate-pulse rounded" />
          </div>

          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border-keria-forest/20 bg-keria-forest/5 flex animate-pulse items-center gap-3 rounded border p-3"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="bg-keria-forest/20 h-3 w-3 rounded-full" />
                <div className="flex-1">
                  <div className="bg-keria-forest/20 h-4 w-24 rounded" />
                  <div className="bg-keria-forest/10 mt-1 h-3 w-16 rounded" />
                </div>
                <div className="bg-keria-forest/10 h-4 w-4 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-keria-forest/20 bg-keria-forest/5 animate-pulse rounded border p-4">
          <div className="border-keria-forest/30 mb-3 border-l-2 pl-3">
            <div className="bg-keria-forest/20 h-3 w-28 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="bg-keria-forest/10 h-3 w-12 rounded" />
              <div className="bg-keria-forest/20 mt-1 h-8 w-16 rounded" />
            </div>
            <div>
              <div className="bg-keria-forest/10 h-3 w-16 rounded" />
              <div className="bg-keria-forest/20 mt-1 h-8 w-20 rounded" />
            </div>
          </div>
        </div>
      </aside>

      <div className="bg-keria-dark/50 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="border-keria-gold h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-keria-muted text-xs">Chargement de la carte...</span>
        </div>
      </div>
    </main>
  );
}
