'use client'

import { useActiveSection } from '@/hooks/use-active-section'
import { lenisScrollTo } from '@/hooks/use-lenis'
import { cn } from '@/lib/utils'

const CHAPTERS = [
  { id: 'about', number: '01', label: 'About' },
  { id: 'skills', number: '02', label: 'Skills' },
  { id: 'experience', number: '03', label: 'Experience' },
  { id: 'projects', number: '04', label: 'Projects' },
  { id: 'testimonials', number: '05', label: 'Testimonials' },
  { id: 'contact', number: '06', label: 'Contact' },
] as const

// Stable module-level reference — `useActiveSection` expects ids with a
// constant identity, otherwise the observer re-arms on every render.
const CHAPTER_IDS = CHAPTERS.map((c) => c.id)

/**
 * Fixed chapter rail on the right edge of the viewport (xl+ only). Each
 * chapter is a small node; the active one grows into a glowing gradient
 * bar. Clicking a node smooth-scrolls to that section via Lenis. The rail
 * reuses the same scrollspy as the header, so both stay in sync.
 */
export function ChapterProgress() {
  const active = useActiveSection(CHAPTER_IDS, true)

  return (
    <nav
      aria-label="Chapters"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex"
    >
      {CHAPTERS.map(({ id, number, label }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => lenisScrollTo(`#${id}`)}
            aria-label={`Go to chapter ${number}: ${label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-3"
          >
            <span
              className={cn(
                'text-right text-[10px] font-medium tracking-widest transition-all duration-300',
                isActive
                  ? 'text-primary opacity-100'
                  : 'text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
              )}
            >
              {number} · {label}
            </span>
            <span
              aria-hidden
              className={cn(
                'flex items-center justify-center rounded-full transition-all duration-300',
                isActive
                  ? 'h-9 w-1.5 bg-gradient-to-b from-primary to-accent-secondary shadow-[0_0_14px_color-mix(in_oklab,var(--primary)_80%,transparent)]'
                  : 'size-1.5 bg-muted-foreground/30 group-hover:bg-primary/60 group-hover:shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_60%,transparent)] group-focus-visible:bg-primary/60',
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}
