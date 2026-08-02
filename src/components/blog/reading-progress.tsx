'use client'

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'

/**
 * Thin reading-progress bar pinned to the top of the viewport, scaled to the
 * scroll progress of the article container. Disabled under reduced motion.
 */
export function ReadingProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  if (reduced) return null

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-50 h-0.5 w-full origin-left bg-gradient-to-r from-primary via-accent to-chart-1"
      style={{ scaleX }}
    />
  )
}
