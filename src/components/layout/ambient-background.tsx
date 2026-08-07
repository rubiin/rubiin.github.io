'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

// Decorative parallax aurora blobs, mouse glow, grid, particles, streaks, grain.
export function AmbientBackground() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => setMounted(true), [])

  // Deterministic field seeded from the index — stable across SSR/client.
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const seed = (i * 2654435761) % 10000
        const rand = (min: number, max: number) =>
          min + (((seed * (i + 7)) % 997) / 997) * (max - min)
        return {
          left: rand(2, 98),
          top: rand(4, 96),
          size: rand(2, 5),
          duration: rand(9, 20),
          delay: -rand(0, 12),
          hue: i % 3,
        }
      }),
    [],
  )

  // Scroll-driven parallax at different depths; zeroed under reduced motion.
  const { scrollY } = useScroll()
  const yBlobs = useTransform(scrollY, [0, 2400], reduced ? [0, 0] : [0, -140])
  const yGrid = useTransform(scrollY, [0, 2400], reduced ? [0, 0] : [0, 70])
  const yParticles = useTransform(scrollY, [0, 2400], reduced ? [0, 0] : [0, -240])

  // One pointer listener drives both glow layers via CSS vars on the root.
  useEffect(() => {
    if (!mounted) return
    if (reduced) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = rootRef.current
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
  }, [mounted, reduced])

  if (!mounted) return null

  const particleColors = [
    'color-mix(in oklab, var(--primary) 70%, transparent)',
    'color-mix(in oklab, var(--accent-secondary) 70%, transparent)',
    'color-mix(in oklab, var(--chart-3) 60%, transparent)',
  ]

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div style={{ y: yBlobs }} className="absolute inset-0">
        <div className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-primary/10 blur-3xl motion-reduce:animate-none animate-[aurora-drift_26s_ease-in-out_infinite]" />
        <div className="absolute top-1/4 -right-44 size-[30rem] rounded-full bg-accent-secondary/10 blur-3xl motion-reduce:animate-none animate-[aurora-drift_32s_ease-in-out_infinite_-6s]" />
        <div className="absolute -bottom-52 left-1/4 size-[30rem] rounded-full bg-chart-3/10 blur-3xl motion-reduce:animate-none animate-[aurora-drift_38s_ease-in-out_infinite_-12s]" />
      </motion.div>

      <div className="mouse-glow absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--accent-secondary) 12%, transparent), transparent 70%)',
        }}
      />

      <motion.div style={{ y: yGrid }} className="absolute inset-0">
        <div className="grid-bg absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black_15%,transparent_75%)]" />
      </motion.div>

      <motion.div style={{ y: yParticles }} className="absolute inset-0">
        {particles.map((p, i) => (
          <span
            // oxlint-disable-next-line react/no-array-index-key -- static decorative field, never reordered
            key={i}
            className="absolute rounded-full motion-reduce:animate-none animate-[float-soft_ease-in-out_infinite]"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: particleColors[p.hue],
              boxShadow: `0 0 ${p.size * 3}px ${particleColors[p.hue]}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </motion.div>

      <div className="absolute top-[18%] left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-primary/40 to-transparent motion-reduce:animate-none animate-[streak-sweep_9s_ease-in-out_infinite]" />
      <div className="absolute top-[62%] left-0 h-px w-1/4 bg-gradient-to-r from-transparent via-accent-secondary/35 to-transparent motion-reduce:animate-none animate-[streak-sweep_13s_ease-in-out_4s_infinite]" />
      <div className="absolute top-[38%] left-0 h-[2px] w-1/5 bg-gradient-to-r from-transparent via-chart-3/25 to-transparent motion-reduce:animate-none animate-[streak-sweep_11s_ease-in-out_7s_infinite]" />

      <div className="noise-bg absolute -inset-[30%] opacity-[0.04] mix-blend-overlay motion-reduce:animate-none animate-[grain-shift_1.1s_steps(4)_infinite]" />
    </div>
  )
}
