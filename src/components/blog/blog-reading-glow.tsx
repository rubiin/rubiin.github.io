'use client'

import type { RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

/**
 * Scroll-driven reading progress: as the article is read, soft mint glows
 * bloom in the gutters and a vertical spine on the right edge fills with a
 * glowing gradient. Purely decorative (`aria-hidden`) — hidden on smaller
 * screens and rendered statically under reduced motion.
 */
export function BlogReadingGlow({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 0.9', 'end 0.25'],
  })
  const spineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26 })
  const glowOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.1, 0.12, 0.18])
  // Live percentage label — a string MotionValue rendered as children, so
  // the text updates on scroll with zero re-renders. Clamped: the spring can
  // overshoot past 1 on fast scrolls.
  const percent = useTransform(spineScale, (v) => {
    const pct = Math.min(100, Math.max(0, Math.round(v * 100)))
    return `${pct}%`
  })

  return (
    <>
      {/* Ambient gutters glow, brighter as you read */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-0 hidden w-44 lg:block"
        style={{ opacity: reduced ? 0 : glowOpacity }}
      >
        <div className="size-full bg-[radial-gradient(ellipse_at_center_left,color-mix(in_oklab,var(--primary)_50%,transparent),transparent_72%)]" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 right-0 z-0 hidden w-44 lg:block"
        style={{ opacity: reduced ? 0 : glowOpacity }}
      >
        <div className="size-full bg-[radial-gradient(ellipse_at_center_right,color-mix(in_oklab,var(--accent-secondary)_45%,transparent),transparent_72%)]" />
      </motion.div>

      {/* Vertical reading spine + progress ring, xl+ only */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 flex-col items-center gap-3.5 xl:flex"
      >
        <div className="h-72 w-1 overflow-hidden rounded-full border border-border/60 bg-muted/40">
          <motion.div
            className="w-full flex-1 origin-top rounded-full bg-gradient-to-b from-primary to-accent-secondary shadow-[0_0_14px_2px_color-mix(in_oklab,var(--primary)_40%,transparent)]"
            style={{ scaleY: reduced ? 1 : spineScale }}
          />
        </div>

        {/* Ring + exact percentage — hidden under reduced motion (the spine
            itself is static there, so a live counter would disagree with it) */}
        {!reduced && (
          <div className="relative size-9">
            <svg
              viewBox="0 0 36 36"
              className="size-full -rotate-90 [filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--primary)_45%,transparent))]"
            >
              <defs>
                <linearGradient id="reading-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
              </defs>
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                strokeWidth="2.5"
                className="stroke-border/40"
              />
              <motion.circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                stroke="url(#reading-ring)"
                style={{ pathLength: spineScale }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-medium tabular-nums text-muted-foreground">
              <motion.span>{percent}</motion.span>
            </span>
          </div>
        )}
      </motion.div>
    </>
  )
}
