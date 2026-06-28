import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-16 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">M</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Momentum</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            Build habits that <br className="hidden sm:block" />
            <span className="text-muted-foreground">shape your future.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            A premium, distraction-free space to define your goals, track daily actions, and visualize your compounding progress over time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/signup">
                Start Tracking for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-24 max-w-5xl w-full grid sm:grid-cols-3 gap-8 text-left">
          <div className="space-y-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Frictionless Logging</h3>
            <p className="text-muted-foreground text-sm">Check off your daily habits in seconds with our beautiful, minimalist interface.</p>
          </div>
          <div className="space-y-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Visual Progress</h3>
            <p className="text-muted-foreground text-sm">See your consistency visualized with gorgeous heatmaps and streak counters.</p>
          </div>
          <div className="space-y-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Deep Insights</h3>
            <p className="text-muted-foreground text-sm">Understand your patterns and improve your lifestyle with data-driven reflections.</p>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 px-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Momentum. Crafted for personal growth.</p>
      </footer>
    </div>
  )
}
