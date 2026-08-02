'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Site-wide ambient background: drifting aurora blobs, an interactive
 * mouse-follow glow, a masked blueprint grid, and animated film grain.
 * Pure CSS + one rAF-throttled pointer listener — no re-renders on move.
 * Purely decorative (`aria-hidden`); animations pause under reduced motion.
 */
export function AmbientBackground() {
  const glowRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Track the pointer into CSS vars consumed by .mouse-glow.
  useEffect(() => {
    if (!mounted) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = glowRef.current
        if (!el) return
        el.style.setProperty('--mx', `${e.clientX}px`)
        el.style.setProperty('--my', `${e.clientY}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Aurora blobs — slow, offset drift */}
      <div className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-primary/10 blur-3xl motion-reduce:animate-none animate-[aurora-drift_26s_ease-in-out_infinite]" />
      <div className="absolute top-1/4 -right-44 size-[30rem] rounded-full bg-accent-secondary/10 blur-3xl motion-reduce:animate-none animate-[aurora-drift_32s_ease-in-out_infinite_-6s]" />
      <div className="absolute -bottom-52 left-1/4 size-[30rem] rounded-full bg-chart-3/10 blur-3xl motion-reduce:animate-none animate-[aurora-drift_38s_ease-in-out_infinite_-12s]" />

      {/* Interactive mouse glow (CSS vars set by JS) */}
      <div ref={glowRef} className="mouse-glow absolute inset-0" />

      {/* Blueprint grid, masked to a soft ellipse */}
      <div className="grid-bg absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black_15%,transparent_75%)]" />

      {/* Film grain */}
      <div className="noise-bg absolute -inset-[30%] opacity-[0.04] mix-blend-overlay motion-reduce:animate-none animate-[grain-shift_1.1s_steps(4)_infinite]" />
    </div>
  )
}
