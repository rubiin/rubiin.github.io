'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PROJECT_CATEGORIES } from '@/lib/constants'
import type { ProjectCategory } from '@/types'
import { cn } from '@/lib/utils'

export type ProjectFilter = ProjectCategory | 'all'

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

  useEffect(() => {
    setDraft(query)
  }, [query])

  useEffect(() => {
    const id = setTimeout(() => {
      if (draft !== query) onQueryChange(draft)
    }, 250)
    return () => clearTimeout(id)
  }, [draft, query, onQueryChange])

  const options: ProjectFilter[] = ['all', ...PROJECT_CATEGORIES.map((c) => c.value)]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => {
          const label = option === 'all' ? 'All' : PROJECT_CATEGORIES.find((c) => c.value === option)?.label
          return (
            <Button
              key={option}
              size="sm"
              variant={active === option ? 'default' : 'outline'}
              onClick={() => onCategoryChange(option)}
              aria-pressed={active === option}
              className={cn('rounded-full')}
            >
              {label}
            </Button>
          )
        })}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search by title, tech, or tagline…"
          aria-label="Search projects"
          className="pl-9"
        />
      </div>
    </div>
  )
}
