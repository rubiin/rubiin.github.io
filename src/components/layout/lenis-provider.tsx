'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { LenisContext } from '@/hooks/use-lenis'

/**
 * Smooth-scroll provider. Owns a single Lenis instance for the document,
 * destroyed on unmount. Disabled automatically for `prefers-reduced-motion`
 * users and touch-only viewports — the page falls back to native scrolling.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

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
    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <LenisContext.Provider value={lenisRef.current}>{children}</LenisContext.Provider>
}
