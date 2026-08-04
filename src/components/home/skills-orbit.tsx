'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * Decorative constellation graphic: a center node ringed by orbiting dots
 * with connecting lines. One shared float on the whole SVG (single Motion
 * animation loop) plus a CSS twinkle staggered per dot — no per-element
 * JS animations (rendering-animate-svg-wrapper). Hidden entirely for
 * reduced-motion users. Purely decorative (`aria-hidden`).
 */
export function SkillsOrbit() {
  const reduced = useReducedMotion()

  const dots = useMemo(() => {
    const count = 22
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const radius = 40 + ((i * 37) % 70)
      // Quantize to 3 decimals: Math.cos/sin are implementation-approximated,
      // so Node and browser V8 can differ at the last bit — rounding keeps
      // SSR and client HTML identical (no hydration mismatch).
      const q = (v: number) => Math.round(v * 1000) / 1000
      const cx = q(100 + Math.cos(angle) * radius)
      const cy = q(100 + Math.sin(angle) * radius)
      return { id: i, cx, cy, r: 1.5 + (i % 3) * 0.7, delay: (i % 7) * 0.4 }
    })
  }, [])

  // Always render (SSR can't know the media query — a `return null` here
  // would mismatch the server tree and fail hydration); reduced-motion users
  // get it hidden via CSS instead.
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 200 200"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60 motion-reduce:hidden"
      style={{ transformOrigin: 'center' }}
      animate={reduced ? undefined : { scale: [1, 1.04, 1], rotate: [0, 1.5, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
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
      {/* Orbiting dots — CSS twinkle, staggered via per-dot animation-delay
          (and duration, matching the old 5s + delay rhythm) */}
      {dots.map(({ id, cx, cy, r, delay }) => (
        <circle
          key={`d-${id}`}
          cx={cx}
          cy={cy}
          r={r}
          className="fill-primary orbit-twinkle"
          style={{ animationDelay: `${delay}s`, animationDuration: `${5 + delay}s` }}
        />
      ))}
    </motion.svg>
  )
}
