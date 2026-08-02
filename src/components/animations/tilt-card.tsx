'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * 3D tilt card: rotates toward the pointer with perspective, springs back
 * on leave. Disabled (rendered flat) for reduced motion.
 */
export function TiltCard({
  children,
  maxTilt = 8,
  className,
}: {
  children: ReactNode
  maxTilt?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ref.current.style.transform = `perspective(900px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`
  }

  const onPointerLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileHover={{ scale: reduced ? 1 : 1.01 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
    </motion.div>
  )
}
