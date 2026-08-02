'use client'

import type { RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

/**
 * Scroll-driven reading progress: as the article is read, soft mint glows
 * bloom in the gutters and a vertical spine on the right edge fills with a
 * glowing gradient. Purely decorative (`aria-hidden`) — hidden on smaller
 * screens and rendered statically under reduced motion.
 */
export function BlogReadingGlow({
  targetRef,
}: {
  targetRef: RefObject<HTMLElement | null>
}) {
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 0.9', 'end 0.25'],
  })
  const spineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26 })
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 0.1, 0.12, 0.18],
  )

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

      {/* Vertical reading spine, xl+ only */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-1/2 right-3 z-30 hidden h-80 w-1 -translate-y-1/2 flex-col overflow-hidden rounded-full border border-border/60 bg-muted/40 xl:flex"
      >
        <motion.div
          className="w-full flex-1 origin-top rounded-full bg-gradient-to-b from-primary to-accent-secondary shadow-[0_0_14px_2px_color-mix(in_oklab,var(--primary)_40%,transparent)]"
          style={{ scaleY: reduced ? 1 : spineScale }}
        />
      </motion.div>
    </>
  )
}
