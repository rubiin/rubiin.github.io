'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/**
 * Debounced search input, controlled via props so the route owns the
 * search-param state. Clears with an explicit button.
 */
export function BlogSearch({
  query,
  onQueryChange,
  placeholder = 'Search articles…',
  ariaLabel = 'Search articles',
  className,
}: {
  query: string
  onQueryChange: (query: string) => void
  placeholder?: string
  ariaLabel?: string
  className?: string
}) {
  const [draft, setDraft] = useState(query)

  // Latest callback ref so the debounce effect never re-arms on a fresh
  // inline closure from the parent (advanced-use-latest).
  const onQueryChangeRef = useRef(onQueryChange)
  onQueryChangeRef.current = onQueryChange

  // Sync external query changes (filter chips, clear) into the draft during
  // render — not in an effect, so in-flight typing is never clobbered and
  // there's no extra render cycle (rerender-derived-state-no-effect).
  const prevQuery = useRef(query)
  if (prevQuery.current !== query) {
    prevQuery.current = query
    setDraft(query)
  }

  useEffect(() => {
    if (draft === query) return
    const id = setTimeout(() => onQueryChangeRef.current(draft), 250)
    return () => clearTimeout(id)
  }, [draft, query])

  return (
    <div className={cn('relative w-full lg:w-72', className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="rounded-xl border-border/50 bg-card/50 pl-9 pr-9 backdrop-blur-sm transition-shadow duration-300 focus-visible:shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_45%,transparent),0_0_28px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
      />
      {draft && (
        <button
          type="button"
          onClick={() => onQueryChange('')}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
