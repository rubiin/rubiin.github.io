import type { Page } from '@playwright/test'

const BASE_URL = process.env.SNAPSHOT_EXTERNAL ?? 'http://localhost:3000'
const BASE_HOST = new URL(BASE_URL).host

/**
 * Prepare a page for a deterministic screenshot:
 *  1. Abort every third-party request (analytics, CDNs, …). Fonts are now
 *     self-hosted (Fontsource, same-origin), so they render identically in
 *     every environment without any network variance — no font fallback
 *     mismatch possible.
 *  2. Persist the theme *before* any page script runs — the inline <head>
 *     bootstrap applies `.dark` pre-paint from `pf:theme:v1`.
 *  3. Freeze CSS animations/transitions via an injected stylesheet
 *     (belt-and-suspenders to Playwright's `animations: 'disabled'`).
 *  4. Wait for hydration + lazy chunks (network idle), fonts, and a settle
 *     window before the screenshot is taken.
 */
export async function prepareScreenshot(page: Page, path: string, theme: 'light' | 'dark') {
  await page.route('**/*', (route) => {
    const url = route.request().url()
    if (url.startsWith('http') && new URL(url).host !== BASE_HOST) return route.abort()
    return route.continue()
  })

  await page.addInitScript((t) => {
    localStorage.setItem('pf:theme:v1', t)
    const style = document.createElement('style')
    style.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}'
    document.head.appendChild(style)
  }, theme)

  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })

  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'load', timeout: 30_000 })
  await page.waitForLoadState('networkidle', { timeout: 30_000 })
  await page.evaluate(() => document.fonts.ready)
  // Settle lazy imports (3D scene, mermaid, katex css) and hydration paint.
  await page.waitForTimeout(1200)
}
