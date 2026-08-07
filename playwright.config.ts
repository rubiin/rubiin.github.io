import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { defineConfig } from '@playwright/test'

/**
 * Visual snapshot suite — compares the current build against goldens captured
 * from the Tailwind CSS v4 baseline (see `scripts/snapshot-baseline.mjs`).
 * Fails when pixels drift from that baseline.
 *
 * Determinism choices (identical for baseline + comparison runs):
 *  - `SNAPSHOT_EXTERNAL` points the tests at an externally served build (the
 *    baseline script serves the Tailwind build on :3199). Without it, the
 *    built nitro server on :3000 is started by Playwright's `webServer`.
 *  - third-party requests (analytics, CDNs, …) are aborted; fonts are
 *    self-hosted (Fontsource) so they render identically everywhere
 *    (helpers.ts).
 *  - reduced motion + `animations: 'disabled'` freeze every CSS animation.
 */
const BASE_URL = process.env.SNAPSHOT_EXTERNAL ?? 'http://localhost:3000'
const externalServer = Boolean(process.env.SNAPSHOT_EXTERNAL)

/** Reuse the cached chromium headless shell (same discovery as scripts/smoke-test.mjs). */
function findHeadlessShell(): string | undefined {
  const cacheDir = join(homedir(), '.cache', 'ms-playwright')
  if (!existsSync(cacheDir)) return undefined
  for (const dir of readdirSync(cacheDir)) {
    if (!dir.startsWith('chromium_headless_shell-')) continue
    const executable = join(cacheDir, dir, 'chrome-linux', 'headless_shell')
    if (existsSync(executable)) return executable
  }
  return undefined
}

const executablePath = findHeadlessShell()

export default defineConfig({
  testDir: 'tests/e2e',
  // Platform-independent snapshot paths (`home-light.png`, not
  // `home-light-linux.png`) — goldens are compared on whatever OS they were
  // captured on; regenerate on the same OS as CI (Linux) for reliable results.
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1280, height: 800 },
    colorScheme: 'light',
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
    trace: 'retain-on-failure',
  },
  // Always spawn a fresh server: `reuseExistingServer` would silently test a
  // stale build if a leftover dev/preview server is holding :3000 (a real trap
  // during development of this suite). With `false`, Playwright errors out on a
  // port conflict instead of producing bogus comparisons.
  webServer: externalServer
    ? undefined
    : {
        command: 'node .output/server/index.mjs',
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        timeout: 60_000,
      },
})
