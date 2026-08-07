'use client'

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type ReadState = 'unread' | 'read' | 'current'

// Dims unread paragraphs below the ~50% line; brightens the one being read.
export function ReadingParagraph({ children, className, ...props }: ComponentPropsWithoutRef<'p'>) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [state, setState] = useState<ReadState>('read')
  const inBandRef = useRef(false)
  const readRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (!el.parentElement?.classList.contains('prose')) return

    const update = () => {
      setState(inBandRef.current ? 'current' : readRef.current ? 'read' : 'unread')
    }

    const currentObserver = new IntersectionObserver(
      (entries) => {
        inBandRef.current = entries.some((e) => e.isIntersecting)
        update()
      },
      { rootMargin: '-46% 0px -46% 0px', threshold: 0 },
    )
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
