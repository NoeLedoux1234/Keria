export default function JoinEventLoading() {
  return (
    <main className="bg-keria-darker min-h-screen">
      <header className="flex items-center justify-between px-6 py-6">
        <div className="bg-keria-forest/20 h-6 w-16 animate-pulse rounded" />
        <div className="bg-keria-forest/10 h-3 w-20 animate-pulse rounded" />
      </header>

      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 flex flex-col items-center gap-3">
            <div className="bg-keria-forest/20 h-10 w-40 animate-pulse rounded" />
            <div className="bg-keria-forest/10 h-4 w-36 animate-pulse rounded" />
            <div className="bg-keria-gold/30 h-px w-16 animate-pulse" />
          </div>

          <div className="border-keria-forest/20 bg-keria-darker/40 mt-10 rounded-xl border p-8">
            <div className="space-y-6">
              <div>
                <div className="bg-keria-forest/20 mx-auto h-14 w-full animate-pulse rounded" />
                <div className="bg-keria-forest/10 mx-auto mt-3 h-3 w-32 animate-pulse rounded" />
              </div>
              <div className="bg-keria-forest/20 h-12 w-full animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
