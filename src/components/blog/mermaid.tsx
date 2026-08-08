'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Client component that renders a Mermaid diagram from a chart string.
 * Mermaid is dynamically imported — and that import is deferred until the
 * diagram approaches the viewport — so the chunk is never loaded for
 * diagrams that stay below the fold.
 */
export function Mermaid({ chart, className }: { chart: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let cancelled = false
    let observer: IntersectionObserver | null = null

    const run = async () => {
      try {
        const mermaid = await import('mermaid')
        mermaid.default.initialize({ startOnLoad: false, theme: 'dark' })
        const { svg } = await mermaid.default.render(`mermaid-${id}`, chart)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to render diagram')
        }
      }
    }

    if (typeof IntersectionObserver === 'undefined') {
      run()
    } else {
      // Fire once the diagram gets within 200px of the viewport; disconnect
      // after the first intersection so the import + render run exactly once.
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect()
            run()
          }
        },
        { rootMargin: '200px 0px' },
      )
      observer.observe(el)
    }

    return () => {
      cancelled = true
      observer?.disconnect()
    }
  }, [chart, id])

  if (error) {
    return (
      <pre
        className={cn(
          'my-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm',
          className,
        )}
      >
        {chart}
        <p className="mt-2 text-xs text-destructive">{error}</p>
      </pre>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        'my-4 flex justify-center overflow-x-auto rounded-lg border border-border bg-muted/30 p-4',
        className,
      )}
      aria-label="Diagram"
      role="img"
    >
      <span className="text-sm text-muted-foreground">Rendering diagram…</span>
    </div>
  )
}