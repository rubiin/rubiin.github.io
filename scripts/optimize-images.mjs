#!/usr/bin/env node
/**
 * Image optimizer — generates AVIF + responsive width variants.
 *
 * For every public image it emits:
 *   - a full-size AVIF sibling (base.avif), and
 *   - smaller WebP + AVIF variants (base-{w}.webp / base-{w}.avif).
 *
 * The full-size WebP stays untouched (fallback + largest srcset entry).
 * Files are skipped when already up to date (mtime comparison), so the
 * script is idempotent and safe to run on every build.
 *
 * Consumed by <ResponsiveImage> (src/components/ui/responsive-image.tsx),
 * whose srcset follows the `${base}-${w}.{avif,webp}` naming convention.
 *
 * Requirements: ImageMagick 7 (`magick`) with AVIF write support.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

// Per-kind width variants (px). The full-size source is always kept as-is.
const COVER_WIDTHS = [480, 960] // blog covers are ~1280w
const PROJECT_WIDTHS = [320, 640] // project shots are ~500–800w
// Other blog content images get a full-size AVIF only (inline in articles,
// rendered near-native size) — no width variants.

const WEBP_QUALITY = 80
const AVIF_QUALITY = 45
// Note: tiny sources (e.g. a 72×88 logo) are deliberately upscaled to the
// smallest variant width so the fixed-width srcset never 404s — the blur is
// imperceptible in small decorative frames.

function magick(input, args, output) {
  execFileSync('magick', [input, ...args, output], { stdio: 'inherit' })
}

function needsBuild(src, out) {
  if (!existsSync(out)) return true
  return statSync(src).mtime > statSync(out).mtime
}

// Variant filenames look like `cover-480.webp` — never treat them as sources.
const isVariant = (file) => /-\d+\.webp$/.test(file)

function collect() {
  const sources = []
  for (const file of readdirSync(join(publicDir, 'projects'))) {
    if (file.endsWith('.webp') && !isVariant(file)) {
      sources.push({ rel: `projects/${file}`, widths: PROJECT_WIDTHS })
    }
  }
  for (const slug of readdirSync(join(publicDir, 'blog'))) {
    const dir = join(publicDir, 'blog', slug)
    if (!existsSync(dir) || !statSync(dir).isDirectory()) continue
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.webp') || isVariant(file)) continue
      sources.push({
        rel: `blog/${slug}/${file}`,
        widths: file === 'cover.webp' ? COVER_WIDTHS : [],
      })
    }
  }
  return sources
}

let built = 0
let skipped = 0

for (const { rel, widths } of collect()) {
  const src = join(publicDir, rel)
  const base = rel.replace(/\.webp$/, '')
  const outDir = dirname(join(publicDir, base))
  const stem = base.split('/').pop()

  // Full-size AVIF sibling.
  const fullAvif = join(outDir, `${stem}.avif`)
  if (needsBuild(src, fullAvif)) {
    magick(src, ['-strip', '-quality', String(AVIF_QUALITY)], fullAvif)
    built++
  } else {
    skipped++
  }

  // Smaller width variants (WebP + AVIF).
  for (const w of widths) {
    for (const [ext, q] of [
      ['webp', WEBP_QUALITY],
      ['avif', AVIF_QUALITY],
    ]) {
      const out = join(outDir, `${stem}-${w}.${ext}`)
      if (needsBuild(src, out)) {
        magick(src, ['-strip', '-resize', `${w}x`, '-quality', String(q)], out)
        built++
      } else {
        skipped++
      }
    }
  }
}

console.log(`optimize-images: ${built} generated, ${skipped} up-to-date`)
