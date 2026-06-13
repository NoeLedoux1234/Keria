export default function RootLoading() {
  return (
    <main className="bg-keria-darker flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-keria-gold h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
        <span className="text-keria-muted text-sm">Chargement...</span>
      </div>
    </main>
  );
}
