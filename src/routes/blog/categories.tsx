import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, SearchX } from 'lucide-react'
import { BlogSearch } from '@/components/blog/blog-search'
import { SectionHeading } from '@/components/home/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buildMeta } from '@/lib/seo'
import { getPostCategories, getPosts } from '@/server/blog'
import type { PostSummary } from '@/server/blog'

export const Route = createFileRoute('/blog/categories')({
  loader: async () => {
    const [categories, posts] = await Promise.all([getPostCategories(), getPosts()])
    return { categories, posts }
  },
  head: () => ({
    meta: buildMeta({
      title: 'All categories — Rubin Bhandari',
      description:
        'Browse every category on the blog — engineering, Node.js, NestJS, TypeScript, DevOps, and more.',
      path: '/blog/categories',
    }),
  }),
  component: CategoriesPage,
})

function CategoriesPage() {
  const { categories, posts } = Route.useLoaderData()
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const filtered = useMemo(
    () =>
      needle ? categories.filter((c) => c.category.toLowerCase().includes(needle)) : categories,
    [categories, needle],
  )
  const byCategory = useMemo(() => {
    const map = new Map<string, PostSummary[]>()
    for (const post of posts) {
      const list = map.get(post.category)
      if (list) list.push(post)
      else map.set(post.category, [post])
    }
    return map
  }, [posts])

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Writing"
          title="All categories."
          description={`${categories.length} categories across ${posts.length} articles — the topics I write about.`}
          className="mb-0"
        />
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <Link
            to="/blog/tags"
            className="rounded-sm text-sm font-medium text-primary underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring hover:underline"
          >
            Browse tags
          </Link>
          <BlogSearch
            query={q}
            onQueryChange={setQ}
            placeholder="Filter categories…"
            ariaLabel="Filter categories"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-12 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-muted-foreground">No categories match “{q}”.</p>
          <Button variant="outline" onClick={() => setQ('')}>
            Clear filter
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ category, count }) => {
            const samples = (byCategory.get(category) ?? []).slice(0, 3)
            return (
              <div key={category} className="flex flex-col rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <Badge>{category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {count} {count === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                  {samples.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to={`/blog/${p.slug}` as string}
                        className="line-clamp-1 text-sm text-foreground/85 transition-colors hover:text-primary"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/blog"
                  search={{ category, tag: 'all', q: '', page: 1 }}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  View all {count}
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
