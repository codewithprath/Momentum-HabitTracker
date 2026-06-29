"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()
  
  const links = [
    { href: "/app", label: "Dashboard" },
    { href: "/app/insights", label: "Insights" },
    { href: "/app/archived", label: "Archived" },
    { href: "/app/settings", label: "Settings" },
  ]
  
  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "transition-all px-4 py-2 rounded-full",
            pathname === link.href 
              ? "bg-secondary text-foreground font-semibold shadow-sm" 
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
