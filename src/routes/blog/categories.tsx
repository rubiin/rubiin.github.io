import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, SearchX } from 'lucide-react'
import { BlogSearch } from '@/components/blog/blog-search'
import { AnimatedBorder } from '@/components/animations/animated-border'
import { NeonButton } from '@/components/animations/neon-button'
import { Reveal } from '@/components/animations/reveal'
import { SectionHeading } from '@/components/home/section-heading'
import { Badge } from '@/components/ui/badge'
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
        'Browse every topic category across the writing — from TypeScript and Node.js to Docker, Linux and Vim.',
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
          level="h1"
          eyebrow="Writing"
          title="All categories."
          description={`${categories.length} topic categories across ${posts.length} articles — dive into each one.`}
          className="mb-0"
        />
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <BlogSearch
            query={q}
            onQueryChange={setQ}
            placeholder="Filter categories…"
            ariaLabel="Filter categories"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass flex flex-col items-center gap-5 rounded-2xl p-12 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-muted-foreground">No categories match “{q}”.</p>
          <NeonButton variant="outline" size="sm" onClick={() => setQ('')}>
            Clear filter
          </NeonButton>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ category, count }, i) => {
            const samples = (byCategory.get(category) ?? []).slice(0, 3)
            return (
              <Reveal key={category} delay={(i % 3) * 0.06} className="h-full">
                <AnimatedBorder className="h-full">
                  <div className="group flex h-full flex-col rounded-[inherit] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <Badge className="bg-gradient-to-r from-primary to-accent-secondary text-primary-foreground dark:text-[#05060e]">
                        {category}
                      </Badge>
                      <span className="text-xs tabular-nums text-muted-foreground">
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
                      search={{ category, tag: 'all', q: '', page: 1, sort: 'newest' }}
                      className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary transition-all duration-300 hover:border-primary/45 hover:bg-primary/15 hover:shadow-[0_0_20px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      View all {count}
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </AnimatedBorder>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
