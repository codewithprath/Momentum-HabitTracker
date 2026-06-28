import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Momentum",
  description: "Your personal dashboard.",
}

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Good morning.</h1>
        <p className="text-muted-foreground mt-2">{today}</p>
      </header>

      <section>
        <div className="rounded-lg border border-dashed p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary text-xl">✨</span>
          </div>
          <h2 className="text-lg font-medium">Welcome to Momentum</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            This is your empty dashboard. In the next phase, you will be able to create, track, and manage your daily habits here.
          </p>
        </div>
      </section>
    </div>
  )
}
