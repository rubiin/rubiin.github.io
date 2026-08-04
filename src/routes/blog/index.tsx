import { useEffect, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useLoaderData,
  useNavigate,
  useSearch,
} from '@tanstack/react-router'
import { FeaturedPost } from '@/components/blog/featured-post'
import { PostCard } from '@/components/blog/post-card'
import { BlogSearch } from '@/components/blog/blog-search'
import { BlogPagination } from '@/components/blog/pagination'
import { Reveal } from '@/components/animations/reveal'
import { SectionHeading } from '@/components/home/section-heading'
import { Button } from '@/components/ui/button'
import { BLOG_POSTS_QUERY_KEY, POSTS_PER_PAGE } from '@/lib/constants'
import { buildMeta } from '@/lib/seo'
import { getPostCategories, getPosts, getPostTags } from '@/server/blog'
import { cn } from '@/lib/utils'

interface BlogSearchParams {
  category: string
  tag: string
  q: string
  page: number
}

export const Route = createFileRoute('/blog/')({
  validateSearch: (search: Record<string, unknown>): BlogSearchParams => {
    const page = typeof search.page === 'number' ? search.page : Number(search.page) || 1
    return {
      category: typeof search.category === 'string' ? search.category : 'all',
      tag: typeof search.tag === 'string' ? search.tag : 'all',
      q: typeof search.q === 'string' ? search.q : '',
      page: page < 1 ? 1 : page,
    }
  },
  loader: async () => {
    const [posts, tags, categories] = await Promise.all([
      getPosts(),
      getPostTags(),
      getPostCategories(),
    ])
    return { posts, tags, categories }
  },
  head: () => ({
    meta: buildMeta({
      title: 'Blog — Rubin Bhandari',
      description:
        'Essays on engineering and developer tooling by Rubin Bhandari — NestJS, Linux, Docker, and terminal workflows.',
      path: '/blog',
    }),
  }),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const { posts, tags, categories } = useLoaderData({ from: '/blog/' })
  const { category, tag, q, page } = useSearch({ from: '/blog/' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Seed the ⌘K palette's posts cache from this loader's data — the palette
  // reads the same key, so opening it after visiting the blog never refetches.
  useEffect(() => {
    queryClient.setQueryData(BLOG_POSTS_QUERY_KEY, posts)
  }, [queryClient, posts])

  const update = (patch: Partial<BlogSearchParams>) => {
    // Any filter change resets to page 1; only an explicit page patch keeps it.
    const resetPage = !('page' in patch)
    void navigate({
      to: '/blog',
      search: {
        category: patch.category ?? category,
        tag: patch.tag ?? tag,
        q: patch.q ?? q,
        page: resetPage ? 1 : (patch.page ?? page),
      },
    })
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return posts.filter((post) => {
      if (category !== 'all' && post.category !== category) return false
      if (tag !== 'all' && !post.tags.includes(tag)) return false
      if (!needle) return true
      return [post.title, post.description, ...post.tags].join(' ').toLowerCase().includes(needle)
    })
  }, [posts, category, tag, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE)
  const featured = posts.find((p) => p.featured) ?? posts[0]
  const hasFilters = category !== 'all' || tag !== 'all' || q.trim().length > 0
  const hasMoreCategories = categories.length > 1
  const isCategoryFilter = category !== 'all'
  const isTagFilter = tag !== 'all'
  const isFiltering = isCategoryFilter || isTagFilter
  const headingTitle =
    isCategoryFilter && isTagFilter
      ? `Showing posts from ${category} · #${tag}`
      : isCategoryFilter
        ? `Showing posts from ${category}`
        : isTagFilter
          ? `Showing posts from #${tag}`
          : 'Notes from the workshop.'

  const clearFilters = () => update({ category: 'all', tag: 'all', q: '' })

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow={isFiltering ? 'Filtered writing' : 'Writing'}
        title={headingTitle}
        description={
          isFiltering
            ? `${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'}${
                isCategoryFilter ? ` in the ${category} category` : ''
              }${isCategoryFilter && isTagFilter ? ' ·' : ''}${isTagFilter ? ` tagged #${tag}` : ''}.`
            : 'Essays on engineering, design, and the craft of building on the web.'
        }
      />

      {featured && !hasFilters && safePage === 1 && (
        <div className="mb-12">
          <FeaturedPost post={featured} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          {hasMoreCategories && !isTagFilter && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {['all', ...categories.map((c) => c.category)].map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={category === c ? 'default' : 'outline'}
                  className="rounded-full"
                  aria-pressed={category === c}
                  onClick={() => update({ category: c })}
                >
                  {c === 'all' ? 'All' : c}
                </Button>
              ))}
            </div>
          )}
          {tags.length > 1 && !isCategoryFilter && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
              <Button
                key="all"
                size="sm"
                variant="ghost"
                className={cn(
                  'rounded-full text-xs',
                  tag === 'all' && 'bg-accent text-accent-foreground',
                )}
                aria-pressed={tag === 'all'}
                onClick={() => update({ tag: 'all' })}
              >
                All tags
              </Button>
              {tags.slice(0, 8).map(({ tag: t, count }) => (
                <Button
                  key={t}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    'rounded-full text-xs',
                    tag === t && 'bg-accent text-accent-foreground',
                  )}
                  aria-pressed={tag === t}
                  onClick={() => update({ tag: t })}
                >
                  #{t}
                  <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
                    {count}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <div className="flex items-center gap-5 text-sm">
            <Link
              to="/blog/tags"
              className="rounded-sm font-medium text-primary underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring hover:underline"
            >
              All tags
            </Link>
            <Link
              to="/blog/categories"
              className="rounded-sm font-medium text-primary underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring hover:underline"
            >
              Categories
            </Link>
          </div>
          <BlogSearch query={q} onQueryChange={(next) => update({ q: next })} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">No articles match your filters.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 0.06}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
          {totalPages > 1 && (
            <BlogPagination
              page={safePage}
              totalPages={totalPages}
              onPageChange={(next) => update({ page: next })}
            />
          )}
        </>
      )}
    </div>
  )
}
