import { Link } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import { AnimatedBorder } from '@/components/animations/animated-border'
import type { PostSummary } from '@/server/blog'

/**
 * Blog post card: cover (or gradient), category badge, date, title,
 * description, tags, reading time. Rotating gradient border + lift glow.
 */
export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      to={`/blog/${post.slug}` as string}
      className="content-visibility group block h-full rounded-2xl"
    >
      <AnimatedBorder className="h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-[inherit]">
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/15 via-accent-secondary/15 to-chart-3/10">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-4xl font-bold text-primary/30">
                {post.title.slice(0, 1)}
              </div>
            )}
            <span className="absolute top-3 left-3 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium backdrop-blur">
              {post.category}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
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

            <h2 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary">
              {post.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{post.description}</p>

            {post.tags.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/50 bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <span className="inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
              Read article
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </article>
      </AnimatedBorder>
    </Link>
  )
}
