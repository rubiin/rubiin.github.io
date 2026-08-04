/**
 * Analyze vite-bundle-visualizer raw-data JSON.
 * nodeMetas[uid].id is the module path; nodeMetas[uid].moduleParts maps
 * chunk -> partUid; nodeParts[partUid] has renderedLength/gzipLength.
 * Reports motion/framer-motion ("Motion family") bytes per chunk, plus the
 * total sizes of the main entry chunks.
 *
 * Usage: node scripts/analyze-bundle.mjs /tmp/bundle-stats.json
 */
import { readFileSync } from 'node:fs'

const [, , file] = process.argv
const stats = JSON.parse(readFileSync(file, 'utf8'))
const { nodeMetas, nodeParts } = stats

const isMotionFamily = (p) =>
  /\.pnpm\/(framer-motion|motion)@/.test(p) || /\/node_modules\/(framer-motion|motion)\//.test(p)

// chunk -> { rendered, gzip, motionRendered, motionGzip }
const chunks = new Map()
let familyModules = 0

for (const meta of Object.values(nodeMetas)) {
  const id = meta.id ?? ''
  if (!isMotionFamily(id)) continue
  familyModules++
  for (const [chunk, partUid] of Object.entries(meta.moduleParts ?? {})) {
    const part = nodeParts[partUid]
    if (!part) continue
    const c = chunks.get(chunk) ?? { rendered: 0, gzip: 0, motionRendered: 0, motionGzip: 0 }
    c.rendered += part.renderedLength ?? 0
    c.gzip += part.gzipLength ?? 0
    c.motionRendered += part.renderedLength ?? 0
    c.motionGzip += part.gzipLength ?? 0
    chunks.set(chunk, c)
  }
}

console.log(`Motion-family modules: ${familyModules}`)
console.log('\n=== Chunks containing motion/framer-motion ===')
const motionChunks = [...chunks.entries()].sort((a, b) => b[1].motionRendered - a[1].motionRendered)
for (const [chunk, c] of motionChunks) {
  console.log(
    `${chunk}\n  motion: ${c.motionRendered} rendered (${(c.motionRendered / 1024).toFixed(1)} KiB) · ${c.motionGzip} gzip (${(c.motionGzip / 1024).toFixed(1)} KiB)`,
  )
}

console.log('\n=== Total motion-family bytes ===')
const tot = motionChunks.reduce(
  (s, [, c]) => ({ r: s.r + c.motionRendered, g: s.g + c.motionGzip }),
  { r: 0, g: 0 },
)
console.log(
  `${tot.r} rendered (${(tot.r / 1024).toFixed(1)} KiB) · ${tot.g} gzip (${(tot.g / 1024).toFixed(1)} KiB)`,
)

console.log('\n=== Main entry chunk totals ===')
for (const chunk of ['assets/index-T-GoCh_r.js']) {
  let rendered = 0
  let gzip = 0
  for (const meta of Object.values(nodeMetas)) {
    for (const [ch, partUid] of Object.entries(meta.moduleParts ?? {})) {
      if (ch === chunk) {
        rendered += nodeParts[partUid]?.renderedLength ?? 0
        gzip += nodeParts[partUid]?.gzipLength ?? 0
      }
    }
  }
  console.log(
    `${chunk}: ${rendered} rendered (${(rendered / 1024).toFixed(1)} KiB) · ${gzip} gzip (${(gzip / 1024).toFixed(1)} KiB)`,
  )
}
