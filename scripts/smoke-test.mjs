/**
 * Browser smoke test for the storage/perf changes:
 *  1. Theme no-flash — inline head script applies the persisted theme before
 *     any JS bundle runs (verified by blocking all external scripts).
 *  2. BootScreen lifecycle — overlay appears, completes, sets the session flag;
 *     skipped on slow loads and reduced motion.
 *  3. ⌘K palette — opens, fuzzy-searches, navigates.
 *
 * Usage: node scripts/smoke-test.mjs [BASE_URL]
 * Requires a dev/prod server (default http://localhost:3000) and the cached
 * Playwright chromium headless shell.
 */
import { chromium } from 'playwright-core'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const BASE = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')
const BASE_HOST = new URL(BASE).host

function findExecutable() {
  const cacheDir = join(homedir(), '.cache', 'ms-playwright')
  if (!existsSync(cacheDir)) return null
  const shells = readdirSync(cacheDir).filter((d) => d.startsWith('chromium_headless_shell-'))
  for (const s of shells) {
    const p = join(cacheDir, s, 'chrome-linux', 'headless_shell')
    if (existsSync(p)) return p
  }
  return null
}

const executablePath = findExecutable()
if (!executablePath) {
  console.error('No chromium headless shell found — install playwright browsers first.')
  process.exit(1)
}

const results = []
let failures = 0
const consoleErrors = []

function record(name, ok, detail = '') {
  results.push({ name, ok })
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

function watchPage(page, label) {
  page.on('pageerror', (err) => consoleErrors.push(`[${label}] pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    // Expected noise: aborted third-party requests / blocked scripts in tests.
    if (/Failed to load resource/.test(msg.text())) return
    consoleErrors.push(`[${label}] console.error: ${msg.text()}`)
  })
}

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

async function baseContext(opts = {}) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    ...opts,
  })
  // Abort third-party requests — they hang in sandboxes
  // and would otherwise block 'load'/'networkidle' forever.
  await context.route('**/*', (route) => {
    const url = route.request().url()
    if (url.startsWith('http') && new URL(url).host !== BASE_HOST) return route.abort()
    return route.continue()
  })
  return context
}

const BOOT = '[class*="z-[200]"]'

// ── 1. Theme: inline bootstrap, JS fully blocked ──────────────────────────
try {
  const mk = async () => {
    const context = await baseContext()
    // Block every script request — the ONLY JS that can run is the inline
    // <head> bootstrap, so if `.dark` appears it proves no-flash by structure.
    await context.route('**/*', (route) =>
      route.request().resourceType() === 'script' ? route.abort() : route.continue(),
    )
    return context
  }

  {
    const context = await mk()
    const page = await context.newPage()
    watchPage(page, 'theme-js-blocked')
    await page.addInitScript(() => localStorage.setItem('pf:theme:v1', 'dark'))
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 15000 })
    const dark = await page.evaluate(() => ({
      dark: document.documentElement.classList.contains('dark'),
      colorScheme: document.documentElement.style.colorScheme,
    }))
    record(
      'theme: versioned key applies .dark via inline script (JS blocked)',
      dark.dark && dark.colorScheme === 'dark',
      `colorScheme=${dark.colorScheme}`,
    )
    await context.close()
  }

  {
    const context = await mk()
    const page = await context.newPage()
    watchPage(page, 'theme-legacy')
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 15000 })
    const legacy = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    record('theme: legacy "theme" key also applies .dark (JS blocked)', legacy)
    await context.close()
  }

  {
    const context = await mk()
    const page = await context.newPage()
    watchPage(page, 'theme-default')
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 15000 })
    const none = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    record('theme: no stored key leaves light (no false dark)', !none)
    await context.close()
  }
} catch (err) {
  record('theme: inline bootstrap section', false, err.message.split('\n')[0])
}

// ── 2. Theme: full JS load, no flash, toggle round-trip ───────────────────
try {
  const context = await baseContext({ colorScheme: 'dark' })
  await context.addInitScript(() => localStorage.setItem('pf:theme:v1', 'dark'))
  const page = await context.newPage()
  watchPage(page, 'theme-full')
  page.setDefaultTimeout(10000)

  // Capture the class at the earliest moment after DOMContentLoaded — the
  // inline script runs synchronously in <head>, before any module executes,
  // so dark must already be present the instant the DOM is parsed.
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 15000 })
  const atDomReady = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  record('theme: .dark present at DOMContentLoaded (before hydration)', atDomReady)

  await page.waitForTimeout(2500)
  const hydrated = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains('dark'),
    stored: localStorage.getItem('pf:theme:v1'),
    legacy: localStorage.getItem('theme'),
  }))
  record(
    'theme: persists after hydration, legacy key migrated away',
    hydrated.dark && hydrated.stored === 'dark' && hydrated.legacy === null,
    `stored=${hydrated.stored}`,
  )

  // Round-trip: toggle to Light via the dropdown, class flips, storage writes
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await page.getByRole('menuitem', { name: 'Light' }).click()
  await page.waitForFunction(() => !document.documentElement.classList.contains('dark'))
  const toggled = await page.evaluate(() => localStorage.getItem('pf:theme:v1'))
  record(
    'theme: toggle to Light flips class + writes versioned key',
    toggled === 'light',
    `stored=${toggled}`,
  )
  await context.close()
} catch (err) {
  record('theme: full-load section', false, err.message.split('\n')[0])
}

// ── 3. PageLoader lifecycle ───────────────────────────────────────────────
{
  // 3a. Fresh session → loader is server-rendered (visible at first paint),
  //     plays, removes itself, sets the session flag.
  try {
    const context = await baseContext()
    const page = await context.newPage()
    watchPage(page, 'boot-fresh')
    page.setDefaultTimeout(10000)
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })

    // Server-rendered HTML must already contain the loader — no JS needed.
    const presentAtPaint = (await page.locator(BOOT).count()) > 0
    record('boot: loader present in initial HTML (first paint)', presentAtPaint)

    // After hydration + the ~2.5s cinematic it must unmount and set the flag.
    await page.waitForFunction(() => document.querySelector('[class*="z-[200]"]') === null, {
      timeout: 10000,
    })
    const flagNow = await page.evaluate(() => sessionStorage.getItem('pf:boot:v1'))
    record('boot: overlay removes itself after cinematic', true)
    record('boot: session flag set after completion', flagNow === '1')
    await context.close()
  } catch (err) {
    record('boot: fresh-session section', false, err.message.split('\n')[0])
  }

  // 3b. Slow load — the loader still shows (no LCP skip anymore; the exit is
  //     anchored to the CSS draw's end, so slow hydration can't stall it).
  try {
    const slowCtx = await baseContext()
    await slowCtx.addInitScript(() => {
      Object.defineProperty(performance, 'now', { value: () => 5000 })
    })
    const slowPage = await slowCtx.newPage()
    watchPage(slowPage, 'boot-slow')
    slowPage.setDefaultTimeout(10000)
    await slowPage.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    const slowShown = (await slowPage.locator(BOOT).count()) > 0
    const slowVisible = await slowPage.evaluate(() => {
      const el = document.getElementById('pf-boot')
      return el && getComputedStyle(el).display !== 'none'
    })
    record('boot: loader shows even on slow loads', slowShown && slowVisible)
    await slowCtx.close()
  } catch (err) {
    record('boot: slow-load section', false, err.message.split('\n')[0])
  }

  // 3c. No JS → the loader stays hidden (CSS default) so content is always
  //     reachable even without JavaScript. Strip every <script> element from
  //     the served HTML (the inline <head> bootstrap would otherwise still
  //     run, add boot-show, and show the loader) and abort external scripts.
  try {
    const noJsCtx = await baseContext()
    await noJsCtx.route('**/*', async (route) => {
      const request = route.request()
      if (request.resourceType() === 'document') {
        const response = await route.fetch()
        const body = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        await route.fulfill({ response, body })
      } else if (request.resourceType() === 'script') {
        await route.abort()
      } else {
        await route.continue()
      }
    })
    const noJsPage = await noJsCtx.newPage()
    watchPage(noJsPage, 'boot-no-js')
    noJsPage.setDefaultTimeout(10000)
    await noJsPage.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    await noJsPage.waitForTimeout(500)
    const noJsShown = await noJsPage.evaluate(() => {
      const el = document.getElementById('pf-boot')
      return el && getComputedStyle(el).display !== 'none'
    })
    record('boot: loader hidden without JS (content reachable)', !noJsShown)
    await noJsCtx.close()
  } catch (err) {
    record('boot: no-js section', false, err.message.split('\n')[0])
  }

  // 3d. Reduced motion → hidden by the inline head script before first paint;
  //     flag never set.
  try {
    const rmCtx = await baseContext({ reducedMotion: 'reduce' })
    const rmPage = await rmCtx.newPage()
    watchPage(rmPage, 'boot-reduced-motion')
    rmPage.setDefaultTimeout(10000)
    await rmPage.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 })
    const rmHidden = await rmPage.evaluate(() => {
      const el = document.getElementById('pf-boot')
      if (!el) return true // unmounted after hydration
      return getComputedStyle(el).display === 'none'
    })
    const rmFlag = await rmPage.evaluate(() => sessionStorage.getItem('pf:boot:v1'))
    record('boot: loader hidden under reduced motion', rmHidden)
    record('boot: reduced motion never sets the flag', rmFlag === null)
    await rmCtx.close()
  } catch (err) {
    record('boot: reduced-motion section', false, err.message.split('\n')[0])
  }
}

// ── 4. ⌘K palette ─────────────────────────────────────────────────────────
try {
  const context = await baseContext()
  const page = await context.newPage()
  watchPage(page, 'palette')
  page.setDefaultTimeout(10000)
  await page.goto(BASE + '/', { waitUntil: 'load', timeout: 20000 })
  // Wait for hydration before sending ⌘K — the keydown listener only exists
  // after the app mounts. The theme toggle button is server-rendered, so its
  // visibility does NOT imply hydration; the boot loader only unmounts via
  // PageLoader's post-hydration effect, so its removal is the hydration marker.
  await page.waitForFunction(() => !document.getElementById('pf-boot'), { timeout: 20000 })

  await page.keyboard.press('Control+K')
  const dialog = page.locator('[role="dialog"]')
  await dialog.waitFor({ state: 'visible', timeout: 10000 })
  const input = dialog.locator('input[placeholder*="Search"]')
  record('palette: opens with ⌘K and shows search input', (await input.count()) > 0)

  // ⌘K toggles closed (Escape handled by dialog too) — must run while the
  // dialog is open; selecting a result below closes it, after which ⌘K would
  // reopen rather than close.
  await page.keyboard.press('Control+K')
  await dialog.waitFor({ state: 'hidden', timeout: 5000 })
  record('palette: ⌘K toggles closed', true)

  // Reopen for the navigation flow.
  await page.keyboard.press('Control+K')
  await dialog.waitFor({ state: 'visible', timeout: 10000 })

  // Resume is now a download action, so navigation is verified with Projects.
  await input.fill('projects')
  // Scope to the nav CommandItem — "Projects" is also a palette group heading
  // (and every project item's value starts with that heading), so a bare
  // getByText would hit multiple elements.
  const projectsItem = dialog.locator('[data-value^="Navigation Projects"]')
  await projectsItem.click()
  // Search canonicalization rewrites the target to /projects?category=all&q=
  // (validateSearch defaults) — assert on the pathname, not the raw URL.
  await page.waitForURL((url) => url.pathname === '/projects', { timeout: 5000 })
  record(
    'palette: selecting a result navigates to /projects',
    new URL(page.url()).pathname === '/projects',
  )
  await context.close()
} catch (err) {
  record('palette section', false, err.message.split('\n')[0])
}

await browser.close()

// ── Report ────────────────────────────────────────────────────────────────
console.log('\n' + '-'.repeat(50))
if (consoleErrors.length) {
  console.log('Console/page errors observed:')
  for (const err of consoleErrors) console.log('  ' + err)
} else {
  console.log('No console/page errors observed.')
}
console.log(
  `\n${results.length - failures}/${results.length} checks passed${failures ? ` (${failures} failed)` : ''}`,
)
process.exit(failures ? 1 : 0)
