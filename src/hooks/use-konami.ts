'use client'

import { useEffect, useRef } from 'react'

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

/** Fires `onUnlock` when the classic Konami sequence is typed. */
export function useKonami(onUnlock: () => void) {
  const idx = useRef(0)
  const cb = useRef(onUnlock)
  cb.current = onUnlock

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === SEQUENCE[idx.current]) {
        idx.current += 1
        if (idx.current === SEQUENCE.length) {
          idx.current = 0
          cb.current()
        }
      } else {
        idx.current = key === SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
