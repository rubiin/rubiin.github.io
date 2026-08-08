/**
 * Capture visual-snapshot goldens from the Tailwind CSS v4 baseline.
 *
 * Usage:  node scripts/snapshot-baseline.mjs [git-ref] [worktree-dir]
 * Default ref is HEAD — the last commit before the UnoCSS migration is
 * committed (the migration currently lives uncommitted in the working tree).
 *
 * Flow:
 *   build <ref> in a throwaway git worktree → serve it on :3199 →
 *   run `playwright test --update-snapshots` against it →
 *   write tests/snapshots/baseline.json → remove the worktree.
 *
 * Afterwards, `pnpm test:snapshots` compares the current (UnoCSS) build
 * against these goldens and fails on pixel drift.
 */
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const ref = process.argv[2] ?? 'HEAD'
const worktree = process.argv[3] ?? '/tmp/rubiin-snapshot-baseline'
const PORT = 3199
const BASE = `http://localhost:${PORT}`

const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, {
    cwd: opts.cwd ?? ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...(opts.env ?? {}) },
  })
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed (exit ${r.status})`)
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForServer(url, timeoutMs = 60_000) {
  // eslint-disable-next-line no-await-in-loop -- sequential readiness polling; parallelizing a server wait is meaningless
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(url)
      if (res.status < 500) return
    } catch {
      // not up yet
    }
    // eslint-disable-next-line no-await-in-loop
    await wait(500)
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`)
}

console.log(`\n=== Baseline capture: ${ref} (Tailwind CSS v4) → ${BASE} ===`)

let server
let captured = false
try {
  // 1. Checkout the baseline ref in a fresh worktree.
  run('git', ['worktree', 'prune'])
  if (existsSync(worktree)) rmSync(worktree, { recursive: true, force: true })
  run('git', ['worktree', 'add', '-f', worktree, ref])
  const commit = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: worktree,
    encoding: 'utf8',
  }).stdout.trim()

  // 2. Install (old lockfile carries tailwindcss) + build.
  run('pnpm', ['install', '--prefer-offline'], { cwd: worktree })
  run('pnpm', ['build'], { cwd: worktree })

  // 3. Serve the baseline build.
  server = spawn('node', ['.output/server/index.mjs'], {
    cwd: worktree,
    env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1' },
    stdio: 'ignore',
  })
  await waitForServer(BASE)

  // 4. Move this suite's existing goldens aside (renamed tests would otherwise
  //    leave orphans that are never recompared). Kept as a backup so a failed
  //    capture restores the previous goldens instead of leaving none.
  const shotsDir = join(ROOT, 'tests/e2e/__screenshots__')
  const goldenDir = join(shotsDir, 'visual.spec.ts')
  const backup = join(shotsDir, 'visual.spec.ts.bak')
  if (existsSync(backup)) rmSync(backup, { recursive: true, force: true })
  if (existsSync(goldenDir)) renameSync(goldenDir, backup)

  // 5. Capture goldens from the baseline.
  run('pnpm', ['exec', 'playwright', 'test', '--update-snapshots'], {
    env: { SNAPSHOT_EXTERNAL: BASE },
  })
  captured = true
  if (existsSync(backup)) rmSync(backup, { recursive: true, force: true })

  // 6. Record what the goldens were generated from.
  mkdirSync(join(ROOT, 'tests/snapshots'), { recursive: true })
  writeFileSync(
    join(ROOT, 'tests/snapshots', 'baseline.json'),
    JSON.stringify(
      { framework: 'tailwindcss', ref, commit, date: new Date().toISOString(), url: BASE },
      null,
      2,
    ) + '\n',
  )
  console.log(`\n✓ Goldens captured from ${commit} (${ref}) → tests/e2e/__screenshots__/`)
  console.log('  Run `pnpm test:snapshots` to compare the current build against them.')
} finally {
  // Restore previous goldens if capture failed partway (keeps a known-good baseline).
  const shotsDir = join(ROOT, 'tests/e2e/__screenshots__')
  const goldenDir = join(shotsDir, 'visual.spec.ts')
  const backup = join(shotsDir, 'visual.spec.ts.bak')
  if (!captured && existsSync(backup)) {
    if (existsSync(goldenDir)) rmSync(goldenDir, { recursive: true, force: true })
    renameSync(backup, goldenDir)
  } else if (captured && existsSync(backup)) {
    rmSync(backup, { recursive: true, force: true })
  }
  if (server && !server.killed) {
    server.kill('SIGTERM')
    await wait(1000)
  }
  // Cleanup even on failure.
  try {
    run('git', ['worktree', 'remove', '--force', worktree])
    run('git', ['worktree', 'prune'])
  } catch {
    // already gone or never created
  }
}
