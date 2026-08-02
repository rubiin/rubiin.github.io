'use client'

import { cn } from '@/lib/utils'

const ITEMS = [
  'TypeScript',
  'React',
  'Node.js',
  'Three.js',
  'TanStack Start',
  'Tailwind CSS',
  'PostgreSQL',
  'Prisma',
  'Motion',
  'MDX',
]

/**
 * Infinite scrolling strip of technologies. Uses the CSS `marquee` keyframe
 * (paused for reduced-motion users via the global media query) and is
 * decorative (`aria-hidden`).
 */
export function Marquee({ className }: { className?: string }) {
  const row = [...ITEMS, ...ITEMS]

  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden border-y bg-muted/30 py-4 motion-reduce:overflow-x-auto',
        className,
      )}
    >
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="text-sm font-medium uppercase tracking-widest text-muted-foreground"
          >
            {item}
            <span className="ml-8 text-primary">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
