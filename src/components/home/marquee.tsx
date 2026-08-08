'use client'

import { cn } from '@/lib/utils'

const ITEMS = [
  'TypeScript',
  'React',
  'Node.js',
  'Three.js',
  'TanStack Start',
  'Uno CSS',
  'PostgreSQL',
  'Prisma',
  'Motion',
  'MDX',
]

/**
 * Infinite scrolling strip of technologies — a glass band with soft edge
 * fades and neon separators. Uses the CSS `marquee` keyframe (paused for
 * reduced-motion users via the global media query) and is decorative
 * (`aria-hidden`).
 */
export function Marquee({ className }: { className?: string }) {
  const row = [...ITEMS, ...ITEMS]

  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden border-y border-border/40 bg-muted/20 py-4 backdrop-blur-sm motion-reduce:overflow-x-auto',
        className,
      )}
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            // oxlint-disable-next-line react/no-array-index-key -- static doubled list, never reordered
            key={`${item}-${i}`}
            className="font-display text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground"
          >
            {item}
            <span className="ml-10 inline-block size-1.5 rounded-full bg-gradient-to-r from-primary to-accent-secondary shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_80%,transparent)] align-middle" />
          </span>
        ))}
      </div>
    </div>
  )
}
