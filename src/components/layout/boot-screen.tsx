'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { readStorage, writeStorage } from '@/lib/storage'

const NAME = 'Rubin'
// If hydration/JS execution has already taken this long by the time the
// boot effect runs, the page is on a slow device or connection — skip the
// cinematic so the hero paints immediately instead of hiding behind the
// overlay (LCP).
const SLOW_LOAD_MS = 1200

/**
 * Cinematic boot sequence: the name reveals letter-by-letter while a mint
 * progress bar sweeps to 100%, then the overlay fades out. Runs once per
 * session (sessionStorage flag), never on reduced-motion devices, and is
 * capped under a second so it never feels like a spinner. Skipped entirely
 * on slow loads (see SLOW_LOAD_MS) so LCP isn't held hostage by the boot.
 */
export function BootScreen() {
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>('gone')
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    // Local timeout handles so cleanup never reads a ref's `.current`
    // directly (satisfies react-hooks/exhaustive-deps).
    const timeoutIds: number[] = []
    if (reduced) return
    if (readStorage('bootDone') === '1') return

    // Slow load (big bundle, throttled connection, old device): skip the
    // boot so first paint isn't covered by an opaque overlay.
    if (performance.now() > SLOW_LOAD_MS) {
      writeStorage('bootDone', '1')
      return
    }

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
      timeoutIds.push(
        window.setTimeout(() => {
          setPhase('leaving')
          timeoutIds.push(
            window.setTimeout(() => {
              setPhase('gone')
              writeStorage('bootDone', '1')
            }, 360),
          )
        }, 200),
      )
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      timeoutIds.forEach((id) => window.clearTimeout(id))
    }
  }, [reduced])

  if (phase === 'gone') return null

  return (
    <motion.div
      aria-hidden
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-background${
        // Let clicks/scroll through once the fade begins — content is
        // already visible underneath, so never block interaction.
        phase === 'leaving' ? ' pointer-events-none' : ''
      }`}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'leaving' ? 0 : 1 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="flex overflow-hidden text-4xl font-bold tracking-tight sm:text-6xl">
        {NAME.split('').map((ch, i) => (
          // oxlint-disable-next-line react/no-array-index-key -- static name chars
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
