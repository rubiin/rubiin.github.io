'use client'

import { createContext } from 'react'
import type Lenis from 'lenis'

// Module-level ref, written by <LenisProvider> and read by `lenisScrollTo`
// (which runs from event handlers, so it cannot call hooks).
const instanceRef: { current: Lenis | null } = { current: null }

export const LenisContext = createContext<Lenis | null>(null)

/**
 * Smooth-scroll to a selector or pixel offset via the active Lenis
 * instance. Safe to call from event handlers — reads the module-level ref,
 * never a hook. Falls back to native scrolling when Lenis is disabled.
 */
export function lenisScrollTo(target: string | number) {
  const lenis = instanceRef.current
  if (lenis) {
    lenis.scrollTo(target, { offset: -72 })
  } else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' })
  }
}

/** Internal — sets/clears the module-level instance. */
export function __setLenisInstance(instance: Lenis | null) {
  instanceRef.current = instance
}
