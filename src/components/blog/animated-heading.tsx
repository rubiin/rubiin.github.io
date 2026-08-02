'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type Level = 'h2' | 'h3' | 'h4'

/**
 * Scroll-triggered heading reveal for MDX content: each heading rises out
 * of a mask into view, and h2s sweep in a mint gradient rule beneath.
 * Structure is identical for reduced-motion users (no initial offsets), so
 * there is no hydration mismatch — only the animation is skipped.
 */
export function AnimatedHeading({
  id,
  level,
  children,
  className,
}: {
  id?: string
  level: Level
  children?: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()
  const Tag = level

  return (
    <Tag id={id} className={className}>
      <span className="block overflow-hidden">
        <motion.span
          className="block pb-[0.14em] -mb-[0.14em]"
          initial={reduced ? false : { y: '60%', opacity: 0.35 }}
          whileInView={reduced ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.span>
      </span>
      {level === 'h2' && (
        <motion.span
          aria-hidden
          className="mt-2 block h-px w-full bg-gradient-to-r from-primary/60 via-accent-secondary/50 to-transparent"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={reduced ? undefined : { scaleX: 1 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </Tag>
  )
}
