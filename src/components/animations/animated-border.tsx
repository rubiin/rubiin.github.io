import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Animated gradient border wrapper. A rotating conic gradient (CSS-driven
 * via the registered `--border-angle` custom property) sits one pixel
 * outside an inset card surface, so the ring is always faintly visible and
 * lights up fully on hover. Purely decorative; surfaces stay opaque so text
 * remains readable.
 */
export function AnimatedBorder({
  children,
  className,
  surfaceClassName,
  always = false,
}: {
  children: ReactNode
  className?: string
  surfaceClassName?: string
  /** Keep the rotating border fully lit even without hover. */
  always?: boolean
}) {
  return (
    <div data-always={always || undefined} className={cn('animated-border rounded-2xl', className)}>
      <div className={cn('relative h-full w-full rounded-[inherit] bg-card', surfaceClassName)}>
        {children}
      </div>
    </div>
  )
}
