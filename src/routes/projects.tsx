import { startTransition, useMemo } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectFilters, type ProjectFilter } from '@/components/projects/project-filters'
import { AnimatedGrid } from '@/components/animations/animated-grid'
import { NeonButton } from '@/components/animations/neon-button'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionHeading } from '@/components/home/section-heading'
import { PROJECT_CATEGORIES } from '@/lib/constants'
import { buildMeta } from '@/lib/seo'
import { projects } from '@/data/projects'
import type { Project } from '@/types'

interface ProjectsSearch {
  category: ProjectFilter
  q: string
}

const CATEGORY_VALUES = PROJECT_CATEGORIES.map((c) => c.value)

// Stable renderItem — module scope so the reference never changes across re-renders.
function renderProjectCard(project: Project) {
  return <ProjectCard project={project} />
}

export const Route = createFileRoute('/projects')({
  validateSearch: (search: Record<string, unknown>): ProjectsSearch => {
    const category = search.category as ProjectFilter | undefined
    const q = typeof search.q === 'string' ? search.q : ''
    return {
      category:
        category && CATEGORY_VALUES.includes(category as (typeof CATEGORY_VALUES)[number])
          ? category
          : 'all',
      q,
    }
  },
  head: () => ({
    meta: buildMeta({
      title: 'Projects — Rubin Bhandari',
      description:
        'Selected open-source projects by Rubin Bhandari — NestJS modules, CLI tools, and Android apps.',
      path: '/projects',
    }),
  }),
  pendingComponent: ProjectsSkeleton,
  component: ProjectsPage,
})

function ProjectsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            // oxlint-disable-next-line react/no-array-index-key -- static skeleton
            key={i}
            className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/50 bg-card p-5"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/70 via-accent-secondary/50 to-transparent"
            />
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsPage() {
  const { category, q } = useSearch({ from: '/projects' })
  const navigate = useNavigate()

  // Non-urgent filter updates (use-transitions): the URL change + grid
  // re-render run as transitions, so typing/clicks stay responsive.
  const setCategory = (next: ProjectFilter) => {
    startTransition(() => {
      void navigate({ to: '/projects', search: { category: next, q } })
    })
  }

  const setQuery = (next: string) => {
    startTransition(() => {
      void navigate({ to: '/projects', search: { category, q: next } })
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      void navigate({ to: '/projects', search: { category: 'all', q: '' } })
    })
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return projects.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (!needle) return true
      const haystack = [p.title, p.tagline, p.description, ...p.tech].join(' ').toLowerCase()
      return haystack.includes(needle)
    })
  }, [category, q])

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        level="h1"
        eyebrow="Work"
        title="Projects."
        description="Things I've shipped across the stack — explore by category or search."
      />

      <ProjectFilters
        active={category}
        onCategoryChange={setCategory}
        query={q}
        onQueryChange={setQuery}
      />

      {filtered.length === 0 ? (
        <div className="glass mt-16 flex flex-col items-center gap-5 rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No projects match your filters.</p>
          <NeonButton variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </NeonButton>
        </div>
      ) : (
        <AnimatedGrid
          items={filtered}
          renderItem={renderProjectCard}
          className="mt-10 md:grid-cols-2 lg:grid-cols-3"
        />
      )}
    </div>
  )
}
