# Performance Optimization Findings

> Audit date: 2026-08-07 (measured against the current UnoCSS build, 2026-08-08) ·
> Stack: TanStack Start (React 19) + Vite + UnoCSS `preset-wind4` + Nitro ·
> Bundle numbers are **raw / brotli** transfer sizes from `.output/public/assets/`.
> Status: image-format work **done**; 5 of 8 ranked findings resolved (see per-item strikethroughs).
> Remaining open: #3 mermaid IO-gating · #4 motion in entry chunk (partial) · #5 MDX inline dims (partial) · #6 CSS extractor junk.

---

## ✅ Done this session

### 1. Self-hosted fonts (render-blocking Google Fonts removed)

Replaced the blocking `fonts.googleapis.com/css2…` `<link>` (+ two preconnects) in
`src/routes/__root.tsx` with **Fontsource variable packages** — `@fontsource-variable/inter`,
`@fontsource-variable/space-grotesk`, `@fontsource-variable/jetbrains-mono` — imported
directly in the root route. Font faces ship same-origin as hashed woff2 assets with
`font-display: swap` and per-subset `unicode-range`, so browsers fetch only the **latin** files
this English site uses (3 woff2, ~108 KiB total). Font stacks updated to the `Variable` family
names in `globals.css` + `uno.config.ts`.

**Verified:** no `fonts.googleapis` in the served HTML; all three families load from
`/assets/*.woff2` in a headless browser; typecheck ✓ lint ✓ knip ✓; all 22 snapshots
regenerated (`--update-snapshots=all`) and passing — goldens now render real fonts instead of
aborted fallbacks, which is _more_ deterministic (no network variance by construction).
The three latin woff2s are also `rel=preload`d in the root head (`as=font`,
`crossorigin=anonymous`) with hashes matching the `@font-face` rules exactly, so first paint
swaps to real fonts without a late font fetch.

> **Tradeoff:** the variable packages' `index.css` declares _all_ unicode-range subsets
> (cyrillic/greek/vietnamese/latin-ext), so the build emits ~34 woff2 files. Browsers fetch
> only the 3 latin files this English site uses (~108 KiB), so downloads stay lean — the rest
> just sit in `.output`. Static `@fontsource/*` packages ship per-subset CSS entries
> (`@fontsource/inter/latin-400.css`) if build-size hygiene ever matters.

### Image formats: PNG/JPG → WebP + display-size resize (biggest single win)

Converted **26 raster images** (20 project screenshots + 6 blog inline images) from PNG/JPG to
WebP with `magick -strip -quality 85 -define webp:method=6`, updated every reference
(`src/data/projects.ts`, 6 blog MDX files), and deleted the originals. Then resized the **10
project images wider than 800px** down to 800px (`magick -resize 800x>` — cards render at
~352px in the 3-col grid, so 800px = 2.3× DPR headroom). Blog covers were **kept full-res**
because the post hero renders them at `max-w-4xl` (~848px+).

| Metric                        | Before                                       | After                                        |
| ----------------------------- | -------------------------------------------- | -------------------------------------------- |
| 26 converted files            | 4.79 MiB                                     | ~0.59 MiB (**−88%**)                         |
| Project images (after resize) | ~570 KiB                                     | **414 KiB**                                  |
| Total imagery in `public/`    | ~6.3 MiB                                     | **1.41 MiB**                                 |
| Largest files                 | `pokego.png` 708 KiB · `tsumiki.png` 711 KiB | `pokego.webp` 68 KiB · `tsumiki.webp` 27 KiB |

- `og.png` intentionally stays PNG (13 KiB — apple-touch-icon + `og:image` compatibility).
- All 22 Playwright snapshots regenerated (`--update-snapshots=all`) and pass against the new
  WebP + resized pixels; `baseline.json` provenance updated.
- Full verification: typecheck ✓ · lint 0/0 ✓ · knip 0 ✓ · build ✓ · snapshots 22/22 ✓.

---

## 🥇 High impact (open)

### ~~1. Hero 3D chunk is the biggest asset (862 KiB raw / 186 KiB br)~~

~~`hero-scene-*.js` is already `lazy()` + wrapped in `Suspense` and deferred (comment says
"deferred until idle"), but it still hydrates/loads on the home page after load.~~
~~**Fix options:** gate on `requestIdleCallback`/scroll past the fold instead of mount; or trim
unused `three`/`drei` imports (bundle-visualizer can show what). **Effort:** medium ·
**Impact:** ~186 KiB br off the home page's post-load budget.~~

> Done: `hero.tsx` gates the scene on `requestIdleCallback(enable, { timeout: 3000 })` (3 s
> `setTimeout` fallback) and skips it entirely for reduced-motion users — the chunk now loads
> after idle, not on mount. Still the biggest asset; trimming unused `three`/`drei` imports
> remains optional if the post-load budget matters.

### ~~2. Image dimensions / CLS~~

~~Project cards and post covers had aspect-locked containers (no box CLS) but the `<img>` tags
carried no `width`/`height`. Added display-box intrinsic hints (`width`/`height` matching the
16:10/16:9 rendered ratio) to `project-card.tsx`, `projects-section.tsx` and `post-card.tsx`
so layout is reserved even before the CSS box applies, plus `content-visibility` on the
project card (post-card already had it). Source files were full-resolution while cards render
~352px wide — the 10 project images wider than 800px were resized to 800px (see above),
keeping the post hero's ~848px+ cover render intact.~~

---

## 🥈 Medium impact

### 3. Mermaid chain loads on any post with a diagram

`mermaid` core (647 KiB raw / 112 KiB br) + `cytoscape.esm` (425 KiB raw / 113 KiB br) are
dynamic-imported (good) but on `useEffect` mount (`src/components/blog/mermaid.tsx:21`),
even if the diagram is below the fold.
**Fix:** gate the `import('mermaid')` on an `IntersectionObserver` on the diagram element so
below-the-fold diagrams don't pull ~225 KiB br immediately. **Effort:** low.

### 4. Entry chunk still carries `motion` (479 KiB raw / ~128 KiB br)

The critical-path entry chunk (`index-*.js`) includes the `motion` animation library
(perf.md finding #2 — measured and deferred earlier). Recommendations done: ~~`.nav-underline`
pill~~ (site-header) and ~~CSS-keyframe boot screen~~ (page-loader draws via CSS, not motion).
Still open: rAF-based `ScrollProgress`, CSS-only `FloatingDock`. **Effort:** medium ·
**Impact:** tens of KiB br on the critical path.

### 5. Inline images & covers lack intrinsic dimensions

~~`post-card.tsx` covers now carry a 16:9 intrinsic hint (done in #2 above).~~ MDX inline images
(rendered via `ImageZoom`) still have no dims — they vary in size per post, and the prose
container reserves flow space, so CLS is minor. Adding per-image dims in MDX frontmatter is
possible but low value. **Effort:** low.

---

## 🥉 Low impact / cleanup

### 6. CSS extractor bloat

`globals.css` is 111.7 KiB raw (a few KiB br). Substring scanning emits ~25 junk selectors
(`.m1831`, `.my`, `.me`, `.py`, `.tab`, `.ease` — documented in `compare.md`) that no element
matches. A safelist/blocklist cleanup trims a few KiB. **Effort:** low · **Impact:** small.

### ~~7. Static asset caching~~

~~Hashed assets get fresh `Cache-Control`, and `.br`/`.gz`/`.zst` variants are pre-generated by
the build, but there's no CDN / `stale-while-revalidate` on `public/` images and fonts.
Verify the Nitro server's `Accept-Encoding` negotiation actually serves the pre-compressed
variants. **Effort:** low–medium · **Impact:** repeat-visit latency.~~

> Done: hashed `/assets/**` served `public, max-age=31536000, immutable` + ETag/304;
> prerendered HTML `s-maxage=3600, stale-while-revalidate=86400` (CDN holds pages an hour
> with SWR). Verified live: `Accept-Encoding: br` on an entry chunk returns
> `content-encoding: br` (131 KB vs 491 KB plain) — the Nitro server serves the
> pre-compressed variants.

### ~~8. `sw.js` offline cache is network-first~~

~~`public/sw.js` registers on every page (`__root.tsx:157`). Check whether it precaches
critical assets (fonts, entry chunk) rather than fetching them per visit — a real
repeat-visit win for an offline-capable PWA. **Effort:** low.~~

> Done: `sw.js` v2 precaches the app shell (`/`, `og.png`, `manifest.webmanifest`) on install;
> navigations are network-first with an offline fallback to the cached shell, and hashed
> JS/CSS/images/fonts serve stale-while-revalidate (immutable hashes make this safe).

---

## Measurement reference (current build)

| Asset                      | Raw          | Brotli             |
| -------------------------- | ------------ | ------------------ |
| `hero-scene-*.js`          | 862 KiB      | 186 KiB            |
| `chunk-KEIR6QF5` (mermaid) | 647 KiB      | 112 KiB            |
| `index-*.js` (entry)       | 481 KiB      | 128 KiB            |
| `cytoscape.esm-*.js`       | 425 KiB      | 113 KiB            |
| `katex-*.js`               | 253 KiB      | 62 KiB             |
| `react-*.js`               | 119 KiB      | 34 KiB             |
| `globals-*.css`            | 112 KiB      | —                  |
| Fonts (latin, fetched)     | —            | ~108 KiB (3 woff2) |
| **Total JS**               | 6.30 MiB raw | —                  |

**Quick wins ranked by effort:**

1. IntersectionObserver-gated mermaid — keeps ~225 KiB br off most posts.
2. CSS extractor cleanup.
