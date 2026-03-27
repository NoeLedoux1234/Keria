export default function RootLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-keria-darker">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-keria-gold border-t-transparent" />
        <span className="text-sm text-keria-muted">Chargement...</span>
      </div>
    </main>
  );
}
