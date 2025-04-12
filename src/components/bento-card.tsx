"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BentoCardProps {
  children: ReactNode
  className?: string
  gradient?: "green" | "blue" | "purple" | "amber" | "pink" | "slate"
  size?: "sm" | "md" | "lg"
  hoverEffect?: boolean
}

export function BentoCard({
  children,
  className,
  gradient = "slate",
  size = "md",
  hoverEffect = true,
}: BentoCardProps) {
  const gradients = {
    green: "from-emerald-500/20 to-emerald-500/5 dark:from-emerald-500/10 dark:to-emerald-500/5",
    blue: "from-blue-500/20 to-blue-500/5 dark:from-blue-500/10 dark:to-blue-500/5",
    purple: "from-purple-500/20 to-purple-500/5 dark:from-purple-500/10 dark:to-purple-500/5",
    amber: "from-amber-500/20 to-amber-500/5 dark:from-amber-500/10 dark:to-amber-500/5",
    pink: "from-pink-500/20 to-pink-500/5 dark:from-pink-500/10 dark:to-pink-500/5",
    slate: "from-slate-500/20 to-slate-500/5 dark:from-slate-500/10 dark:to-slate-500/5",
  }

  const sizes = {
    sm: "col-span-1 row-span-1",
    md: "col-span-1 row-span-2",
    lg: "col-span-2 row-span-2",
  }

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow overflow-hidden relative",
        sizes[size],
        className,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", gradients[gradient])} />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  )
}

export function BentoCardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6 pb-2 font-semibold", className)}>{children}</div>
}

export function BentoCardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6 pt-2", className)}>{children}</div>
}
