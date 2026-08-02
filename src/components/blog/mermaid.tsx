'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Client component that renders a Mermaid diagram from a chart string.
 * Mermaid is dynamically imported so it never loads unless a diagram is on
 * the page.
 */
export function Mermaid({ chart, className }: { chart: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

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

    run()
    return () => {
      cancelled = true
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
