'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'
import { cn } from '@/lib/utils'

// Boot timeline (ms) matching the CSS draw animation in globals.css.
const DRAW_END_MS = 1500
const HOLD_MS = 650
const EXIT_MS = 370

// Hexagon mark that stroke-draws itself via a CSS animation; animated={false} renders it static.
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
  // Unique gradient id per mount (SVG ids are document-global).
  const gradId = `${idPrefix}-loader-stroke`
  // Letter fades in just before the stroke completes.
  const letterDelay = Math.max(0, delay + duration - 0.15)
  // Timing via CSS custom properties so boot and pending share one mark.
  const timing = {
    '--loader-draw-duration': `${duration}s`,
    '--loader-draw-delay': `${delay}s`,
    '--loader-letter-delay': `${letterDelay}s`,
  } as CSSProperties
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

// First-load cinematic: stroke draws, R fades in, overlay scales away; once per session.
export function PageLoader() {
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>('loading')

  useEffect(() => {
    // Timeout ids kept in an array so cleanup never touches a ref's .current.
    const timeoutIds: number[] = []
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('gone')
      return
    }
    if (readStorage('bootDone') === '1') {
      setPhase('gone')
      return
    }

    // Anchor the exit to the CSS draw's end, not hydration time.
    const leaveDelay = Math.max(0, DRAW_END_MS - performance.now()) + HOLD_MS
    const goneDelay = leaveDelay + EXIT_MS
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
        phase === 'leaving' && 'pf-boot-exit',
      )}
    >
      <div aria-hidden className="absolute h-48 w-48 rounded-full bg-primary/15 blur-3xl" />

      <div className="pf-boot-mark">
        <LoaderMark idPrefix="boot" />
      </div>
    </div>
  )
}

// Route-transition loader (TanStack Router `pendingComponent`), shorter draw.
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
