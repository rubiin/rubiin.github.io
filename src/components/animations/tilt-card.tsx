'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'

/**
 * 3D tilt card: rotates toward the pointer with perspective, springs back
 * on leave. Motion values keep the rotation composable with hover scale.
 * Rendered flat for reduced motion.
 */
export function TiltCard({
  children,
  maxTilt = 8,
  className,
  cursorLabel,
}: {
  children: ReactNode
  maxTilt?: number
  className?: string
  /** Shown by the custom cursor when hovering this card. */
  cursorLabel?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, (v) => -v * maxTilt), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(px, (v) => v * maxTilt), {
    stiffness: 200,
    damping: 20,
  })

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onPointerLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      data-cursor-label={cursorLabel}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: reduced ? 1 : 1.01 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}
