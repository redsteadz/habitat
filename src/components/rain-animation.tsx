"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface RainProps {
  isActive: boolean
}

export function RainAnimation({ isActive }: RainProps) {
  const [raindrops, setRaindrops] = useState<
    Array<{ id: number; x: number; y: number; delay: number; duration: number }>
  >([])

  useEffect(() => {
    if (isActive) {
      const newRaindrops = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        delay: Math.random() * 0.5,
        duration: Math.random() * 1 + 1,
      }))
      setRaindrops(newRaindrops)
    } else {
      setRaindrops([])
    }
  }, [isActive])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const dropVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (custom: { delay: number; duration: number }) => ({
      opacity: 0.7,
      y: 120,
      transition: {
        delay: custom.delay,
        repeat: 2,
        repeatType: "loop" as const,
        duration: custom.duration,
      },
    }),
  }

  if (!isActive && raindrops.length === 0) return null

  return (
    <motion.div
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      variants={containerVariants}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {raindrops.map((drop) => (
        <motion.div
          key={drop.id}
          custom={{ delay: drop.delay, duration: drop.duration }}
          variants={dropVariants}
          className="absolute bg-slate-400 dark:bg-slate-600 rounded-full w-1 h-3"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
          }}
        />
      ))}
    </motion.div>
  )
}
