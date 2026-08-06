'use client'

import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const PARTICLE_COUNT = 10
const PARTICLE_COLORS = [
  'var(--primary)',
  'var(--accent-secondary)',
  'var(--chart-3)',
  'var(--primary)',
  'var(--accent-secondary)',
]

type Burst = { id: number; x: number; y: number }

const VARIANTS = {
  primary: cn(
    'bg-gradient-to-r from-primary to-accent-secondary text-primary-foreground',
    'shadow-[0_10px_36px_-12px_color-mix(in_oklab,var(--primary)_65%,transparent)]',
    'hover:shadow-[0_12px_48px_-10px_color-mix(in_oklab,var(--accent-secondary)_70%,transparent)]',
  ),
  outline: cn(
    'glass text-foreground',
    'hover:border-transparent hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_55%,transparent),0_10px_36px_-12px_color-mix(in_oklab,var(--primary)_55%,transparent)]',
  ),
  ghost: 'bg-transparent text-muted-foreground hover:text-foreground',
} as const

const SIZES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
} as const

const RADII: Record<keyof typeof SIZES, string> = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-xl',
}

type NeonButtonProps = {
  children: ReactNode
  /** Internal TanStack Router link target. */
  to?: string
  /** External URL (renders an anchor, opens in a new tab). */
  href?: string
  /** Adds the download attribute to external links (same-tab). */
  download?: boolean
  onClick?: () => void
  /** Native button type (submit forms). Only applies to `<button>` output. */
  type?: 'button' | 'submit'
  /** Only meaningful when rendered as a `<button>` (to/href render links). */
  disabled?: boolean
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  className?: string
  ariaLabel?: string
}

/**
 * The hero CTA: a springy, glowing button with a liquid sheen sweep, icon
 * micro-motion, an expanding click ripple, and a particle burst at the press
 * point. The sheen + ripple live in one layer clipped to the button's border
 * radius; particles fly beyond it. All flourish layers are
 * `pointer-events-none` and skipped for reduced-motion users.
 */
export function NeonButton({
  children,
  to,
  href,
  download = false,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'lg',
  className,
  ariaLabel,
}: NeonButtonProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const [bursts, setBursts] = useState<Burst[]>([])

  const spawnBurst = (clientX: number, clientY: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    // Keyboard clicks carry no coordinates — burst from center.
    const px = Number.isFinite(x) ? x : rect.width / 2
    const py = Number.isFinite(y) ? y : rect.height / 2
    const id = nextId.current++
    setBursts((prev) => [...prev, { id, x: px, y: py }])
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id))
    }, 700)
  }

  const handlePointerDown = (e: ReactPointerEvent) => {
    if (reduced) return
    spawnBurst(e.clientX, e.clientY)
  }

  const handleClick = () => {
    if (!reduced) spawnBurst(Number.NaN, Number.NaN)
    onClick?.()
  }

  const inner = cn(
    'relative inline-flex items-center justify-center gap-2 overflow-hidden font-medium whitespace-nowrap',
    'transition-[box-shadow,color,background-color] duration-300 outline-none',
    'focus-visible:ring-[3px] focus-visible:ring-ring/60',
    'disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    '[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out',
    'group-hover/neon:[&_svg]:translate-x-0.5',
    VARIANTS[variant],
    SIZES[size],
  )

  const linkProps = href
    ? ({
        href,
        target: download ? undefined : '_blank',
        rel: 'noreferrer',
        ...(download ? { download: true } : {}),
      } as const)
    : undefined

  return (
    <motion.div
      ref={ref}
      className={cn('group/neon relative inline-flex', RADII[size], className)}
      onPointerDown={handlePointerDown}
      whileHover={{ scale: reduced ? 1 : 1.03 }}
      whileTap={{ scale: reduced ? 1 : 0.965 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      {/* Clipped effect layer: sheen + ripple, shaped to the button */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
      >
        {/* Liquid sheen sweep on hover */}
        <span
          className={cn(
            'absolute inset-0 -translate-x-[130%] skew-x-[-16deg]',
            'bg-gradient-to-r from-transparent via-white/25 to-transparent',
            'transition-transform duration-700 ease-out group-hover/neon:translate-x-[130%]',
            reduced && 'hidden',
          )}
        />
        <AnimatePresence>
          {bursts.map((burst) => (
            <motion.span
              key={burst.id}
              className="absolute size-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25"
              style={{ left: burst.x, top: burst.y }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </AnimatePresence>
      </span>

      {/* Particle burst — flies beyond the button bounds */}
      <AnimatePresence>
        {bursts.map((burst) => (
          <span
            key={`p-${burst.id}`}
            aria-hidden
            className="pointer-events-none absolute z-10"
            style={{ left: burst.x, top: burst.y }}
          >
            {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
              const angle = (i / PARTICLE_COUNT) * Math.PI * 2
              const distance = 34 + (i % 4) * 12
              const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length]
              return (
                <motion.span
                  key={i}
                  className="absolute size-1.5 rounded-full"
                  style={{
                    background: color,
                    boxShadow: '0 0 6px currentColor',
                    color,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              )
            })}
          </span>
        ))}
      </AnimatePresence>

      {to ? (
        <Link to={to} onClick={handleClick} aria-label={ariaLabel} className={inner}>
          {children}
        </Link>
      ) : href ? (
        <a
          href={href}
          onClick={handleClick}
          aria-label={ariaLabel}
          className={inner}
          {...linkProps}
        >
          {children}
        </a>
      ) : (
        <button
          type={type}
          onClick={handleClick}
          aria-label={ariaLabel}
          disabled={disabled}
          className={inner}
        >
          {children}
        </button>
      )}
    </motion.div>
  )
}
