'use client'

import { useEffect } from 'react'

/**
 * Loads the KaTeX stylesheet only when a page actually renders math.
 * Imported dynamically so the CSS never ships on non-blog pages.
 */
export function LazyKatexCss() {
  useEffect(() => {
    void import('katex/dist/katex.min.css')
  }, [])
  return null
}
