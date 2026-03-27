export default function NewMeetLoading() {
  return (
    <main className="min-h-screen bg-keria-darker">
      <header className="flex items-center justify-between px-6 py-6">
        <div className="h-6 w-16 animate-pulse rounded bg-keria-forest/20" />
        <div className="h-3 w-16 animate-pulse rounded bg-keria-forest/10" />
      </header>

      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex flex-col items-center gap-4">
            <div className="h-10 w-48 animate-pulse rounded bg-keria-forest/20" />
            <div className="h-px w-16 animate-pulse bg-keria-gold/30" />
          </div>

          <div className="space-y-6 rounded-xl border border-keria-forest/20 bg-keria-darker/40 p-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mb-2 h-3 w-28 animate-pulse rounded bg-keria-forest/10" />
                <div className="h-10 w-full animate-pulse rounded bg-keria-forest/20" />
              </div>
            ))}

            <div>
              <div className="mb-3 h-3 w-32 animate-pulse rounded bg-keria-forest/10" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-16 animate-pulse flex-col items-center justify-center gap-2 rounded border border-keria-forest/20 bg-keria-forest/5"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="h-5 w-5 rounded bg-keria-forest/20" />
                    <div className="h-2 w-10 rounded bg-keria-forest/10" />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-12 w-full animate-pulse rounded bg-keria-forest/20" />
          </div>
        </div>
      </div>
    </main>
  );
}
