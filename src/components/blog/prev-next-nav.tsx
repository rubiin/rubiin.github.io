import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { PostSummary } from '@/server/blog'

/** Previous / next article footer links (by date). */
export function PrevNextNav({
  prev,
  next,
}: {
  prev?: PostSummary | null
  next?: PostSummary | null
}) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Previous and next articles"
      className="mt-14 grid gap-4 border-t border-border/40 pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          to={`/blog/${prev.slug}` as string}
          className="glass group flex flex-col gap-1 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_40px_-16px_color-mix(in_oklab,var(--primary)_50%,transparent)]"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ArrowLeft className="size-3.5 text-primary transition-transform duration-300 group-hover:-translate-x-0.5" />
            Newer
          </span>
          <span className="font-display font-medium group-hover:text-primary">{prev.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link
          to={`/blog/${next.slug}` as string}
          className="glass group flex flex-col gap-1 rounded-2xl p-5 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_40px_-16px_color-mix(in_oklab,var(--accent-secondary)_50%,transparent)]"
        >
          <span className="inline-flex items-center justify-end gap-1.5 text-xs font-medium text-muted-foreground">
            Older
            <ArrowRight className="size-3.5 text-primary transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
          <span className="font-display font-medium group-hover:text-primary">{next.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
    </nav>
  )
}
