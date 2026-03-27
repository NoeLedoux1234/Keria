export default function JoinLoading() {
  return (
    <main className="min-h-screen bg-keria-darker">
      <header className="flex items-center justify-between px-6 py-6">
        <div className="h-6 w-16 animate-pulse rounded bg-keria-forest/20" />
        <div className="h-3 w-16 animate-pulse rounded bg-keria-forest/10" />
      </header>

      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 flex flex-col items-center gap-3">
            <div className="h-10 w-44 animate-pulse rounded bg-keria-forest/20" />
            <div className="h-4 w-32 animate-pulse rounded bg-keria-forest/10" />
            <div className="h-px w-16 animate-pulse bg-keria-gold/30" />
          </div>

          <div className="mt-10 rounded-xl border border-keria-forest/20 bg-keria-darker/40 p-8">
            <div className="space-y-6">
              <div>
                <div className="mx-auto h-14 w-full animate-pulse rounded bg-keria-forest/20" />
                <div className="mx-auto mt-3 h-3 w-28 animate-pulse rounded bg-keria-forest/10" />
              </div>
              <div className="h-12 w-full animate-pulse rounded bg-keria-forest/20" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
