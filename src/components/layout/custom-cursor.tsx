'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/** Elements the cursor reacts to. `data-cursor-label="View"` adds a label. */
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, [data-cursor], [data-cursor-label], [data-cursor-label] *'

/**
 * Custom cursor: a crisp dot that tracks the pointer instantly plus a ring
 * that trails on a spring. The ring expands and can show a contextual label
 * ("View", "Open", "Read"…) over interactive elements via `data-cursor-label`,
 * drifts magnetically toward the hovered target, and spawns a ripple on
 * click. Hidden on coarse-pointer (touch) devices; reduced to a plain dot
 * for reduced-motion users. Pure motion-value driven — no re-renders.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const reduced = useReducedMotion()
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 320, damping: 26, mass: 0.55 })
  const ringY = useSpring(y, { stiffness: 320, damping: 26, mass: 0.55 })
  const magX = useSpring(0, { stiffness: 200, damping: 20 })
  const magY = useSpring(0, { stiffness: 200, damping: 20 })

  // Feature-detect: coarse pointers (touch) get the native cursor.
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled || reduced) return
    document.documentElement.dataset.cursor = 'active'

    const setHover = (el: Element | null) => {
      const ring = ringRef.current
      if (!ring) return
      if (!el) {
        ring.dataset.hover = 'false'
        magX.set(0)
        magY.set(0)
        if (labelRef.current) labelRef.current.textContent = ''
        return
      }
      ring.dataset.hover = 'true'
      const label = el.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel
      if (labelRef.current) labelRef.current.textContent = label ?? ''
      // Magnetic pull toward the element center (subtle).
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      magX.set((cx - x.get()) * 0.12)
      magY.set((cy - y.get()) * 0.12)
    }

    const onPointerMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as Element | null
      setHover(target?.closest<HTMLElement>(INTERACTIVE_SELECTOR) ?? null)
    }

    const onPointerDown = (e: PointerEvent) => {
      const layer = document.querySelector<HTMLDivElement>('[data-cursor-ripples]')
      if (!layer) return
      const ripple = document.createElement('span')
      ripple.className =
        'pointer-events-none absolute size-8 rounded-full border border-primary/70'
      ripple.style.left = `${e.clientX}px`
      ripple.style.top = `${e.clientY}px`
      ripple.style.marginLeft = '-1rem'
      ripple.style.marginTop = '-1rem'
      ripple.style.animation = 'cursor-ripple 0.5s ease-out forwards'
      layer.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove())
    }

    const onPointerLeaveDoc = () => {
      const root = document.querySelector<HTMLDivElement>('[data-cursor-root]')
      if (root) root.dataset.visible = 'false'
    }
    const onPointerEnterDoc = () => {
      const root = document.querySelector<HTMLDivElement>('[data-cursor-root]')
      if (root) root.dataset.visible = 'true'
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerover', onPointerOver, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('pointerleave', onPointerLeaveDoc)
    document.addEventListener('pointerenter', onPointerEnterDoc)

    return () => {
      document.documentElement.removeAttribute('data-cursor')
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerleave', onPointerLeaveDoc)
      document.removeEventListener('pointerenter', onPointerEnterDoc)
    }
  }, [enabled, reduced, x, y, magX, magY])

  if (!enabled) return null

  if (reduced) {
    // Reduced motion: plain dot, no trailing ring or effects.
    return (
      <div data-cursor-root aria-hidden className="pointer-events-none fixed inset-0 z-[120]">
        <motion.div
          className="fixed left-0 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
          style={{ x, y }}
        />
      </div>
    )
  }

  return (
    <div
      data-cursor-root
      data-visible="true"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[120] opacity-100 transition-opacity duration-300 data-[visible=false]:opacity-0"
    >
      {/* Instant dot */}
      <motion.div
        className="fixed left-0 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ x, y }}
      />

      {/* Spring-lagged ring; expands over interactive elements */}
      <motion.div
        ref={ringRef}
        data-hover="false"
        className="group fixed left-0 top-0"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          style={{ x: magX, y: magY }}
          className="-translate-x-1/2 -translate-y-1/2"
        >
          <div className="flex size-9 items-center justify-center rounded-full border border-white/80 mix-blend-difference transition-transform duration-300 ease-out group-data-[hover=true]:scale-[2.2]">
            {/* Contextual label, visible only when expanded */}
            <span
              ref={labelRef}
              className="whitespace-nowrap text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition-opacity duration-200 group-data-[hover=true]:opacity-100"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Click ripples */}
      <div data-cursor-ripples className="absolute inset-0" />
    </div>
  )
}
