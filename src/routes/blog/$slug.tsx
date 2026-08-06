import { useRef } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { CalendarDays, Clock, Hash, User } from 'lucide-react'
import { MDXContent } from '@/components/blog/mdx-content'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { ShareButtons } from '@/components/blog/share-buttons'
import { RelatedPosts } from '@/components/blog/related-posts'
import { PrevNextNav } from '@/components/blog/prev-next-nav'
import { PostComments } from '@/components/blog/post-comments'
import { LazyKatexCss } from '@/components/blog/lazy-katex-css'
import { ImageZoom } from '@/components/blog/image-zoom'
import { BlogReadingGlow } from '@/components/blog/blog-reading-glow'
import { AnimatedBorder } from '@/components/animations/animated-border'
import { KineticTitle } from '@/components/animations/kinetic-title'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/data/site'
import { buildMeta } from '@/lib/seo'
import { getPost, getPostNeighbors, getRelatedPosts } from '@/server/blog'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const [post, related, neighbors] = await Promise.all([
      getPost({ data: params.slug }),
      getRelatedPosts({ data: params.slug }),
      getPostNeighbors({ data: params.slug }),
    ])
    if (!post) throw notFound()

    return { post, related, ...neighbors }
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post
    const path = `/blog/${post?.slug ?? ''}`
    const url = `${siteConfig.url}${path}`
    return {
      meta: buildMeta({
        title: `${post?.title ?? 'Article'} — ${siteConfig.name}`,
        description: post?.description ?? siteConfig.seo.description,
        path,
        type: 'article',
      }),
      scripts: post
        ? [
            {
              type: 'application/ld+json',
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: post.title,
                description: post.description,
                datePublished: post.date,
                author: {
                  '@type': 'Person',
                  name: siteConfig.name,
                  url: siteConfig.url,
                  image: siteConfig.avatar,
                },
                publisher: {
                  '@type': 'Person',
                  name: siteConfig.name,
                },
                mainEntityOfPage: url,
              }),
            },
          ]
        : [],
    }
  },
  pendingComponent: PostSkeleton,
  errorComponent: PostError,
  component: BlogPostPage,
})

function BlogPostPage() {
  const { post, related, newer, older } = Route.useLoaderData()
  const url = `${siteConfig.url}/blog/${post.slug}`
  const articleRef = useRef<HTMLElement>(null)

  return (
    <article ref={articleRef}>
      <LazyKatexCss />
      <BlogReadingGlow targetRef={articleRef} />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            <span
              aria-hidden
              className="h-px w-8 bg-gradient-to-r from-primary to-accent-secondary shadow-[0_0_8px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
            />
            Article
            <span
              aria-hidden
              className="h-px w-8 bg-gradient-to-r from-accent-secondary to-primary shadow-[0_0_8px_color-mix(in_oklab,var(--accent-secondary)_70%,transparent)]"
            />
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            <KineticTitle text={post.title} />
          </h1>
          {/* Category kicker below the title — clickable, solid gradient chip, so categories read differently from the muted tags */}
          <div className="mt-4 flex justify-center">
            <Badge
              asChild
              className="bg-gradient-to-r from-primary to-accent-secondary text-primary-foreground shadow-[0_4px_18px_-6px_color-mix(in_oklab,var(--primary)_70%,transparent)] dark:text-[#05060e]"
            >
              <Link
                to="/blog"
                search={{ category: post.category, tag: 'all', q: '', page: 1, sort: 'newest' }}
              >
                {post.category}
              </Link>
            </Badge>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <span className="glass inline-flex items-center gap-2 rounded-full py-1 pr-3.5 pl-1.5">
              {siteConfig.avatar ? (
                <img
                  src={siteConfig.avatar}
                  alt=""
                  loading="lazy"
                  className="size-6 rounded-full object-cover ring-2 ring-primary/25"
                />
              ) : (
                <User className="size-4 text-primary/70" aria-hidden />
              )}
              <span>{siteConfig.name}</span>
            </span>
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5">
              <CalendarDays className="size-4 text-primary/70" aria-hidden />
              {formatDate(post.date)}
            </span>
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5">
              <Clock className="size-4 text-primary/70" aria-hidden />
              {post.readingTime} min read
            </span>
          </div>
        </header>

        {/* Cover */}
        <AnimatedBorder
          className="mx-auto mt-10 w-full max-w-4xl"
          surfaceClassName="overflow-hidden"
        >
          {post.coverImage ? (
            <ImageZoom src={post.coverImage} alt={post.title} className="aspect-[16/9] w-full" />
          ) : (
            <div className="aspect-[16/9] w-full bg-gradient-to-br from-primary/15 via-accent-secondary/15 to-chart-3/10" />
          )}
        </AnimatedBorder>

        {/* Body + TOC */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl lg:mx-0">
            <MDXContent code={post.mdx} />
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents toc={post.toc} />
              <div className="mt-8">
                <ShareButtons url={url} title={post.title} />
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile share */}
        <div className="mx-auto mt-10 flex max-w-2xl justify-center lg:hidden">
          <ShareButtons url={url} title={post.title} />
        </div>

        {/* Tags at the end of the post — clickable, filter the blog by tag */}
        {post.tags.length > 0 && (
          <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to="/blog"
                search={{ category: 'all', tag, q: '', page: 1, sort: 'newest' }}
                className="glass group inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_20px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
              >
                <Hash className="size-3 text-primary" aria-hidden />
                {tag}
              </Link>
            ))}
          </div>
        )}

        <PrevNextNav prev={newer} next={older} />
        <RelatedPosts posts={related} />
        <PostComments slug={post.slug} />
      </div>
    </article>
  )
}

function PostSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-full max-w-lg" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="mt-10 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  )
}

function PostError({ error }: { error: Error }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        {error.message || 'This article could not be loaded. Please try again.'}
      </p>
      <Button asChild variant="outline">
        <a href="/blog">Back to blog</a>
      </Button>
    </div>
  )
}
