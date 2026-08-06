'use client'

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type ReadState = 'unread' | 'read' | 'current'

/**
 * Read-along paragraph highlight for article bodies. A reading line sits at
 * ~50% of the viewport: paragraphs below it are gently dimmed (unread), the
 * paragraph straddling the line brightens with a primary inset rule
 * (current), and everything above reads at full weight. Pure
 * IntersectionObserver class swaps — no per-frame work. Screen readers see
 * the full text regardless of opacity.
 *
 * Initial state is `read` (full opacity) so SSR and the first client render
 * match and the article never flashes dimmed.
 */
export function ReadingParagraph({ children, className, ...props }: ComponentPropsWithoutRef<'p'>) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [state, setState] = useState<ReadState>('read')
  // Latest observations live in refs so either observer can derive a single
  // state without racing (current band wins over read/unread).
  const inBandRef = useRef(false)
  const readRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    // Scope the read-head to body paragraphs only — paragraphs inside
    // blockquotes, lists, and tables render plain at full opacity.
    if (!el.parentElement?.classList.contains('prose')) return

    const update = () => {
      setState(inBandRef.current ? 'current' : readRef.current ? 'read' : 'unread')
    }

    // Reading band: 46%–54% of the viewport (an 8% window around the line).
    const currentObserver = new IntersectionObserver(
      (entries) => {
        inBandRef.current = entries.some((e) => e.isIntersecting)
        update()
      },
      { rootMargin: '-46% 0px -46% 0px', threshold: 0 },
    )
    // Read: the paragraph's top has crossed above the 46% line.
    const readObserver = new IntersectionObserver(
      (entries) => {
        readRef.current = entries.some((e) => e.isIntersecting)
        update()
      },
      { rootMargin: '0px 0px -54% 0px', threshold: 0 },
    )

    currentObserver.observe(el)
    readObserver.observe(el)
    return () => {
      currentObserver.disconnect()
      readObserver.disconnect()
    }
  }, [])

  return (
    <p
      ref={ref}
      {...props}
      className={cn(
        'transition-[opacity,box-shadow] duration-500 ease-out',
        state === 'current' &&
          'opacity-100 shadow-[inset_3px_0_0_color-mix(in_oklab,var(--primary)_55%,transparent)]',
        state === 'read' && 'opacity-100 shadow-[inset_3px_0_0_transparent]',
        state === 'unread' && 'opacity-70 shadow-[inset_3px_0_0_transparent]',
        className,
      )}
    >
      {children}
    </p>
  )
}
