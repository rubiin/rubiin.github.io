'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/server/blog-utils'
import { cn } from '@/lib/utils'

const EMPTY_FINISHED: ReadonlySet<string> = new Set()

/**
 * Sticky table of contents. Tracks the heading currently in view with an
 * IntersectionObserver and highlights it via a static class swap. Sections
 * whose heading has scrolled past the reading line are marked "finished" and
 * dimmed — mirroring the paragraph read-head on the article body.
 */
export function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [finishedIds, setFinishedIds] = useState<ReadonlySet<string>>(EMPTY_FINISHED)

  useEffect(() => {
    if (toc.length === 0) return
    const ids = toc.map((item) => item.id)

    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )

    // Headings above the reading line (~46% of the viewport) are finished.
    // Derived live from intersection, so scrolling back up restores them.
    const finishedObserver = new IntersectionObserver(
      (entries) => {
        setFinishedIds((prev) => {
          const next = new Set(prev)
          let changed = false
          for (const entry of entries) {
            const id = entry.target.id
            if (entry.isIntersecting && !next.has(id)) {
              next.add(id)
              changed = true
            } else if (!entry.isIntersecting && next.has(id)) {
              next.delete(id)
              changed = true
            }
          }
          return changed ? next : prev
        })
      },
      { rootMargin: '0px 0px -54% 0px', threshold: 0 },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) {
        activeObserver.observe(el)
        finishedObserver.observe(el)
      }
    }
    return () => {
      activeObserver.disconnect()
      finishedObserver.disconnect()
    }
  }, [toc])

  if (toc.length === 0) return null

  return (
    <nav
      aria-label="Table of contents"
      className="glass rounded-2xl p-5 text-sm transition-colors duration-300 hover:border-primary/30"
    >
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
        <span aria-hidden className="h-px w-4 bg-gradient-to-r from-primary to-accent-secondary" />
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {toc.map((item) => {
          const isActive = activeId === item.id
          const isFinished = !isActive && finishedIds.has(item.id)
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'group relative -ml-px block border-l-2 py-0.5 pl-3 text-muted-foreground transition-all duration-300 hover:text-foreground',
                  item.level === 3 && 'pl-6',
                  isActive && 'border-primary text-foreground',
                  isFinished && 'border-border/40 opacity-55 hover:opacity-90',
                )}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute top-1/2 -left-[7px] size-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_2px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                  />
                )}
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
