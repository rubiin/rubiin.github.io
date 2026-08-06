'use client'

import { motion, useReducedMotion } from 'motion/react'
import { KineticTitle } from '@/components/animations/kinetic-title'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Storytelling section heading. When `chapter` is set, the heading reads as
 * a chapter opener: a faint oversized number, a "01 — <eyebrow>" label, a
 * word-by-word masked reveal of the title, and a gradient rule that draws
 * in beneath. Renders statically for reduced motion.
 */
export function ChapterHeading({
  chapter,
  eyebrow,
  title,
  description,
  align = 'left',
  level = 'h2',
  className,
}: {
  chapter?: string
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  /** Document hierarchy — pages without an outer <h1> should use 'h1'. */
  level?: 'h1' | 'h2'
  className?: string
}) {
  const reduced = useReducedMotion()
  const centered = align === 'center'
  const TitleTag = level === 'h1' ? 'h1' : 'h2'

  return (
    <div
      className={cn(
        'relative mb-12 flex flex-col gap-3',
        // The top padding only exists to clear the ghost chapter number —
        // headings without one (page sections) keep the page's own rhythm.
        chapter && 'pt-12 sm:pt-16',
        centered && 'items-center text-center',
        className,
      )}
    >
      {/* Faint oversized chapter number behind the headline */}
      {chapter && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute -top-16 right-0 hidden font-display text-[6.5rem] leading-none font-bold tracking-tight text-primary/[0.06] select-none sm:block sm:text-[8rem]',
            centered && 'left-1/2 -translate-x-1/2',
          )}
        >
          {chapter}
        </span>
      )}

      {eyebrow && (
        <span
          className={cn(
            'relative flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.28em] text-primary',
            centered && 'justify-center',
          )}
        >
          {!centered && (
            <span
              aria-hidden
              className="h-px w-8 bg-gradient-to-r from-primary to-accent-secondary shadow-[0_0_8px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
            />
          )}
          {chapter ? (
            <>
              <span className="font-display font-semibold normal-case tracking-normal">
                {chapter}
              </span>
              <span aria-hidden className="text-primary/50">
                —
              </span>
            </>
          ) : null}
          <span className={cn(chapter ? 'text-primary/75' : undefined)}>{eyebrow}</span>
        </span>
      )}

      <TitleTag
        className={cn(
          'relative font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl',
          centered && 'max-w-2xl',
        )}
      >
        {/* Identical DOM for reduced + animated paths (hydration-safe); only
            the animation props change. Words rise out of an overflow mask. */}
        <KineticTitle text={title} />
      </TitleTag>

      {/* Gradient rule that draws in beneath the title */}
      <motion.span
        aria-hidden
        className={cn(
          'relative h-px w-24 bg-gradient-to-r from-primary via-accent-secondary to-transparent',
          centered && 'mx-auto',
        )}
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
        style={{ transformOrigin: centered ? 'center' : 'left' }}
      />

      {description && (
        <p className={cn('relative max-w-2xl text-muted-foreground', centered && 'mx-auto')}>
          {description}
        </p>
      )}
    </div>
  )
}
