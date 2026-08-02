'use client'

import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

export const LenisContext = createContext<Lenis | null>(null)

/**
 * Access the active Lenis instance (provided by <LenisProvider>).
 * Returns `null` when smooth scrolling is disabled (reduced motion,
 * touch-only viewports) or outside the provider — callers must handle
 * the null case and fall back to native scrolling.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

/** Smooth-scroll to a selector or pixel offset via the active Lenis instance. */
export function lenisScrollTo(target: string | number) {
  const lenis = useContext(LenisContext)
  if (lenis) {
    lenis.scrollTo(target, { offset: -72 })
  } else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' })
  }
}
