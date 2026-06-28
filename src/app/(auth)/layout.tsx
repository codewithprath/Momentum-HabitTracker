import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
            </Link>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Momentum</span>
            </div>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:block relative w-full flex-1 bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-background flex items-center justify-center p-12">
          <div className="max-w-md space-y-6 text-center">
            <blockquote className="text-2xl font-medium tracking-tight">
              &quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&quot;
            </blockquote>
            <p className="text-muted-foreground">— Will Durant</p>
          </div>
        </div>
      </div>
    </div>
  )
}
