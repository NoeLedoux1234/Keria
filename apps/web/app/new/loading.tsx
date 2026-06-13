export default function NewMeetLoading() {
  return (
    <main className="bg-keria-darker min-h-screen">
      <header className="flex items-center justify-between px-6 py-6">
        <div className="bg-keria-forest/20 h-6 w-16 animate-pulse rounded" />
        <div className="bg-keria-forest/10 h-3 w-16 animate-pulse rounded" />
      </header>

      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex flex-col items-center gap-4">
            <div className="bg-keria-forest/20 h-10 w-48 animate-pulse rounded" />
            <div className="bg-keria-gold/30 h-px w-16 animate-pulse" />
          </div>

          <div className="border-keria-forest/20 bg-keria-darker/40 space-y-6 rounded-xl border p-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="bg-keria-forest/10 mb-2 h-3 w-28 animate-pulse rounded" />
                <div className="bg-keria-forest/20 h-10 w-full animate-pulse rounded" />
              </div>
            ))}

            <div>
              <div className="bg-keria-forest/10 mb-3 h-3 w-32 animate-pulse rounded" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="border-keria-forest/20 bg-keria-forest/5 flex h-16 animate-pulse flex-col items-center justify-center gap-2 rounded border"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="bg-keria-forest/20 h-5 w-5 rounded" />
                    <div className="bg-keria-forest/10 h-2 w-10 rounded" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-keria-forest/20 h-12 w-full animate-pulse rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
