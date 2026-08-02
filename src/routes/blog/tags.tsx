import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Hash, SearchX } from 'lucide-react'
import { BlogSearch } from '@/components/blog/blog-search'
import { SectionHeading } from '@/components/home/section-heading'
import { Button } from '@/components/ui/button'
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
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return needle ? tags.filter((t) => t.tag.toLowerCase().includes(needle)) : tags
  }, [tags, q])

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Writing"
          title="All tags."
          description={`${tags.length} tags across ${posts.length} articles — pick one to filter the blog.`}
          className="mb-0"
        />
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <Link
            to="/blog/categories"
            className="rounded-sm text-sm font-medium text-primary underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring hover:underline"
          >
            Browse categories
          </Link>
          <BlogSearch
            query={q}
            onQueryChange={setQ}
            placeholder="Filter tags…"
            ariaLabel="Filter tags"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-12 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-muted-foreground">No tags match “{q}”.</p>
          <Button variant="outline" onClick={() => setQ('')}>
            Clear filter
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {filtered.map(({ tag, count }) => (
            <Link
              key={tag}
              to="/blog"
              search={{ category: 'all', tag, q: '', page: 1 }}
              className="group inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm transition-colors hover:border-primary/50 hover:bg-accent"
            >
              <Hash className="size-3.5 text-primary" aria-hidden />
              {tag}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-background/60">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
