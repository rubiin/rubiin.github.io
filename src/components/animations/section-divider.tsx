'use client'

import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Decorative section divider: an animated SVG wave whose fill blends from
 * the page background through a mint gradient. Reveals on scroll and is
 * purely visual (`aria-hidden`).
 */
export function SectionDivider({
  flip = false,
  className,
}: {
  flip?: boolean
  className?: string
}) {
  const gradientId = useId()
  const reduced = useReducedMotion()

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none relative -my-4 h-20 w-full overflow-hidden sm:h-24',
        flip && 'rotate-180',
        className,
      )}
    >
      <motion.svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="h-full w-full"
        initial={reduced ? false : { opacity: 0, scaleY: 0.55 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.14" />
            <stop offset="50%" stopColor="var(--accent-secondary)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.14" />
          </linearGradient>
        </defs>
        <path
          d="M0,64 C240,112 480,18 720,46 C960,74 1200,116 1440,58 L1440,120 L0,120 Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M0,86 C260,118 520,50 760,72 C1000,94 1240,110 1440,84 L1440,120 L0,120 Z"
          fill="var(--background)"
          opacity="0.4"
        />
      </motion.svg>
    </div>
  )
}
