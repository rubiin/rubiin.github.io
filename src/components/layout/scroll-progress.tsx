'use client'

import { motion, useScroll, useSpring } from 'motion/react'

/**
 * Fixed 2px progress bar at the top of the viewport showing scroll
 * progress. Spring-smoothed; purely decorative (`aria-hidden`).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-primary via-primary to-accent"
      style={{ scaleX }}
    />
  )
}
