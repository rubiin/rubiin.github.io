'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Per-line masked text reveal. Each line slides up out of an overflow
 * mask into place when in view. Renders statically for reduced motion.
 */
export function TextReveal({
  text,
  className,
  lineClassName,
  lineClassNames,
  delay = 0,
  as: Tag = 'h1',
}: {
  text: string
  className?: string
  lineClassName?: string
  /** Per-line class overrides, applied instead of lineClassName. */
  lineClassNames?: string[]
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}) {
  const reduced = useReducedMotion()
  const lines = text.split('\n')
  const lineClass = (i: number) => lineClassNames?.[i] ?? lineClassName

  if (reduced) {
    return (
      <Tag className={cn('whitespace-pre-line', className)}>
        {lines.map((line, i) => (
          // oxlint-disable-next-line react/no-array-index-key -- static split lines, never reordered
          <span key={i} className={cn('block', lineClass(i))}>
            {line || '\u00A0'}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <Tag className={cn('whitespace-pre-line', className)}>
      {lines.map((line, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- static split lines, never reordered
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={cn('block', lineClass(i))}
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: delay + i * 0.09, ease: EASE }}
          >
            {line || '\u00A0'}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
