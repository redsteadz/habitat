"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { BarChart3, Home } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">HobbyStreak</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80 relative flex items-center gap-1",
                pathname === "/" ? "text-foreground" : "text-foreground/60",
              )}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
              {pathname === "/" && (
                <motion.div
                  className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-foreground"
                  layoutId="navbar-indicator"
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                />
              )}
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "transition-colors hover:text-foreground/80 relative flex items-center gap-1",
                pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
              {pathname === "/dashboard" && (
                <motion.div
                  className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-foreground"
                  layoutId="navbar-indicator"
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                />
              )}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
