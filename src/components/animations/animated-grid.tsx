'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { Reveal } from '@/components/animations/reveal'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Filterable card grid with reflow animation: cards glide to their new grid
 * spot on reorder (`layout`) and fade/scale in-out when the set changes
 * (AnimatePresence popLayout). Each cell keeps its scroll-triggered Reveal
 * entrance. Reduced-motion users get a plain static grid.
 */
export function AnimatedGrid<T extends { slug: string }>({
  items,
  renderItem,
  className,
}: {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  /** Grid template classes, e.g. 'sm:grid-cols-2 lg:grid-cols-3'. */
  className?: string
}) {
  const reduced = useReducedMotion()

  const cards = items.map((item, i) => {
    // Reduced motion: Reveal renders a bare wrapper div (no animation), so
    // skip it — the grid cell below is the only DOM node needed (fewer
    // nodes per card for reduced-motion users).
    // `h-full` on every cell wrapper keeps the card's internal `h-full`
    // chain anchored to the stretched grid row, so all cards in a row share
    // the same height regardless of content length.
    if (reduced) {
      return (
        <div key={item.slug} className="h-full">
          {renderItem(item, i)}
        </div>
      )
    }
    const inner = (
      <Reveal delay={(i % 3) * 0.06} className="h-full">
        {renderItem(item, i)}
      </Reveal>
    )
    return (
      <motion.div
        key={item.slug}
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="h-full"
      >
        {inner}
      </motion.div>
    )
  })

  return (
    <div className={cn('grid gap-6', className)}>
      {reduced ? (
        cards
      ) : (
        <AnimatePresence mode="popLayout" initial={false}>
          {cards}
        </AnimatePresence>
      )}
    </div>
  )
}
