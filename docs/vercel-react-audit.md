# Vercel React Best Practices — Audit

Audit of the codebase against Vercel's 70-rule React/Next.js performance guide
(`vercel-react-best-practices` skill). Stack is Vite + TanStack Router + React 19
(not Next.js), so Next-specific rules (`next/dynamic`, server actions, `after()`,
RSC caching) are marked N/A.

**Verdict: the codebase already implements the guidelines comprehensively.**
Source comments reference rule names throughout (`client-localstorage-schema`,
`rendering-animate-svg-wrapper`, `rerender-derived-state`,
`rendering-hydration-no-flicker`, `advanced-use-latest`,
`rendering-content-visibility`, `server-serialization`,
`js-request-idle-callback`, `bundle-dynamic-imports`), and the audit confirms
near-total compliance. No high-impact violations exist; only two noise-level
micro-opportunities remain.

Legend: ✓ compliant · ✗ violation · ○ partial · N/A not applicable

## 1. Eliminating Waterfalls (CRITICAL) — ✓

| Rule | Status | Evidence |
|---|---|---|
| `async-parallel` | ✓ | Every route loader uses `Promise.all`: blog index (`getPosts` + `getPostCategories`), `$slug` (post + related + neighbors), categories (categories + posts), tags (tags + posts) |
| `async-suspense-boundaries` | ✓ | `pendingComponent` skeletons on `/blog/$slug`, `PostSkeleton`/`PostError` |
| `async-cheap-condition-before-await` | ✓ | `$slug` loader checks `!post` right after fetch, throws `notFound()` |
| `async-defer-await` | ✓ | Server fns are single-purpose; no unused awaits |
| `async-api-routes` / `async-dependencies` | N/A | No API route chains |

## 2. Bundle Size Optimization (CRITICAL) — ✓

| Rule | Status | Evidence |
|---|---|---|
| `bundle-dynamic-imports` | ✓ | mermaid (`await import('mermaid')` in `mermaid.tsx`), katex CSS (`lazy-katex-css.tsx`), three.js (`HeroScene` lazy in `hero.tsx`), `CommandPalette` lazy in `__root.tsx` |
| `bundle-defer-third-party` | ✓ | giscus injected via `requestIdleCallback` + `async` script in `post-comments.tsx`, below the fold |
| `bundle-barrel-imports` | ✓ | No barrel files; lucide-react imported as named tree-shakeable exports in 35 files |
| `bundle-preload` | ✓ | 3 latin woff2 `rel=preload` in `__root.tsx` head (same hashed URLs as `@font-face`) |
| `bundle-conditional` | ✓ | Command palette loads off the critical path |
| `bundle-analyzable-paths` | ✓ | Static `@/` alias imports throughout |

## 3. Server-Side Performance (HIGH) — ✓

| Rule | Status | Evidence |
|---|---|---|
| `server-serialization` | ✓ | `getPostNeighbors` returns only the two neighboring summaries, never the full list |
| `server-parallel-fetching` | ✓ | Route loaders fan out with `Promise.all` |
| `server-no-shared-module-state` | ✓ | Module-level refs (`use-lenis` instance, `use-command` store) are client-only |
| `server-cache-react` / `server-cache-lru` | N/A | Content is static build-time data (content-collections); no per-request server state |
| `server-auth-actions` | N/A | No auth; contact form validates on server fn |
| `server-dedup-props` / `server-hoist-static-io` | N/A | No RSC component tree |

## 4. Client-Side Data Fetching (MEDIUM-HIGH) — ✓

| Rule | Status | Evidence |
|---|---|---|
| `client-localstorage-schema` | ✓ | Versioned `pf:name:v1` keys with legacy-key migration (`storage.ts`) |
| `client-passive-event-listeners` | ✓ | All 5 window listeners are `{ passive: true }` (hero, floating-dock, site-header, ambient-background, not-found) |
| `client-event-listeners` | ✓ | Every listener has a matching cleanup in its effect return |
| `client-swr-dedup` | N/A | Uses TanStack Query; blog loader seeds the palette's cache (`BLOG_POSTS_QUERY_KEY`) |

## 5. Re-render Optimization (MEDIUM) — ✓

| Rule | Status | Evidence |
|---|---|---|
| `rerender-derived-state` | ✓ | `useElevatedHeader` derives a boolean; component re-renders on threshold crossing only |
| `rerender-derived-state-no-effect` | ✓ | `project-filters.tsx` syncs draft during render, not in an effect |
| `rerender-lazy-state-init` | ✓ | Terminal initializes lines via `useState(() => [...])` |
| `rerender-memo` | ✓ | `useMemo` on filtered lists (blog index, projects, tags, categories), particles, commands, dots |
| `rerender-no-inline-components` | ✓ | All components defined at module level (`RotatingRole`, `PortraitPlaceholder`, `SkillTile`, `Cactus`, ui primitives) |
| `rerender-functional-setstate` | ✓ | Terminal appends lines with `setLines((prev) => [...])` |
| `rerender-use-ref-transient-values` | ✓ | Pointer state written imperatively via refs |
| `rerender-move-effect-to-event` | ✓ | Terminal history/input handled in event handlers |
| `rerender-split-combined-hooks` | ✓ | Hooks split per concern |

## 6. Rendering Performance (MEDIUM) — ✓

| Rule | Status | Evidence |
|---|---|---|
| `rendering-hydration-no-flicker` | ✓ | Inline pre-paint theme script in `__root.tsx` head |
| `rendering-content-visibility` | ✓ | `content-visibility` on project/post cards |
| `rendering-animate-svg-wrapper` | ✓ | `skills-orbit.tsx` animates the wrapper, not the SVG |
| `rendering-svg-precision` | ✓ | Skills-orbit quantizes coordinates to 3 decimals for SSR stability |
| `rendering-resource-hints` | ✓ | Font preloads; `preconnect` removed with self-hosted fonts |
| `rendering-conditional-render` | ✓ | All 75 `&&` usages checked — none render a falsy `0`; every one guards with boolean/string/`length > 0` |
| `rendering-activity` | N/A | Not needed for this UI |
| `rendering-script-defer-async` | ✓ | giscus `script.async = true` |
| `rendering-hoist-jsx` | ○ | Terminal title bar is static JSX inside the component (micro; see findings) |

## 7. JavaScript Performance (LOW-MEDIUM) — ✓

| Rule | Status | Evidence |
|---|---|---|
| `js-request-idle-callback` | ✓ | Hero 3D scene and giscus injection defer to idle |
| `js-index-maps` | ✓ | `byCategory` Map in categories page; `indexOf` scans avoided |
| `js-hoist-regexp` | ✓ | Regexes at module scope (blog-utils heading regex) |
| `js-cache-storage` | ✓ | Storage reads funneled through versioned helpers |
| `js-early-exit` | ✓ | `$slug` loader early-returns/throws; filters early-exit |
| `js-set-map-lookups` | ✓ | Sets used in highlight/finished tracking |

## 8. Advanced Patterns (LOW) — ✓

| Rule | Status | Evidence |
|---|---|---|
| `advanced-use-latest` | ✓ | `project-filters.tsx` keeps a latest callback ref for debounce |
| `advanced-init-once` | ✓ | App-shell bindings (⌘K, konami) bound once per mount |
| `advanced-event-handler-refs` | ✓ | Lenis instance stored in module ref, read from handlers |

## Findings — micro-opportunities (noise-level)

1. **`js-index-maps`** — ✅ FIXED: `SORT_OPTIONS.find()` replaced with a
   module-level `SORT_LABELS` record (blog index); `PROJECT_CATEGORIES.find()`
   replaced with the existing `CATEGORY_LABELS` map (project-filters).
2. **`rendering-hoist-jsx`** — ✅ FIXED: terminal title bar extracted to a
   module-level `TITLE_BAR` constant.

Both were noise-level; fixed for completeness.

## Prior optimizations already shipped (context)

- WebP conversion (26 images, −88%), self-hosted Fontsource fonts, latin woff2
  preloads, image resize + CLS hardening — see `opt.md` and `compare.md`.
