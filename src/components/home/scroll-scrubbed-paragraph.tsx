'use client'

import { Fragment, useMemo, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Word-level scrub unit: exactly one hook per word. Opacity ramps from a
 * dim "unread" state to full as the scroll read-head passes the word.
 * Highlighted words fade up wearing the gradient fill.
 */
function ScrubWord({
  word,
  highlighted,
  progress,
  start,
  end,
  reduced,
}: {
  word: string
  highlighted: boolean
  progress: MotionValue<number>
  start: number
  end: number
  reduced: boolean
}) {
  const opacity = useTransform(progress, [start, end], reduced ? [1, 1] : [0.22, 1])

  return (
    <motion.span style={{ opacity }} className={cn(highlighted && 'text-gradient font-medium')}>
      {word}
    </motion.span>
  )
}

/**
 * Global word indices covered by any highlight phrase (case-insensitive,
 * whitespace-normalized to match the rendered word stream).
 */
function computeHighlighted(wordList: string[], highlights: string[]): Set<number> {
  const set = new Set<number>()
  if (highlights.length === 0 || wordList.length === 0) return set

  const joined = wordList.map((w) => w.toLowerCase()).join(' ')
  const offsets: number[] = []
  let cursor = 0
  for (const w of wordList) {
    offsets.push(cursor)
    cursor += w.length + 1
  }

  for (const phrase of highlights) {
    const needle = phrase.toLowerCase()
    if (!needle) continue
    let idx = joined.indexOf(needle)
    while (idx !== -1) {
      for (let wi = 0; wi < wordList.length; wi++) {
        const word = wordList[wi]
        if (!word) continue
        const start = offsets[wi] ?? 0
        const end = start + word.length
        if (end > idx && start < idx + needle.length) set.add(wi)
      }
      idx = joined.indexOf(needle, idx + 1)
    }
  }
  return set
}

const NO_HIGHLIGHTS: string[] = []

/**
 * Scroll-scrubbed narrative paragraph: as the reader scrolls, the read head
 * sweeps through the text and words brighten from muted to full. Key
 * phrases light up in the site gradient. The text is real, readable markup
 * (screen readers see the full text; opacity is purely visual). Reduced
 * motion renders the whole text at full opacity — identical DOM, only the
 * animation is skipped.
 */
export function ScrollScrubbedParagraph({
  text,
  highlights = NO_HIGHLIGHTS,
  icon,
  className,
}: {
  text: string
  highlights?: string[]
  /** Optional leading icon rendered before every paragraph (e.g. bullets). */
  icon?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Strict boolean — `useReducedMotion` can be null on first render.
  const reduced = useReducedMotion() === true

  const paragraphs = useMemo(() => text.split('\n\n').filter(Boolean), [text])
  const rows = useMemo(() => {
    let gi = 0
    return paragraphs.map((p) =>
      p
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => ({ word, gi: gi++ })),
    )
  }, [paragraphs])
  const wordList = useMemo(() => rows.flatMap((row) => row.map((w) => w.word)), [rows])
  const total = wordList.length
  const highlighted = useMemo(
    () => computeHighlighted(wordList, highlights),
    [wordList, highlights],
  )

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })

  return (
    <div
      ref={ref}
      // Iconed rows read as a list to assistive tech.
      role={icon ? 'list' : undefined}
      className={cn('space-y-4', className)}
    >
      {rows.map((row, pi) => {
        const scrubbed = (
          <>
            {row.map(({ word, gi }) => (
              <Fragment key={gi}>
                <ScrubWord
                  word={word}
                  highlighted={highlighted.has(gi)}
                  progress={scrollYProgress}
                  start={gi / total}
                  end={(gi + 1) / total}
                  reduced={reduced}
                />
                {gi < total - 1 && ' '}
              </Fragment>
            ))}
          </>
        )
        if (icon) {
          return (
            // oxlint-disable-next-line react/no-array-index-key -- static paragraph split
            <div key={pi} role="listitem" className="flex items-start gap-2.5">
              <span aria-hidden className="mt-0.5 shrink-0 text-primary">
                {icon}
              </span>
              <p className="min-w-0 flex-1 leading-relaxed">{scrubbed}</p>
            </div>
          )
        }
        return (
          // oxlint-disable-next-line react/no-array-index-key -- static paragraph split
          <p key={pi} className="leading-relaxed">
            {scrubbed}
          </p>
        )
      })}
    </div>
  )
}
