'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Subtle scene-change beat between chapters: two gradient hairlines draw
 * in from the edges toward a small glowing diamond node. Decorative
 * (`aria-hidden`); statically rendered under reduced motion.
 */
export function ChapterDivider({ className }: { className?: string }) {
  const reduced = useReducedMotion()

  return (
    <div
      aria-hidden
      className={cn('mx-auto flex w-full max-w-6xl items-center gap-5 px-4 sm:px-6', className)}
    >
      <motion.span
        className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/35"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ transformOrigin: 'left' }}
      />
      <motion.span
        className="size-1.5 shrink-0 rotate-45 bg-gradient-to-br from-primary to-accent-secondary shadow-[0_0_12px_2px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
        initial={reduced ? false : { scale: 0, opacity: 0 }}
        whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
      />
      <motion.span
        className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-secondary/35"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        style={{ transformOrigin: 'right' }}
      />
    </div>
  )
}
