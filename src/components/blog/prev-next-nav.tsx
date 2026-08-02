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
      className="mt-14 grid gap-4 border-t pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          to={`/blog/${prev.slug}` as string}
          className="group flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-primary/40"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Newer
          </span>
          <span className="font-medium group-hover:text-primary">{prev.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link
          to={`/blog/${next.slug}` as string}
          className="group flex flex-col gap-1 rounded-lg border p-4 text-right transition-colors hover:border-primary/40"
        >
          <span className="inline-flex items-center justify-end gap-1.5 text-xs font-medium text-muted-foreground">
            Older
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="font-medium group-hover:text-primary">{next.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
    </nav>
  )
}
