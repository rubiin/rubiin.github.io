import { useDeferredValue, useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Hash, SearchX } from 'lucide-react'
import { BlogSearch } from '@/components/blog/blog-search'
import { NeonButton } from '@/components/animations/neon-button'
import { SectionHeading } from '@/components/home/section-heading'
import { buildMeta } from '@/lib/seo'
import { getPosts, getPostTags } from '@/server/blog'

export const Route = createFileRoute('/blog/tags')({
  loader: async () => {
    const [tags, posts] = await Promise.all([getPostTags(), getPosts()])
    return { tags, posts }
  },
  head: () => ({
    meta: buildMeta({
      title: 'All tags — Rubin Bhandari',
      description:
        'Browse every tag used across the blog — NestJS, TypeScript, Docker, Linux, and more.',
      path: '/blog/tags',
    }),
  }),
  component: TagsPage,
})

function TagsPage() {
  const { tags, posts } = Route.useLoaderData()
  const [q, setQ] = useState('')
  // Deferred filter: typing stays urgent, the list update trails a tick
  // behind so keystrokes never block on the re-render (useDeferredValue).
  const deferredQ = useDeferredValue(q)
  const filtered = useMemo(() => {
    const needle = deferredQ.trim().toLowerCase()
    return needle ? tags.filter((t) => t.tag.toLowerCase().includes(needle)) : tags
  }, [tags, deferredQ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          level="h1"
          eyebrow="Writing"
          title="All tags."
          description={`${tags.length} tags across ${posts.length} articles — pick one to filter the blog.`}
          className="mb-0"
        />
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <BlogSearch
            query={q}
            onQueryChange={setQ}
            placeholder="Filter tags…"
            ariaLabel="Filter tags"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass flex flex-col items-center gap-5 rounded-2xl p-12 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-muted-foreground">No tags match “{q}”.</p>
          <NeonButton variant="outline" size="sm" onClick={() => setQ('')}>
            Clear filter
          </NeonButton>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {filtered.map(({ tag, count }) => (
            <Link
              key={tag}
              to="/blog"
              search={{ category: 'all', tag, q: '', page: 1, sort: 'newest' }}
              className="glass group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_20px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
            >
              <Hash className="size-3.5 text-primary" aria-hidden />
              {tag}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-background/60 group-hover:text-current">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
