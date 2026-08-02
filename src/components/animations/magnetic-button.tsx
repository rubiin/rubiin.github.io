'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/**
 * Magnetic hover: the wrapped element drifts toward the cursor within a
 * 40px radius and springs back on leave. Driven by motion values so the
 * translate composes with whileHover/whileTap instead of clobbering them.
 * Disabled for reduced motion.
 */
export function MagneticButton({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18 })
  const springY = useSpring(y, { stiffness: 260, damping: 18 })

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    if (Math.hypot(dx, dy) > 40) {
      x.set(0)
      y.set(0)
      return
    }
    x.set(dx * strength)
    y.set(dy * strength)
  }

  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      whileHover={{ scale: reduced ? 1 : 1.03 }}
      whileTap={{ scale: reduced ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      {children}
    </motion.div>
  )
}
