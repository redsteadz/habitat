"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FancyButtonProps {
  children: ReactNode
  onClick: () => void
  active?: boolean
  variant?: "primary" | "secondary" | "success" | "danger" | "warning"
  className?: string
}

export function FancyButton({ children, onClick, active = false, variant = "primary", className }: FancyButtonProps) {
  const colors = {
    primary: {
      base: "bg-blue-500 hover:text-white",
      active:
        "bg-blue-200 dark:bg-blue-800/50 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700",
      layer1: "bg-white dark:bg-blue-200",
      layer2: "bg-blue-300 dark:bg-blue-400",
      layer3: "bg-blue-500 dark:bg-blue-600",
      text: "text-blue-800 dark:text-blue-200",
    },
    secondary: {
      base: "bg-purple-500 hover:text-white",
      active:
        "bg-purple-200 dark:bg-purple-800/50 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700",
      layer1: "bg-white dark:bg-purple-200",
      layer2: "bg-purple-300 dark:bg-purple-400",
      layer3: "bg-purple-500 dark:bg-purple-600",
      text: "text-purple-800 dark:text-purple-200",
    },
    success: {
      base: "bg-emerald-500 hover:text-white",
      active:
        "bg-emerald-200 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700",
      layer1: "bg-white dark:bg-emerald-200",
      layer2: "bg-emerald-300 dark:bg-emerald-400",
      layer3: "bg-emerald-500 dark:bg-emerald-600",
      text: "text-emerald-800 dark:text-emerald-200",
    },
    danger: {
      base: "bg-red-500 hover:text-white",
      active: "bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700",
      layer1: "bg-white dark:bg-red-200",
      layer2: "bg-red-300 dark:bg-red-400",
      layer3: "bg-red-500 dark:bg-red-600",
      text: "text-red-800 dark:text-red-200",
    },
    warning: {
      base: "bg-amber-500 hover:text-white",
      active:
        "bg-amber-200 dark:bg-amber-800/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700",
      layer1: "bg-white dark:bg-amber-200",
      layer2: "bg-amber-300 dark:bg-amber-400",
      layer3: "bg-amber-500 dark:bg-amber-600",
      text: "text-amber-800 dark:text-amber-200",
    },
  }

  return (
    <motion.button
      whileTap={{ scale: 0.92, rotate: [-1, 1, -1, 0], transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        "relative py-3 px-4 rounded-lg flex items-center justify-center gap-2 overflow-hidden z-10 group",
        active ? colors[variant].active : "bg-slate-100 dark:bg-slate-800 border border-transparent",
        className,
      )}
    >
      {/* Layered hover effect spans */}
      <span
        className={cn(
          "absolute w-[150%] h-32 -top-8 -left-2 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left",
          colors[variant].layer1,
        )}
      />
      <span
        className={cn(
          "absolute w-[150%] h-32 -top-8 -left-2 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left",
          colors[variant].layer2,
        )}
      />
      <span
        className={cn(
          "absolute w-[150%] h-32 -top-8 -left-2 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left",
          colors[variant].layer3,
        )}
      />

      {/* Button content with hover state */}
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{children}</span>
    </motion.button>
  )
}
