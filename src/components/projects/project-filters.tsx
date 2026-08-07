'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CATEGORY_LABELS, PROJECT_CATEGORIES } from '@/lib/constants'
import type { ProjectCategory } from '@/types'
import { cn } from '@/lib/utils'

export type ProjectFilter = ProjectCategory | 'all'

/** Shared filter-pill styling: gradient fill when active, glass when not. */
function pillClasses(active: boolean) {
  return cn(
    'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
    active
      ? 'border-transparent bg-gradient-to-r from-primary to-accent-secondary text-primary-foreground shadow-[0_6px_24px_-8px_color-mix(in_oklab,var(--primary)_70%,transparent)] dark:text-[#05060e]'
      : 'border-border/40 bg-muted/30 text-muted-foreground backdrop-blur-sm hover:border-primary/40 hover:text-foreground hover:shadow-[0_0_20px_-8px_color-mix(in_oklab,var(--primary)_50%,transparent)]',
  )
}

/**
 * Category pills + debounced search input for the projects grid.
 * Controlled via props so the route owns the state (search params).
 */
export function ProjectFilters({
  active,
  onCategoryChange,
  query,
  onQueryChange,
}: {
  active: ProjectFilter
  onCategoryChange: (category: ProjectFilter) => void
  query: string
  onQueryChange: (query: string) => void
}) {
  // Local input state, debounced up to the parent (route) 250ms later.
  const [draft, setDraft] = useState(query)

  // Latest callback ref so the debounce effect never re-arms on a fresh
  // inline closure from the parent (advanced-use-latest).
  const onQueryChangeRef = useRef(onQueryChange)
  onQueryChangeRef.current = onQueryChange

  // Sync external query changes (category pills, clear) into the draft
  // during render — not in an effect, so in-flight typing is never clobbered
  // and there's no extra render cycle (rerender-derived-state-no-effect).
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

  const options: ProjectFilter[] = ['all', ...PROJECT_CATEGORIES.map((c) => c.value)]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => {
          const label = option === 'all' ? 'All' : CATEGORY_LABELS[option]
          return (
            <button
              key={option}
              type="button"
              onClick={() => onCategoryChange(option)}
              aria-pressed={active === option}
              className={pillClasses(active === option)}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="relative max-w-sm">
        <Search
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search by title, tech, or tagline…"
          aria-label="Search projects"
          className="rounded-xl border-border/50 bg-card/50 pl-9 backdrop-blur-sm transition-shadow duration-300 focus-visible:shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_45%,transparent),0_0_28px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
        />
      </div>
    </div>
  )
}
