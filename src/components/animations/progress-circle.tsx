'use client'

import { useEffect, useId, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Animated proficiency ring: a gradient-stroked SVG circle that fills to
 * `value` percent once scrolled into view. The stroke offset and number are
 * driven imperatively via refs so the animation never re-renders React
 * (rerender-defer-reads). Starts empty (0%) on both server and client so
 * hydration always matches; reduced-motion users jump straight to the final
 * value inside the effect.
 */
export function ProgressCircle({
  value,
  label,
  size = 96,
  stroke = 7,
  className,
}: {
  value: number
  label?: string
  size?: number
  stroke?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const gradientId = useId()

  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    if (!inView) return
    const setProgress = (p: number) => {
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = String(circumference * (1 - p / 100))
      }
      if (numberRef.current) numberRef.current.textContent = String(Math.round(p))
    }
    if (reduced) {
      setProgress(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setProgress,
    })
    return () => controls.stop()
  }, [inView, value, reduced, circumference])

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label ? `${label}: ${value}%` : `${value}%`}
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent-secondary)" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="color-mix(in oklab, var(--muted) 70%, transparent)"
          strokeWidth={stroke}
        />
        {/* Gradient fill — start empty, JS animates the offset */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            filter: 'drop-shadow(0 0 6px color-mix(in oklab, var(--primary) 55%, transparent))',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-lg font-semibold tracking-tight tabular-nums">
          <span ref={numberRef}>0</span>
          <span className="ml-px text-[0.7em] text-muted-foreground">%</span>
        </span>
      </div>
    </div>
  )
}
