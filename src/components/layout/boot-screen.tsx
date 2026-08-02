'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const SKIP_KEY = 'pf-boot-done'
const NAME = 'Devina'

/**
 * Cinematic boot sequence: the name reveals letter-by-letter while a mint
 * progress bar sweeps to 100%, then the overlay fades out. Runs once per
 * session (sessionStorage flag), never on reduced-motion devices, and is
 * capped under a second so it never feels like a spinner.
 */
export function BootScreen() {
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>('gone')
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (reduced) return
    let skipped = false
    try {
      skipped = sessionStorage.getItem(SKIP_KEY) === '1'
    } catch {
      /* storage unavailable — still boot */
    }
    if (skipped) return

    setPhase('loading')
    const start = performance.now()
    const DURATION = 720
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      setProgress(Math.round(t * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
        return
      }
      // Hold a beat, then leave.
      timers.current.push(
        window.setTimeout(() => {
          setPhase('leaving')
          timers.current.push(
            window.setTimeout(() => {
              setPhase('gone')
              try {
                sessionStorage.setItem(SKIP_KEY, '1')
              } catch {
                /* ignore */
              }
            }, 420),
          )
        }, 240),
      )
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      timers.current.forEach((id) => window.clearTimeout(id))
    }
  }, [reduced])

  if (phase === 'gone') return null

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'leaving' ? 0 : 1 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="flex overflow-hidden text-4xl font-bold tracking-tight sm:text-6xl">
        {NAME.split('').map((ch, i) => (
          <span key={i} className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch === 'D' ? <span className="text-gradient">{ch}</span> : ch}
            </motion.span>
          </span>
        ))}
        <motion.span
          className="text-gradient"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          .
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="w-44 overflow-hidden rounded-full border border-border/70 bg-muted/60">
        <div
          className="h-1 rounded-full bg-gradient-to-r from-primary to-accent-secondary transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground tabular-nums">
        {progress}%
      </p>
    </motion.div>
  )
}
