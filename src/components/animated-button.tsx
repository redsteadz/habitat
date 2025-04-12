"use client"

import type React from "react"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps {
  children: ReactNode
  onClick: (event: React.MouseEvent) => void
  active?: boolean
  variant: "done" | "skip"
  className?: string
}

export function AnimatedButton({
  children,
  onClick,
  active = false,
  variant = "done",
  className,
}: AnimatedButtonProps) {
  const colors = {
    done: {
      base: "bg-emerald-500 hover:text-white",
      active:
        "bg-emerald-200 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700",
      layer1: "bg-white dark:bg-emerald-200",
      layer2: "bg-emerald-300 dark:bg-emerald-400",
      layer3: "bg-emerald-500 dark:bg-emerald-600",
      text: "text-emerald-800 dark:text-emerald-200",
    },
    skip: {
      base: "bg-slate-500 hover:text-white",
      active:
        "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-300 border border-slate-400 dark:border-slate-600",
      layer1: "bg-white dark:bg-slate-300",
      layer2: "bg-slate-300 dark:bg-slate-400",
      layer3: "bg-slate-500 dark:bg-slate-600",
      text: "text-slate-800 dark:text-slate-200",
    },
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={(e) => onClick(e)}
      className={cn(
        "relative flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 overflow-hidden z-10 group",
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
