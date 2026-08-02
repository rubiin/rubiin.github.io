'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * Decorative constellation graphic: a center node ringed by orbiting dots
 * with connecting lines. Static positions, subtle float animation; hidden
 * entirely for reduced-motion users. Purely decorative (`aria-hidden`).
 */
export function SkillsOrbit() {
  const reduced = useReducedMotion()

  const dots = useMemo(() => {
    const count = 22
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const radius = 40 + ((i * 37) % 70)
      const cx = 100 + Math.cos(angle) * radius
      const cy = 100 + Math.sin(angle) * radius
      return { id: i, cx, cy, r: 1.5 + (i % 3) * 0.7, delay: (i % 7) * 0.4 }
    })
  }, [])

  if (reduced) return null

  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
    >
      {/* Connecting lines from center to orbit dots */}
      {dots.map(({ id, cx, cy }) => (
        <line
          key={`l-${id}`}
          x1="100"
          y1="100"
          x2={cx}
          y2={cy}
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="0.4"
        />
      ))}
      {/* Center node */}
      <circle cx="100" cy="100" r="6" className="fill-primary" opacity="0.85" />
      {/* Orbiting dots with a slow float */}
      {dots.map(({ id, cx, cy, r, delay }) => (
        <motion.circle
          key={`d-${id}`}
          cx={cx}
          cy={cy}
          r={r}
          className="fill-primary"
          opacity="0.6"
          animate={{ opacity: [0.35, 0.8, 0.35], scale: [1, 1.25, 1] }}
          transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
        />
      ))}
    </svg>
  )
}
