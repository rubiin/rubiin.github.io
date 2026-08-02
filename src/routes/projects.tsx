import { useMemo } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectFilters, type ProjectFilter } from '@/components/projects/project-filters'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Reveal } from '@/components/animations/reveal'
import { SectionHeading } from '@/components/home/section-heading'
import { PROJECT_CATEGORIES } from '@/lib/constants'
import { buildMeta } from '@/lib/seo'
import { projects } from '@/data/projects'

interface ProjectsSearch {
  category: ProjectFilter
  q: string
}

const CATEGORY_VALUES = PROJECT_CATEGORIES.map((c) => c.value)

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
      title: 'Projects — Devina',
      description:
        'Selected projects by Devina — frontend, backend, AI, DevOps, mobile, and full-stack work.',
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
          <div key={i} className="flex flex-col gap-3 rounded-xl border bg-card p-5">
            <Skeleton className="aspect-video w-full" />
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

  const setCategory = (next: ProjectFilter) => {
    void navigate({ to: '/projects', search: { category: next, q } })
  }

  const setQuery = (next: string) => {
    void navigate({ to: '/projects', search: { category, q: next } })
  }

  const clearFilters = () => {
    void navigate({ to: '/projects', search: { category: 'all', q: '' } })
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
        eyebrow="Work"
        title="Projects."
        description="Six things I've shipped across the stack — explore by category or search."
      />

      <ProjectFilters
        active={category}
        onCategoryChange={setCategory}
        query={q}
        onQueryChange={setQuery}
      />

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">No projects match your filters.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 0.06}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
