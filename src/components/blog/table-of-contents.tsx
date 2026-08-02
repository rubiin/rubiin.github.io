'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/server/blog-utils'
import { cn } from '@/lib/utils'

/**
 * Sticky table of contents. Tracks the heading currently in view with an
 * IntersectionObserver and highlights it. Hidden entirely when reduced motion
 * is preferred is unnecessary — highlighting is a static class swap.
 */
export function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (toc.length === 0) return
    const ids = toc.map((item) => item.id)
    const observer = new IntersectionObserver(
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
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                '-ml-px block border-l-2 py-0.5 pl-3 text-muted-foreground transition-colors hover:text-foreground',
                item.level === 3 && 'pl-6',
                activeId === item.id && 'border-primary text-foreground',
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
