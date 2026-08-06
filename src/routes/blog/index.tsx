import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useLoaderData,
  useNavigate,
  useSearch,
} from '@tanstack/react-router'
import { ArrowUpDown, ChevronDown, FileText, Hash, LayoutGrid, Tags, X } from 'lucide-react'
import { FeaturedPost } from '@/components/blog/featured-post'
import { PostCard } from '@/components/blog/post-card'
import { BlogSearch } from '@/components/blog/blog-search'
import { BlogPagination } from '@/components/blog/pagination'
import { AnimatedGrid } from '@/components/animations/animated-grid'
import { NeonButton } from '@/components/animations/neon-button'
import { SectionHeading } from '@/components/home/section-heading'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BLOG_POSTS_QUERY_KEY, POSTS_PER_PAGE } from '@/lib/constants'
import { buildMeta } from '@/lib/seo'
import { getPostCategories, getPosts, type PostSummary } from '@/server/blog'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'featured', label: 'Featured' },
  { value: 'oldest', label: 'Oldest' },
] as const

type BlogSort = (typeof SORT_OPTIONS)[number]['value']
const SORTS = SORT_OPTIONS.map((o) => o.value)

interface BlogSearchParams {
  category: string
  tag: string
  q: string
  page: number
  sort: BlogSort
}

/** Shared filter-pill styling: gradient fill when active, glass when not. */
function pillClasses(active: boolean) {
  return cn(
    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
    active
      ? 'border-transparent bg-gradient-to-r from-primary to-accent-secondary text-primary-foreground shadow-[0_6px_24px_-8px_color-mix(in_oklab,var(--primary)_70%,transparent)] dark:text-[#05060e]'
      : 'border-border/40 bg-muted/30 text-muted-foreground backdrop-blur-sm hover:border-primary/40 hover:text-foreground hover:shadow-[0_0_20px_-8px_color-mix(in_oklab,var(--primary)_50%,transparent)]',
  )
}

export const Route = createFileRoute('/blog/')({
  validateSearch: (search: Record<string, unknown>): BlogSearchParams => {
    const page = typeof search.page === 'number' ? search.page : Number(search.page) || 1
    return {
      category: typeof search.category === 'string' ? search.category : 'all',
      tag: typeof search.tag === 'string' ? search.tag : 'all',
      q: typeof search.q === 'string' ? search.q : '',
      page: page < 1 ? 1 : page,
      sort: SORTS.includes(search.sort as BlogSort) ? (search.sort as BlogSort) : 'newest',
    }
  },
  loader: async () => {
    const [posts, categories] = await Promise.all([getPosts(), getPostCategories()])
    return { posts, categories }
  },
  head: () => ({
    meta: buildMeta({
      title: 'Blog — Rubin Bhandari',
      description:
        'Essays on engineering and developer tooling by Rubin Bhandari — Javascript, Linux, APIs, and terminal workflows.',
      path: '/blog',
    }),
  }),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const reduced = useReducedMotion()
  const { posts, categories } = useLoaderData({ from: '/blog/' })
  const { category, tag, q, page, sort } = useSearch({ from: '/blog/' })
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
        sort: patch.sort ?? sort,
      },
    })
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const matches = posts.filter((post) => {
      if (category !== 'all' && post.category !== category) return false
      if (tag !== 'all' && !post.tags.includes(tag)) return false
      if (!needle) return true
      return [post.title, post.description, ...post.tags].join(' ').toLowerCase().includes(needle)
    })
    // Sort a copy — never mutate the loader's cached array.
    const compare: Record<BlogSort, (a: PostSummary, b: PostSummary) => number> = {
      newest: (a, b) => (a.date < b.date ? 1 : -1),
      oldest: (a, b) => (a.date > b.date ? 1 : -1),
      popular: (a, b) => b.views - a.views || (a.date < b.date ? 1 : -1),
      featured: (a, b) => Number(b.featured) - Number(a.featured) || (a.date < b.date ? 1 : -1),
    }
    return matches.sort(compare[sort])
  }, [posts, category, tag, q, sort])

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
          : 'The Iteration Log.'

  const clearFilters = () => update({ category: 'all', tag: 'all', q: '' })

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        level="h1"
        eyebrow={isFiltering ? 'Filtered writing' : 'Writing'}
        title={headingTitle}
        description={
          isFiltering
            ? `${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'}${
                isCategoryFilter ? ` in the ${category} category` : ''
              }${isCategoryFilter && isTagFilter ? ' ·' : ''}${isTagFilter ? ` tagged #${tag}` : ''}.`
            : 'Practical guides on engineering, design, and the craft of building on the web for curious developers. '
        }
      />

      {/* The featured spotlight only belongs on the default (newest) view —
          once the list is sorted another way it would contradict the order. */}
      {featured && !hasFilters && safePage === 1 && sort === 'newest' && (
        <div className="mb-12">
          <FeaturedPost post={featured} />
        </div>
      )}

      {/* Filters toolbar — search, browse links, and sort aligned on one
          line, category chips beneath, unified in a single glass card. */}
      <div className="glass mb-10 rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <BlogSearch
            query={q}
            onQueryChange={(next) => update({ q: next })}
            className="min-w-0 flex-1 sm:max-w-md"
          />
          {/* relative anchors the popLayout-exiting count during its 250ms fade */}
          <div className="relative flex flex-wrap items-center gap-2 sm:shrink-0">
            {/* Keyed remount on count change → subtle fade/scale; the old
                count pops out of flow (popLayout) so controls don't jump. */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={filtered.length}
                aria-live="polite"
                initial={reduced ? false : { opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.9, y: 4 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-1.5 px-1 text-sm tabular-nums text-muted-foreground"
              >
                <FileText className="size-3.5 text-primary/70" aria-hidden />
                {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
              </motion.span>
            </AnimatePresence>
            <span className="inline-flex items-center gap-2">
              <Link
                to="/blog/tags"
                className={cn(pillClasses(false), 'text-primary hover:text-primary')}
              >
                <Tags className="size-3.5 text-primary" aria-hidden />
                All tags
              </Link>
              <Link
                to="/blog/categories"
                className={cn(pillClasses(false), 'text-primary hover:text-primary')}
              >
                <LayoutGrid className="size-3.5 text-primary" aria-hidden />
                Categories
              </Link>
            </span>
            <span aria-hidden className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className={cn(pillClasses(false), 'cursor-pointer')}>
                  <ArrowUpDown className="size-3.5 text-primary" aria-hidden />
                  Sort: {SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Newest'}
                  <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => update({ sort: value as BlogSort })}
                >
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {(hasMoreCategories || isTagFilter) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
            {hasMoreCategories && !isTagFilter && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {['all', ...categories.map((c) => c.category)].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={pillClasses(category === c)}
                    aria-pressed={category === c}
                    onClick={() => update({ category: c })}
                  >
                    {c === 'all' ? 'All' : c}
                  </button>
                ))}
              </div>
            )}
            {/* Tags stay a dedicated browse surface (/blog/tags) instead of a
                second filter row here. When a tag filter is active (from a tag
                link on a post), show a single clearable chip. */}
            {isTagFilter && (
              <button
                type="button"
                className={cn(pillClasses(true), 'text-xs', 'group inline-flex cursor-pointer')}
                aria-label={`Clear tag filter ${tag}`}
                onClick={() => update({ tag: 'all' })}
              >
                <Hash className="size-3" aria-hidden />
                {tag}
                <X className="size-3 transition-transform group-hover:rotate-90" aria-hidden />
              </button>
            )}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="glass flex flex-col items-center gap-5 rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No articles match your filters.</p>
          <NeonButton variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </NeonButton>
        </div>
      ) : (
        <>
          <AnimatedGrid
            items={pageItems}
            renderItem={(post) => <PostCard post={post} />}
            className="sm:grid-cols-2 lg:grid-cols-3"
          />
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
