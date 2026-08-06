'use client'

import { motion, useReducedMotion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Word-by-word masked kinetic reveal for headings. Words rise out of an
 * overflow mask on scroll into view. Renders identical DOM on both
 * hydration paths (reduced motion is fully static), so it is safe to use
 * in server-rendered headings.
 */
export function KineticTitle({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion()
  const words = text.split(' ')

  return (
    <>
      {words.map((word, i) => (
        <span
          // oxlint-disable-next-line react/no-array-index-key -- static word split, never reordered
          key={i}
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            className={className}
            initial={reduced ? false : { y: '105%' }}
            whileInView={reduced ? undefined : { y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.055, ease: EASE }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </>
  )
}
