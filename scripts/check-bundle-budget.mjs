#!/usr/bin/env node
/**
 * check-bundle-budget.mjs
 *
 * Post-build check: scans the Vite client output directory and fails if any
 * single JS chunk exceeds the gzip budget. Runs as part of `build` so CI
 * catches regressions early.
 *
 * Usage: node scripts/check-bundle-budget.mjs [.output/public/assets]
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

// ── Budgets (bytes, gzip) ───────────────────────────────────────────────────
// Individual chunk budget — anything over this is a hard fail.
const CHUNK_BUDGET = 250_000 // 250 KiB gzip — catches regressions while allowing lazy Three.js / mermaid chunks
// Total client JS budget — sum of all .js chunks (lazy diagram libs included).
const TOTAL_BUDGET = 2_000_000 // 2 MiB gzip

// ── Scan ────────────────────────────────────────────────────────────────────
const dir = process.argv[2] || '.output/public/assets'
let totalGzip = 0
let failures = 0

try {
  const files = readdirSync(dir).filter((f) => f.endsWith('.js'))

  for (const file of files) {
    const raw = readFileSync(join(dir, file))
    const gz = gzipSync(raw, { level: 9 })
    const gzipBytes = gz.length
    totalGzip += gzipBytes

    const gzKiB = (gzipBytes / 1024).toFixed(1)
    const rawKiB = (raw.length / 1024).toFixed(1)

    if (gzipBytes > CHUNK_BUDGET) {
      console.error(
        `❌ ${file}: ${gzKiB} KiB gzip (${rawKiB} KiB raw) — exceeds ${(CHUNK_BUDGET / 1024).toFixed(0)} KiB budget`,
      )
      failures++
    } else {
      console.log(`✅ ${file}: ${gzKiB} KiB gzip`)
    }
  }

  const totalKiB = (totalGzip / 1024).toFixed(1)
  console.log(`\nTotal client JS: ${totalKiB} KiB gzip`)

  if (totalGzip > TOTAL_BUDGET) {
    console.error(
      `❌ Total budget exceeded: ${totalKiB} KiB > ${(TOTAL_BUDGET / 1024).toFixed(0)} KiB`,
    )
    failures++
  } else {
    console.log(`✅ Total within ${(TOTAL_BUDGET / 1024).toFixed(0)} KiB budget`)
  }

  if (failures > 0) {
    console.error(`\n${failures} budget violation(s). Aborting.`)
    process.exit(1)
  }
  console.log('\nAll chunks within budget. ✅')
} catch (err) {
  if (err.code === 'ENOENT') {
    console.warn(`⚠️  ${dir} not found — skipping budget check (no build output yet)`)
    process.exit(0)
  }
  throw err
}
