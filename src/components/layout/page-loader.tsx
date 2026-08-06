'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'
import { cn } from '@/lib/utils'

// Boot timeline (ms), matching the CSS animation: the hexagon strokes itself
// in over ~1.5s from first paint, the "R" fades in as the stroke wraps up,
// then the mark scales away with the overlay.
const DRAW_END_MS = 1500 // 200ms delay + 1300ms draw (matches globals.css)
const HOLD_MS = 650
const EXIT_MS = 370

/**
 * The brand mark: a hexagon outline that draws itself via a CSS
 * stroke-dash animation on an SVG `pathLength={100}` path (dash units are
 * normalized, so `0 100 → 100 100` draws the outline — SSR-safe, no JS path
 * measurement), with a gradient "R" monogram that fades in after the stroke
 * completes. Mirrors rubiin.is-a.dev's loader logo, re-skinned with the
 * futuristic palette. `animated={false}` renders the fully-drawn static
 * mark (used for reduced-motion visitors).
 */
function LoaderMark({
  idPrefix,
  animated = true,
  duration = 1.3,
  delay = 0.2,
  className,
}: {
  idPrefix: string
  animated?: boolean
  /** Stroke draw duration (s). Shorten for brief pending states. */
  duration?: number
  /** Stroke draw delay (s). */
  delay?: number
  className?: string
}) {
  // Each mount needs a unique gradient id (SVG ids are document-global).
  const gradId = `${idPrefix}-loader-stroke`
  // Letter fades in as the stroke wraps up (slightly before completion).
  const letterDelay = Math.max(0, delay + duration - 0.15)
  // Animation timing is driven by CSS custom properties so the boot and the
  // pending variants can share one mark with different pacing.
  const timing = {
    '--loader-draw-duration': `${duration}s`,
    '--loader-draw-delay': `${delay}s`,
    '--loader-letter-delay': `${letterDelay}s`,
  } as CSSProperties
  // CSS vars only resolve reliably through the `style` prop — presentation
  // attributes can silently drop them in some engines.
  const font = { fontFamily: 'var(--font-display), ui-sans-serif, system-ui, sans-serif' }
  return (
    <svg viewBox="0 0 100 100" className={cn('h-24 w-24', className)} aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--primary)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--accent-secondary)' }} />
        </linearGradient>
      </defs>
      <path
        d="M 50, 5 L 11, 27 L 11, 72 L 50, 95 L 89, 73 L 89, 28 Z"
        pathLength={100}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'loader-draw' : undefined}
        style={animated ? timing : undefined}
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="44"
        fontWeight="700"
        fill={`url(#${gradId})`}
        className={animated ? 'loader-letter' : undefined}
        style={animated ? { ...timing, ...font } : font}
      >
        R
      </text>
    </svg>
  )
}

/**
 * First-load cinematic, server-rendered so it's visible from the very first
 * paint — no waiting for hydration. The hexagon draws itself via CSS, the
 * "R" fades in, then the whole overlay scales away. Runs once per session
 * (sessionStorage flag); repeat sessions and reduced-motion visitors have it
 * hidden before first paint by an inline <head> script (`html.boot-skip`).
 * Decorative — content paints underneath, so clicks/scroll pass through as
 * soon as the fade begins.
 */
export function PageLoader() {
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>('loading')

  useEffect(() => {
    // Local timeout handles so cleanup never reads a ref's `.current`
    // directly (satisfies react-hooks/exhaustive-deps).
    const timeoutIds: number[] = []
    // Reduced motion: unmount immediately (the head script already hid the
    // loader pre-paint, so this is a no-op visually).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('gone')
      return
    }
    // Repeat visit in this session: head script hid it pre-paint; unmount now.
    if (readStorage('bootDone') === '1') {
      setPhase('gone')
      return
    }

    // Anchor the exit to the CSS draw's end (relative to page load), not to
    // hydration time — otherwise a slow hydration would stall the
    // fully-drawn mark before it can scale away.
    const leaveDelay = Math.max(0, DRAW_END_MS - performance.now()) + HOLD_MS
    const goneDelay = leaveDelay + EXIT_MS
    // Lock scroll while the boot covers the viewport (restored on cleanup
    // and when the overlay unmounts).
    document.body.style.overflow = 'hidden'
    timeoutIds.push(window.setTimeout(() => setPhase('leaving'), leaveDelay))
    timeoutIds.push(
      window.setTimeout(() => {
        setPhase('gone')
        document.body.style.overflow = ''
        writeStorage('bootDone', '1')
      }, goneDelay),
    )

    return () => {
      document.body.style.overflow = ''
      timeoutIds.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      id="pf-boot"
      aria-hidden
      className={cn(
        'fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-background',
        // Let clicks/scroll through once the fade begins — content is
        // already visible underneath, so never block interaction.
        phase === 'leaving' && 'pf-boot-exit',
      )}
    >
      {/* Ambient glow behind the mark */}
      <div aria-hidden className="absolute h-48 w-48 rounded-full bg-primary/15 blur-3xl" />

      <div className="pf-boot-mark">
        <LoaderMark idPrefix="boot" />
      </div>
    </div>
  )
}

/**
 * Route-transition loader (TanStack Router `pendingComponent`): the same
 * mark strokes itself in while a route chunk loads, so navigation shows a
 * branded moment instead of gray skeleton blocks. Uses a shorter draw so a
 * fast transition never flashes a half-drawn hexagon; renders a static mark
 * for reduced-motion visitors.
 */
export function PendingLoader() {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <LoaderMark idPrefix="pending" animated={!reduced} duration={0.45} delay={0} />
    </div>
  )
}
