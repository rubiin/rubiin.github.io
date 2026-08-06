import { Link } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import { AnimatedBorder } from '@/components/animations/animated-border'
import type { PostSummary } from '@/server/blog'

/** Large two-column featured post card with a rotating gradient border. */
export function FeaturedPost({ post }: { post: PostSummary }) {
  return (
    <Link to={`/blog/${post.slug}` as string} className="group block rounded-2xl">
      <AnimatedBorder className="h-full" surfaceClassName="grid overflow-hidden md:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/20 via-accent-secondary/20 to-chart-3/15 md:aspect-auto">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-6xl font-bold text-primary/25">
              {post.title.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-primary to-accent-secondary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-[0_4px_18px_-6px_color-mix(in_oklab,var(--primary)_70%,transparent)] dark:text-[#05060e]">
              Featured
            </span>
            <span className="text-xs font-medium text-muted-foreground">{post.category}</span>
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl group-hover:text-primary">
            {post.title}
          </h2>
          <p className="text-muted-foreground">{post.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5 text-primary/70" aria-hidden />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5 text-primary/70" aria-hidden />
              {post.readingTime} min read
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Read article
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </AnimatedBorder>
    </Link>
  )
}
