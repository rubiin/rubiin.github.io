import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Blog pagination: numbered page pills updating the `?page=` search param
 * via the callback. Renders nothing when there's a single page. Active page
 * wears the gradient fill; the rest are glass.
 */
export function BlogPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const arrowClasses = cn(
    'flex size-9 items-center justify-center rounded-full border transition-all duration-300',
    'disabled:pointer-events-none disabled:opacity-40',
    'border-border/40 bg-muted/30 text-foreground backdrop-blur-sm hover:border-primary/40 hover:text-primary hover:shadow-[0_0_20px_-8px_color-mix(in_oklab,var(--primary)_50%,transparent)]',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
  )

  return (
    <nav aria-label="Blog pagination" className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        className={arrowClasses}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-label={`Page ${p}`}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'flex size-9 items-center justify-center rounded-full border text-sm font-medium transition-all duration-300',
            'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
            p === page
              ? 'border-transparent bg-gradient-to-r from-primary to-accent-secondary text-primary-foreground shadow-[0_6px_24px_-8px_color-mix(in_oklab,var(--primary)_70%,transparent)] dark:text-[#05060e]'
              : 'border-border/40 bg-muted/30 text-muted-foreground backdrop-blur-sm hover:border-primary/40 hover:text-foreground',
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        className={arrowClasses}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
