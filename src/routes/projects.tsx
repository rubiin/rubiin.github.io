import { useMemo } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectFilters, type ProjectFilter } from '@/components/projects/project-filters'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/animations/reveal'
import { SectionHeading } from '@/components/home/section-heading'
import { projects } from '@/data/projects'
import type { ProjectCategory } from '@/types'

interface ProjectsSearch {
  category: ProjectFilter
  q: string
}

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'frontend',
  'backend',
  'ai',
  'devops',
  'mobile',
  'full-stack',
]

export const Route = createFileRoute('/projects')({
  validateSearch: (search: Record<string, unknown>): ProjectsSearch => {
    const category = search.category as ProjectFilter | undefined
    const q = typeof search.q === 'string' ? search.q : ''
    return {
      category: category && PROJECT_CATEGORIES.includes(category as ProjectCategory) ? category : 'all',
      q,
    }
  },
  head: () => ({
    meta: [
      { title: 'Projects — Devina' },
      {
        name: 'description',
        content:
          'Selected projects by Devina — frontend, backend, AI, DevOps, mobile, and full-stack work.',
      },
    ],
  }),
  component: ProjectsPage,
})

function ProjectsPage() {
  const { category, q } = useSearch({ from: '/projects' })
  const navigate = useNavigate()

  const setCategory = (next: ProjectFilter) => {
    void navigate({
      to: '/projects',
      search: (prev: ProjectsSearch) => ({ ...prev, category: next }),
    })
  }

  const setQuery = (next: string) => {
    void navigate({
      to: '/projects',
      search: (prev: ProjectsSearch) => ({ ...prev, q: next }),
    })
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

  const hasFilters = category !== 'all' || q.trim() !== ''

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

      <p className="sr-only">{hasFilters ? 'Filtered results' : 'All projects'}</p>
    </div>
  )
}
