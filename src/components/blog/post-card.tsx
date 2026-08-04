import { Link } from '@tanstack/react-router'
import { CalendarDays, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { PostSummary } from '@/server/blog'

/**
 * Blog post card: cover (or gradient), category badge, date, title,
 * description, tags, reading time. Hover: lift + image scale.
 */
export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      to={`/blog/${post.slug}` as string}
      className="content-visibility group block h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/15 via-accent/20 to-chart-1/10">
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
              <CalendarDays className="size-3.5" aria-hidden />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {post.readingTime} min read
            </span>
          </div>

          <h2 className="text-lg font-semibold tracking-tight group-hover:text-primary">
            {post.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{post.description}</p>

          {post.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {post.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
