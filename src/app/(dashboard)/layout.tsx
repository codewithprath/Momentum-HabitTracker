import { ThemeToggle } from "@/components/theme-toggle"
import { logout } from "../(auth)/actions"
import { Button } from "@/components/ui/button"
import { MainNav } from "./components/main-nav"
import Link from "next/link"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">M</span>
              </div>
              <span className="font-bold tracking-tight hidden sm:inline-block">Momentum</span>
            </Link>
            <MainNav />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm">Sign Out</Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
