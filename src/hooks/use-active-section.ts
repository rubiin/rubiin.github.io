'use client'

import { useEffect, useState } from 'react'

/**
 * Scrollspy: reports the id of the section currently crossing a horizontal
 * band around the middle of the viewport. Used to highlight the active nav
 * item while scrolling the home page. Returns `null` when disabled.
 */
export function useActiveSection(ids: string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        // The band can overlap two sections briefly — pick the topmost.
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const top = visible[0]
        if (top) setActive(top.target.id)
      },
      // A ~10% band around the vertical center: only one section at a time.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
    // `ids` is a stable module-level constant at every call site, so it is
    // safe as a direct dependency (no `join` key needed).
  }, [ids, enabled])

  return active
}
