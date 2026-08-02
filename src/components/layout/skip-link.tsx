'use client'

/**
 * Accessibility skip link — first focusable element on the page, lets
 * keyboard users jump past nav to main content.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-[60] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
  )
}
