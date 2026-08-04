# Performance Audit — Vercel React Best Practices

> Audit date: 2026-08-04 · Stack: TanStack Start (React 19) + Vite + Tailwind 4 + Nitro
> Source: [vercel-react-best-practices skill](https://vercel.com/docs) — 70 rules, 8 categories.
> **Status: findings #1, #3–#10 fully implemented on 2026-08-04. Finding #2 was measured
> and deliberately deferred (see below).** All code changes validated with `pnpm typecheck`
>
> - `pnpm lint`.

## Verdict

The codebase is **exceptionally well-optimized** — it reads like someone applied this exact skill.
~85% of the high-impact rules were already satisfied, often with comments citing the rule names
(`js-request-idle-callback`, `rerender-derived-state`, `bundle-analyzable-paths`). The delta
found in the audit has now been largely resolved.

---

## ✅ Already compliant (no action needed)

| Rule                                                        | Evidence                                                                                                              |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `bundle-dynamic-imports` / `bundle-conditional`             | Three.js scene, CommandPalette, mermaid, KaTeX CSS, giscus, and per-language Shiki grammars all lazy/dynamic-imported |
| `bundle-analyzable-paths`                                   | Shiki uses `@shikijs/core` + `@shikijs/langs/<id>` directly — avoids the 150-language umbrella + oniguruma WASM       |
| `bundle-barrel-imports`                                     | No app barrel imports; lucide-react named imports tree-shake                                                          |
| `async-parallel`                                            | All loaders use `Promise.all` (`blog/index`, `blog/$slug`)                                                            |
| `client-passive-event-listeners`                            | Every scroll/pointer listener is `{ passive: true }` with cleanup                                                     |
| `js-request-idle-callback`                                  | Giscus injection deferred via `requestIdleCallback`                                                                   |
| `rerender-derived-state`                                    | `useElevatedHeader` subscribes to a boolean, not raw scrollY                                                          |
| `rerender-functional-setstate` / `rerender-lazy-state-init` | `setRoleIndex((i) => …)`, lazy `useState` for QueryClient/terminal lines                                              |
| `rendering-hoist-jsx`                                       | `BANNER`, `HELP`, `CTAS`, `LANGUAGE_MODULES` hoisted to module scope                                                  |
| `rerender-no-inline-components`                             | None found                                                                                                            |
| `advanced-event-handler-refs`                               | `useKonami` stores callback in a ref                                                                                  |
| `rerender-defer-reads`                                      | Hero parallax writes `style.transform` imperatively — zero re-renders on pointermove                                  |
| Reduced-motion                                              | `useReducedMotion` + `motion-reduce:` guards everywhere, including Lenis and BootScreen                               |

---

## Findings — resolution status

### ✅ 1. `Hero` re-renders its entire subtree every 2.4s — DONE

**Rule: `rerender-split-combined-hooks` / `rerender-memo`** — `src/components/home/hero.tsx`

Extracted a module-level `RotatingRole` component owning `roleIndex` + the interval. `Hero` now
renders `<RotatingRole />`, so the swap re-renders only that leaf — the lazy 3D `Canvas`, CTAs,
and stats stay untouched. Behavior preserved (reduced-motion skips the interval, same
`AnimatePresence` swap).

### ⬜ 2. `motion/react` sits in every page's critical bundle — MEASURED, DEFERRED

**Rule: `bundle-defer-third-party` / `bundle-dynamic-imports`** —
`src/components/layout/{site-header,floating-dock,scroll-progress,boot-screen}.tsx`

Measured 2026-08-04 with `vite-bundle-visualizer@1.2.1` (raw-data JSON; `scripts/analyze-bundle.mjs`):

| Location                                                                     | Rendered  | Gzip                            |
| ---------------------------------------------------------------------------- | --------- | ------------------------------- |
| **Main entry chunk** (`assets/index-*.js`, 1353 KiB rendered / 386.4 KiB gz) | 85.9 KiB  | **34.9 KiB (9.0% of entry gz)** |
| Routes chunk                                                                 | 17.3 KiB  | 7.0 KiB                         |
| `AnimatePresence` shared chunk                                               | 9.4 KiB   | 3.7 KiB                         |
| **Total motion/framer-motion** (152 modules)                                 | 112.6 KiB | **45.6 KiB gz**                 |

**Context:** the entry chunk is dominated by `react-dom` (443 KiB rendered), `sonner` (50.5 KiB),
TanStack router-core, Radix UI, and `lenis` (27.1 KiB) — all unavoidable core UI. The single
biggest motion cost is the `layoutId` nav-pill, which pulls in motion-dom's whole layout
projection system (`create-projection-node.mjs`, 38.1 KiB rendered).

**Recommendation — not worth it right now.** Removing Motion from the four layout components
would drop ~35 KiB gz from the entry chunk (≈9%), but the homepage hero already uses Motion
heavily (it's the site's centerpiece animation), so the animation library must be shipped for
the most important page regardless — the refactor would only help secondary pages (blog,
contact, resume) at the cost of hand-rolling four CSS/rAF animations and losing the `layoutId`
pill's spring. If a future pass wants it: replace `ScrollProgress` with a rAF `scaleX` div,
`FloatingDock` scale with CSS transitions, the nav pill with the existing `.nav-underline`
class, and `BootScreen` with CSS keyframes. Re-run `scripts/analyze-bundle.mjs` after any
bundle-affecting change.

### ✅ 3. Post page fetches _all_ posts just to compute prev/next — DONE

**Rule: `server-serialization` / data minimization** — `src/routes/blog/$slug.tsx` + `src/server/blog.ts`

Added a `getPostNeighbors(slug)` server fn returning `{ newer, older }` summaries. The loader
now calls `getPostNeighbors({ data: params.slug })` in the existing `Promise.all` and spreads
the result — same RPC count (3), same `useLoaderData` shape, no full-list serialization.

### ✅ 4. `AnimatedBar` re-renders per animation frame — DONE

**Rule: `rerender-defer-reads` / `js-batch-dom-css`** — `src/components/home/skills-section.tsx` + `src/components/ui/progress.tsx`

`AnimatedBar` now drives the fill with `motion`'s `animate(0, value, { onUpdate })`, writing
`style.transform` straight to the indicator — zero per-frame React renders, matching `Counter`.
Final value is committed once via `onComplete` so Radix's `aria-valuenow` is accurate.
`Progress` gained an optional `indicatorRef` prop and dropped `transition-all` (the other
consumer, `resume/skill-bars.tsx`, is static and unaffected).

### ✅ 5. `SkillsOrbit`: 22 individually animated SVG circles — DONE

**Rule: `rendering-animate-svg-wrapper`** — `src/components/home/skills-orbit.tsx` + `src/styles/globals.css`

Replaced 22 per-dot `motion.circle` JS loops with one `motion.svg` wrapper float
(`scale`/`rotate`, 16 s loop) plus a CSS `orbit-twinkle` keyframe (opacity + scale pulse,
`transform-box: fill-box`), staggered per dot via `animation-delay`/`animation-duration`
(preserving the old `5s + delay` rhythm). Runs off the main thread; still `null` under
reduced motion.

### ✅ 6. Prop→state sync in effects (search inputs) — DONE

**Rule: `rerender-derived-state-no-effect`** —
`src/components/blog/blog-search.tsx` + `src/components/projects/project-filters.tsx`

Replaced `useEffect(() => setDraft(query), [query])` with the render-phase sync pattern
(`prevQuery` ref + `setDraft` during render) — no extra render cycle, in-flight typing never
clobbered. Added an `onQueryChangeRef` (latest-callback ref) so the debounce effect depends
only on `[draft, query]` instead of re-arming on the parent's fresh closure every render.
Clear-button behavior unchanged.

### ✅ 7. Sustained 8 fps favicon redraws — DONE

**Rule: `js-request-idle-callback` / `js-batch-dom-css`** — `src/components/layout/animated-favicon.tsx`

Throttled the redraw loop from 120 ms to 400 ms (~2.5 fps instead of ~8 fps of synchronous
`toDataURL` + `href` swaps), with the angle step scaled 0.22 → 0.73 rad/tick to preserve the
ring's angular speed (1.83 vs 1.825 rad/s). Unfocused ticks remain cheap canvas-only draws.

### ✅ 8. `content-visibility` unused on long lists — DONE

**Rule: `rendering-content-visibility`** — `src/styles/globals.css`, `blog/post-card.tsx`, `projects/project-card.tsx`

Added a `.content-visibility` utility (`content-visibility: auto; contain-intrinsic-size:
auto 400px`, matching real card height so the scrollbar doesn't jump) with a print override
(`content-visibility: visible`). Applied to `PostCard` and `ProjectCard` roots, so below-the-fold
cards skip rendering/layout until scrolled near. Resume lists were intentionally **not**
included — their ~60–100 px items get negligible benefit and the fallback would overestimate
scroll height.

### ✅ 9. BootScreen delays first meaningful paint by ~1.4 s — DONE

**Rule: `rendering-hydration-no-flicker` / LCP awareness** — `src/components/layout/boot-screen.tsx`

- Added a `SLOW_LOAD_MS = 1200` gate: if `performance.now()` already exceeds 1.2 s by the time
  the boot effect runs (slow bundle parse, throttled connection, old device), the cinematic is
  skipped entirely and the session is marked done — the hero paints immediately.
- Tightened the timeline: hold 240→200 ms, fade 420→360 ms.
- The overlay is `pointer-events-none` during the fade-out so it never blocks interaction with
  already-visible content.

Reduced-motion and sessionStorage behavior unchanged.

### ✅ 10. Minor items — ALL DONE

- ✅ **Scroll handlers without rAF** (`FloatingDock`, `SiteHeader`) — both now cancel-and-rearm a
  rAF, batching the derived-boolean `setState` to at most one per frame.
- ✅ **Hero parallax writes transform directly** (no rAF) — `useMouseParallax` now rAF-throttles
  the pointer handler (capturing `clientX/clientY` up front, since browsers recycle
  `PointerEvent` objects), matching the `AmbientBackground` pattern and syncing better with the
  3D scene's `useFrame` reader.
- ✅ **`client-localstorage-schema`** — new `src/lib/storage.ts` with versioned, namespaced keys
  (`pf:theme:v1`, `pf:retro:v1`, `pf:boot:v1`) and `readStorage`/`writeStorage` helpers that
  transparently migrate the legacy unversioned keys (`theme`, `pf-retro`, `pf-boot-done`) on
  first read. `theme-store`, `easter-eggs`, and `boot-screen` all use the helpers now.
- ✅ **Theme flash risk** — `src/routes/__root.tsx` head now emits an inline bootstrap script
  that reads the (versioned or legacy) theme key and applies `.dark` + `color-scheme` before
  first paint, mirroring `resolveTheme`/`applyTheme` (`rendering-hydration-no-flicker`).
- ✅ **CommandPalette refetches `getPosts` client-side** — the palette now shares a
  `BLOG_POSTS_QUERY_KEY` with the blog index loader, which seeds the query cache via
  `queryClient.setQueryData`. Combined with `staleTime: Infinity` (posts are build-time
  static), ⌘K fetches at most once per session — never duplicating the blog loader.

---

## Files touched this session

| File                                          | Change                                                                     |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `src/components/home/hero.tsx`                | `RotatingRole` extraction + rAF-throttled parallax                         |
| `src/components/home/skills-section.tsx`      | Imperative `AnimatedBar`                                                   |
| `src/components/home/skills-orbit.tsx`        | Wrapper animation + CSS twinkle                                            |
| `src/components/ui/progress.tsx`              | Optional `indicatorRef`, removed `transition-all`                          |
| `src/components/blog/blog-search.tsx`         | Render-phase sync + stable callback ref                                    |
| `src/components/projects/project-filters.tsx` | Render-phase sync + stable callback ref                                    |
| `src/components/blog/post-card.tsx`           | `content-visibility`                                                       |
| `src/components/projects/project-card.tsx`    | `content-visibility`                                                       |
| `src/components/layout/animated-favicon.tsx`  | Redraw throttle (400 ms)                                                   |
| `src/components/layout/boot-screen.tsx`       | Slow-load skip + tighter timeline + pointer-events                         |
| `src/components/layout/floating-dock.tsx`     | rAF-throttled scroll handler                                               |
| `src/components/layout/site-header.tsx`       | rAF-throttled scroll handler                                               |
| `src/components/layout/boot-screen.tsx`       | Slow-load skip + timeline + pointer-events + versioned storage             |
| `src/components/layout/easter-eggs.tsx`       | Uses versioned storage helpers                                             |
| `src/components/layout/command-palette.tsx`   | Shared posts query key + `staleTime: Infinity`                             |
| `src/lib/storage.ts`                          | **New** versioned storage-key helpers with legacy migration                |
| `src/lib/constants.ts`                        | `BLOG_POSTS_QUERY_KEY` shared query key                                    |
| `scripts/analyze-bundle.mjs`                  | Bundle analysis script (motion share measurement)                          |
| `src/server/blog.ts`                          | New `getPostNeighbors` server fn                                           |
| `src/routes/blog/$slug.tsx`                   | Loader uses `getPostNeighbors`                                             |
| `src/routes/blog/index.tsx`                   | Seeds the palette's posts cache from loader data                           |
| `src/routes/__root.tsx`                       | Inline pre-paint theme bootstrap script                                    |
| `src/stores/theme-store.ts`                   | Uses versioned storage helpers                                             |
| `src/styles/globals.css`                      | `.content-visibility` utility + `orbit-twinkle` keyframes + print override |

## Remaining work

1. **Finding #2 (optional, deferred):** The Motion-in-layout refactor was measured (~35 KiB gz
   of the entry chunk, 9%) and judged not worth it while the homepage hero requires Motion
   anyway. Revisit only if secondary-page bundle weight becomes a measured concern.

## Tooling added

- `vite-bundle-visualizer@1.2.1` (devDependency) — run `npx vite-bundle-visualizer -t raw-data -o /tmp/bundle-stats.json --no-open` then `node scripts/analyze-bundle.mjs /tmp/bundle-stats.json`.
- `scripts/analyze-bundle.mjs` — parses the raw-data JSON into motion-share-per-chunk numbers.
