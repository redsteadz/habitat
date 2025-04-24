"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardBackgroundProps {
  status: "done" | "skipped" | null;
  originX?: number;
  originY?: number;
  hobbyId: number;
}

export function CardBackground({
  status,
  originX = 0.5,
  originY = 0.5,
  hobbyId,
}: CardBackgroundProps) {
  if (!status) return null;

  const colors = {
    done: {
      light: ["#d1fae5", "#a7f3d0", "#6ee7b7", "#d1fae5"],
      dark: [
        "rgba(6, 78, 59, 0.4)",
        "rgba(6, 95, 70, 0.3)",
        "rgba(5, 150, 105, 0.2)",
        "rgba(6, 78, 59, 0.4)",
      ],
    },
    skipped: {
      light: ["#f3f4f6", "#e5e7eb", "#d1d5db", "#f3f4f6"],
      dark: [
        "rgba(31, 41, 55, 0.4)",
        "rgba(55, 65, 81, 0.3)",
        "rgba(75, 85, 99, 0.2)",
        "rgba(31, 41, 55, 0.4)",
      ],
    },
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        key={`${hobbyId}-${status}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <motion.div
          className={cn(
            "absolute inset-0 opacity-40 dark:opacity-30",
            status === "done"
              ? "bg-emerald-50 dark:bg-emerald-900/20"
              : "bg-slate-100 dark:bg-slate-800/20",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Animated gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(1)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute rounded-full blur-2xl opacity-30 dark:opacity-20",
                status === "done"
                  ? "bg-emerald-300 dark:bg-emerald-500"
                  : "bg-slate-300 dark:bg-slate-500",
              )}
              initial={{
                x: `${originX * 100}%`,
                y: `${originY * 100}%`,
                scale: 0.1,
                opacity: 0,
              }}
              animate={{
                x: [
                  `${originX * 100}%`,
                  `${originX * 100 + (Math.random() * 40 - 20)}%`,
                  `${originX * 100 + (Math.random() * 60 - 30)}%`,
                ],
                y: [
                  `${originY * 100}%`,
                  `${originY * 100 + (Math.random() * 40 - 20)}%`,
                  `${originY * 100 + (Math.random() * 60 - 30)}%`,
                ],
                scale: [0.1, 1.2, 1.8],
                opacity: [0, 0.5, 0.3],
              }}
              transition={{
                duration: 1.8,
                ease: "easeOut",
                delay: i * 0.3,
              }}
              style={{
                width: `${Math.random() * 40 + 60}%`,
                height: `${Math.random() * 40 + 60}%`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
