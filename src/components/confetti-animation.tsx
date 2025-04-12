"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ConfettiProps {
  isActive: boolean
  originX?: number
  originY?: number
}

export function ConfettiAnimation({ isActive, originX = 0.5, originY = 0.5 }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>(
    [],
  )

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: ["#10B981", "#3B82F6", "#EC4899", "#F59E0B", "#8B5CF6"][Math.floor(Math.random() * 5)],
      }))
      setParticles(newParticles)
    } else {
      setParticles([])
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  if (!isActive && particles.length === 0) return null

  return (
    <motion.div
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      variants={containerVariants}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ originX, originY }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          variants={itemVariants}
          className="absolute rounded-full"
          style={{
            top: `${particle.y}%`,
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
          }}
        />
      ))}
    </motion.div>
  )
}
