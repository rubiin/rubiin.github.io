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
    const inner = <Reveal delay={(i % 3) * 0.06}>{renderItem(item, i)}</Reveal>
    if (reduced) return <div key={item.slug}>{inner}</div>
    return (
      <motion.div
        key={item.slug}
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: EASE }}
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
