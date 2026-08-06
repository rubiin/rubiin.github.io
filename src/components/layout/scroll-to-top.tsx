'use client'

import { useId, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { lenisScrollTo } from '@/hooks/use-lenis'
import { cn } from '@/lib/utils'

/** Pixels scrolled before the button appears (roughly one viewport). */
const SHOW_AFTER = 320

/**
 * Modern scroll-to-top button: a frosted-glass disc pinned bottom-right
 * that fades in after the first viewport. A gradient ring around the arrow
 * tracks scroll progress (spring-smoothed), doubling as a subtle "how far
 * down the page am I" meter. Clicking uses `lenisScrollTo(0)` so it rides
 * the site's smooth-scroll engine and falls back to native scrolling.
 */
export function ScrollToTop() {
  const { scrollY, scrollYProgress } = useScroll()
  const reduced = useReducedMotion()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })
  const [visible, setVisible] = useState(false)
  const gradientId = useId()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > SHOW_AFTER)
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          title="Scroll to top"
          onClick={() => lenisScrollTo(0)}
          className={cn(
            'group fixed right-6 z-40 grid size-12 place-items-center rounded-full',
            // Safe-area aware on notched devices (underscores → spaces in calc)
            'bottom-[calc(1.5rem_+_env(safe-area-inset-bottom))]',
            'border border-border/70 bg-card/70 shadow-lg shadow-black/10 backdrop-blur-xl',
            'transition-[border-color,box-shadow]',
            'hover:border-primary/60 hover:shadow-[0_0_28px_-6px_color-mix(in_oklab,var(--primary)_55%,transparent)]',
          )}
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          whileHover={reduced ? undefined : { scale: 1.06 }}
          whileTap={reduced ? undefined : { scale: 0.94 }}
        >
          <svg
            viewBox="0 0 48 48"
            className="absolute inset-0 size-full -rotate-90"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent-secondary)" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle
              cx="24"
              cy="24"
              r="21"
              fill="none"
              strokeWidth="2.5"
              className="stroke-[color-mix(in_oklab,var(--muted)_70%,transparent)]"
            />
            {/* Progress ring — hidden for reduced motion (static track only) */}
            {!reduced && (
              <motion.circle
                cx="24"
                cy="24"
                r="21"
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ pathLength: progress }}
              />
            )}
          </svg>
          <ArrowUp className="relative size-5 text-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-primary" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
