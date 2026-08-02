'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { LenisContext, __setLenisInstance } from '@/hooks/use-lenis'

/**
 * Smooth-scroll provider. Owns a single Lenis instance for the document,
 * destroyed on unmount. Disabled automatically for `prefers-reduced-motion`
 * users and touch-only viewports — the page falls back to native scrolling.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const [instance, setInstance] = useState<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touchOnly =
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(any-pointer: fine)').matches

    if (prefersReduced || touchOnly) return

    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
    })
    setInstance(lenis)
    __setLenisInstance(lenis)

    return () => {
      lenis.destroy()
      __setLenisInstance(null)
      setInstance(null)
    }
  }, [])

  return <LenisContext.Provider value={instance}>{children}</LenisContext.Provider>
}
