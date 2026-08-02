'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * Magnetic hover: the wrapped element drifts toward the cursor within a
 * 40px radius and springs back on leave. Disabled for reduced motion.
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

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    const dist = Math.hypot(x, y)
    if (dist > 40) {
      ref.current.style.transform = 'translate(0px, 0px)'
      return
    }
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const onPointerLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileHover={{ scale: reduced ? 1 : 1.03 }}
      whileTap={{ scale: reduced ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  )
}
