export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <header>
        <div className="h-9 w-48 bg-muted rounded"></div>
        <div className="h-5 w-32 bg-muted rounded mt-2"></div>
      </header>

      <section>
        <div className="rounded-lg border border-dashed p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-muted mb-4"></div>
          <div className="h-6 w-48 bg-muted rounded"></div>
          <div className="h-10 w-64 bg-muted rounded mt-4"></div>
        </div>
      </section>
    </div>
  )
}
