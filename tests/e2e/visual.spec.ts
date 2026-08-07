import { expect, test, type Locator } from '@playwright/test'
import { prepareScreenshot } from './helpers'

/** Theme backgrounds — used to neutrally mask the GPU-dependent 3D canvas. */
const THEME_BG = { light: '#f4f6fd', dark: '#0b0e1a' } as const

/**
 * Viewports under guard. Mobile is a common device size (iPhone 12/13/14
 * logical resolution) so `sm:`/`md:` breakpoints and the mobile nav are
 * exercised, not just the desktop layout.
 */
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
] as const

const CASES = [
  { name: 'home', path: '/', maskCanvas: true },
  { name: 'blog', path: '/blog' },
  { name: 'projects', path: '/projects' },
  { name: 'contact', path: '/contact' },
  { name: 'blog-post', path: '/blog/unknown-type-in-typescript' },
  // Terminal forces its own dark scheme — single capture is enough.
  { name: 'terminal', path: '/terminal', themes: ['dark'] as const },
] as const

for (const c of CASES) {
  const themes = 'themes' in c ? c.themes : (['light', 'dark'] as const)
  for (const theme of themes) {
    for (const vp of VIEWPORTS) {
      test(`${c.name} — ${theme} — ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await prepareScreenshot(page, c.path, theme)

        // WebGL output is GPU-dependent, so mask the hero canvas with a flat
        // theme background — the mask is identical in both builds.
        let mask: Locator[] = []
        if ('maskCanvas' in c && c.maskCanvas) {
          const canvas = page.locator('canvas').first()
          try {
            await canvas.waitFor({ state: 'visible', timeout: 15_000 })
            mask = [canvas]
          } catch {
            // 3D scene absent — nothing to mask.
          }
        }

        await expect(page).toHaveScreenshot(`${c.name}-${theme}-${vp.name}.png`, {
          maxDiffPixelRatio: 0.01,
          maxDiffPixels: 4_000,
          animations: 'disabled',
          caret: 'hide',
          mask,
          maskColor: THEME_BG[theme],
        })
      })
    }
  }
}
