Here's a comprehensive React performance checklist, roughly ordered from the biggest wins to the more advanced optimizations.

> **Legend:** ~~strikethrough~~ = implemented & verified in this codebase · unmarked = not yet done · *N/A* = not applicable to this stack.
>
> **Stack:** Vite + TanStack Start (SSR + server functions) + Nitro + React 19 — not Next.js, so RSC/ISR/server-action items are N/A. Evidence lives in `perf.md`, `opt.md`, `compare.md`, and the code itself.

---

# ~~1. Reduce JavaScript~~

The fastest JavaScript is the JavaScript you never ship.

* ✅ Remove unused dependencies
* ✅ Tree shaking
* ✅ Dynamic imports
* ✅ Route-based code splitting
* ✅ Component-based code splitting
* ✅ Import individual functions instead of entire libraries

Example:

```tsx
// Bad
import * as Icons from "lucide-react"

// Good
import { Search } from "lucide-react"
```

---

# ~~2. Server Rendering~~

* ~~SSR~~
* ~~Streaming SSR~~
* React Server Components (Next.js)
* ~~Static Site Generation (SSG)~~
* Incremental Static Regeneration (ISR)

Render as much HTML on the server as possible.

> Done: SSR via TanStack Start + Nitro; hybrid SSG via Nitro prerendering (`crawlLinks` → 31 static pages). RSC/ISR *N/A* — not Next.js.

---

# 3. Minimize Hydration

Hydration is expensive.

* Hydrate fewer components
* Prefer server components when available
* Keep static content static
* Avoid unnecessary client state

---

# ~~4. Lazy Loading~~

```tsx
const Editor = lazy(() => import("./Editor"))
```

Good candidates:

* Charts
* Maps
* Rich editors
* Three.js
* Monaco
* PDFs
* Comments
* Search dialogs

> Done: three.js `HeroScene`, `CommandPalette` (⌘K), mermaid, KaTeX CSS, Shiki core/langs, and giscus (idle-injected) all load lazily.

---

# ~~5. Suspense~~

```tsx
<Suspense fallback={<Spinner />}>
    <Dashboard />
</Suspense>
```

Allows progressive loading.

> Done: route-level `pendingComponent` skeletons + `Suspense` around lazy `CommandPalette`/`HeroScene`.

---

# ~~6. React.memo~~

Prevent unnecessary renders.

```tsx
export default memo(Button)
```

Useful for

* Lists
* Cards
* Tables

Not useful everywhere.

> Done: `PostCard`, `FeaturedPost`, `ProjectCard` memoized (stable loader/static data refs).

---

# ~~7. useMemo~~

Avoid expensive calculations.

```tsx
const sorted = useMemo(() => sort(items), [items])
```

Good for

* filtering
* sorting
* grouping
* parsing

---

# ~~8. useCallback~~

Stable function references.

```tsx
const onClick = useCallback(() => {}, [])
```

Useful when passing callbacks to memoized children.

---

# ~~9. Split State~~

Instead of

```tsx
<App>
```

holding everything,

move state closer to where it's needed.

Smaller render trees.

> Done: state lives at the leaf. `MobileNav` owns its own open state + trigger button, so the header's render tree stays untouched when the menu opens/closes. Route filters live in URL search params (blog, projects, tags, categories); terminal/hero/testimonials keep cohesive local state.

---

# ~~10. Context Optimization~~

Avoid giant contexts.

Instead of

```
AppContext
```

Split

```
ThemeContext

UserContext

SettingsContext
```

> Done: exactly one context exists in the app — `LenisContext` (a single `Lenis | null` value). Theme + command state live in TanStack Stores; `ThemeProvider` is a side-effect-only wrapper (no context); QueryClient is single-purpose.

---

# 11. Context Selectors

Instead of rerendering every consumer.

Use

```
use-context-selector
```

or

```
zustand
```

---

# ~~12. External State Libraries~~

Large apps perform better with

* Zustand
* Jotai
* TanStack Store
* Redux Toolkit

than giant React contexts.

> Done: TanStack Store (`command-store`, `theme-store`) with selector-based `useStore` — state lives outside React context.

---

# ~~13. Virtualization~~

Never render 10,000 rows.

Use

* TanStack Virtual
* react-window

> Not needed — confirmed with measured list sizes. Largest renderable list is the blog index at **26 posts**, already paginated to 9–12 per page (#14). Every other list is far below the virtualization threshold: projects **21**, skills orbit **23** (decorative, not scrollable), testimonials **3**, nav **6**, TOC ~5–15 heading links, tags/categories ~12 unique tags. The only technically unbounded list is the `/terminal` `lines` state (starts at 2, grows per user command), but rows are plain text and even hundreds render trivially — virtualizing an Easter-egg page would be pure over-engineering (YAGNI).

---

# ~~14. Pagination~~

Instead of

```
10,000 items
```

show

```
50
```

> Done: `BlogPagination` with `?page=` search param + `POSTS_PER_PAGE` slicing.

---

# ~~15. Infinite Scrolling~~

Load data on demand.

> Not needed — confirmed. Infinite scroll suits unbounded/streamed data; every list here is static build-time content with a small, bounded set (26 posts max). The blog index already paginates (#14), so there is no growing list that needs on-demand loading. If posts ever grew to hundreds, the first move would be larger `POSTS_PER_PAGE` or server-side paging, not client-side infinite scroll on SSR-prerendered content.

---

# ~~16. Debounce~~

Search boxes

```tsx
debounce(search,300)
```

> Done: `blog-search` + `project-filters` debounce (250 ms, latest-callback-ref pattern).

---

# ~~17. Throttle~~

Scroll

Resize

Mouse move

> Done: scroll/resize/mousemove handlers use rAF batching + `{ passive: true }` (hero, floating-dock, site-header, ambient-background, not-found).

---

# ~~18. Avoid Anonymous Functions~~

Instead of

```tsx
<button onClick={()=>save()}>
```

prefer stable callbacks when passing to memoized children.

> Done: the memoized cards (`PostCard`, `FeaturedPost`, `ProjectCard`) receive only data props — no callbacks, so memo is never defeated. Grid `renderItem` callbacks (blog + projects) hoisted to module scope for stable references. Remaining inline handlers are idiomatic single-instance cases (form-field `onChange`, pagination/sort handlers closing over the router `update`).

---

# ~~19. Stable Keys~~

Never

```tsx
key={Math.random()}
```

Never

```tsx
key={index}
```

Prefer

```tsx
key={id}
```

> Done: semantic keys throughout (`post.slug`, `p.slug`, `item.id`, `cat.name`).

---

# ~~20. Optimize Lists~~

Memoize rows.

Virtualize.

Stable keys.

> Done: rows memoized (`PostCard`, `ProjectCard`, `SkillTile`), semantic keys, motion `layout` for reorder animation. Virtualization N/A — small paginated lists.

---

# ~~21. Avoid Prop Drilling~~

Use

* Zustand
* Jotai
* Context

appropriately.

> Done: command/theme state via TanStack Store; props stay shallow.

---

# ~~22. Image Optimization~~

* ~~WebP~~ *(done — 26 images converted, −88%)*
* ~~AVIF~~ *(done — full-size + width variants for every local image)*
* ~~Responsive images~~ *(done — `srcset`/`sizes` on all card images)*
* ~~Lazy loading~~ *(done — `loading="lazy"` on all card images)*
* ~~Proper dimensions~~ *(done — intrinsic `width`/`height`, CLS-hardened)*

> Done: AVIF-first `<picture>` (`<ResponsiveImage>`) with WebP width variants + `sizes`-aware `srcset` on post/featured/project cards; blog & MDX images serve AVIF via `ImageZoom`. Generated by `pnpm images` (`scripts/optimize-images.mjs`, idempotent). e.g. cover 55 KB → 8 KB @480w AVIF.

---

# ~~23. Font Optimization~~

* ~~Self-host~~
* ~~font-display: swap~~
* ~~Preload~~
* Variable fonts
* Limit weights

> Done: Fontsource self-hosted fonts + latin woff2 `rel=preload` + swap. Variable fonts / weight limiting not used (fixed font files).

---

# 24. CSS Optimization

Remove unused CSS.

Critical CSS.

Avoid huge frameworks if unused.

---

# ~~25. Bundle Analysis~~

Analyze frequently.

Examples include:

* Vite bundle visualizers
* Webpack Bundle Analyzer

> Done: `scripts/analyze-bundle.mjs` + measured numbers in `perf.md`/`compare.md`.

---

# ~~26. Tree Shaking~~

Prefer

```tsx
import debounce from "lodash/debounce"
```

instead of

```tsx
import _ from "lodash"
```

> Done: knip clean (0 unused deps), `sideEffects: false`, zero `import *` — lucide split into per-icon chunks.

---

# ~~27. Modern Formats~~

Ship

* ~~ES modules~~
* ~~Brotli~~
* HTTP/2
* HTTP/3

> Done: ESM output + build-time Brotli precompression served by the SSR server. HTTP/2/3 is hosting-level (Vercel).

---

# ~~28. Prefetch~~

Routes

Images

Fonts

Important API data

> Done: TanStack Router `defaultPreload: 'intent'` — every `<Link>` prefetches its chunk + loader data after ~50 ms hover/focus/touch; below-fold blog card grids (`PostCard`, `FeaturedPost`) opt into `preload="viewport"` for scroll-based prefetch (mobile has no hover). Passive prefetch is skipped for data-saver users (`usePrefetchMode`). Fonts preloaded (#29); images lazy + responsive (#22); API data *N/A* — loaders are in-memory build-time lookups.

---

# ~~29. Preload~~

Critical assets.

> Done: 3 latin woff2 `rel=preload` (same hashed URLs as `@font-face`).

---

# 30. DNS Prefetch

External APIs.

---

# 31. Preconnect

Fonts/CDNs.

> Not needed: fonts self-hosted — `preconnect` intentionally removed.

---

# ~~32. Cache Everything~~

Browser cache

CDN cache

API cache

React Query cache

> Done: hashed `/assets/**` served `public, max-age=31536000, immutable` + ETag/304 (Nitro default); prerendered HTML `public, s-maxage=3600, stale-while-revalidate=86400, max-age=0, must-revalidate` — CDN holds pages an hour with SWR, browsers always revalidate via ETag; `/sw.js` `no-cache` so SW updates take effect; service worker (network-first HTML, stale-while-revalidate assets) registered in `__root.tsx`; React Query `staleTime` + loader-seeded cache (#33). API cache *N/A* — the only API is the non-cacheable contact POST.

---

# ~~33. TanStack Query~~

Use

* ~~staleTime~~
* gcTime
* placeholderData
* optimistic updates

Avoid duplicate requests.

> Done: `staleTime` + loader-seeded query cache (palette blog search). Remaining bullets unused by design (static content).

---

# ~~34. Avoid Waterfalls~~

Instead of

```
fetch A

↓

fetch B

↓

fetch C
```

do

```
Promise.all()
```

when possible.

> Done: all route loaders fan out with `Promise.all`; micro-waterfall in the Shiki highlight path fixed.

---

# ~~35. Memoize Expensive Components~~

Maps

Charts

Markdown

Syntax highlighting

> Done: `content-visibility` on post/project cards + memoized cards; Shiki/mermaid already lazy.

---

# ~~36. Avoid Heavy Libraries~~

Sometimes replace:

* Moment → Day.js
* Lodash → native APIs
* Full icon packs → individual icons

> Done: knip-verified zero unused deps, no moment/lodash, lucide individual named imports.

---

# 37. Avoid Large Client Components (Next.js)

Move logic to server components.

> *N/A* — not a Next.js app (TanStack Start + Nitro). Client bundle already minimized via lazy loading + code splitting.

---

# ~~38. Reduce DOM Size~~

Don't render unnecessary wrappers.

> Audited with measurements: home 181 divs, post page 76, `/projects` 301 — dominated by the ~14-div-per-card animation chain (grid `motion.div` → `Reveal` → `TiltCard` → `AnimatedBorder` ×2 → `article` → `BrowserFrame` ×2 → media + body rows), every wrapper verified functional. One genuine redundancy fixed: `AnimatedGrid`'s reduced-motion branch no longer renders a no-op `Reveal` wrapper (1 fewer div per card). MDX content, terminal, and nav are lean by design.

---

# ~~39. Avoid Layout Thrashing~~

Batch DOM reads/writes.

Use CSS transforms for animations.

> Done: rAF-batched reads + transform/opacity animations (see `opt.md`).

---

# ~~40. GPU-Friendly Animations~~

Prefer

```
transform

opacity
```

Avoid animating

```
width

height

top

left
```

> Done: `transform`/`opacity` throughout; skills-orbit animates the SVG wrapper, not the SVG.

---

# 41. Web Workers

Move CPU-heavy tasks off the main thread.

Examples:

* Image processing
* Large JSON parsing
* Complex calculations

---

# ~~42. Use Transitions~~

```tsx
startTransition(() => {
  setSearch(query)
})
```

Keeps the UI responsive during non-urgent updates.

> Done: URL-driven filter updates run as transitions — blog `update()` (search/category/tag/sort/pagination) and projects `setCategory`/`setQuery`/`clearFilters` wrap `navigate()` in `startTransition`; the ⌘K palette navigates as a transition (closes instantly, route renders off the critical path). Local filter state (tags/categories) already uses `useDeferredValue` (#43); `<Link>` navigations get transitions via the router's built-in `startTransition` option.

---

# ~~43. Defer Values~~

```tsx
const deferred = useDeferredValue(search)
```

Useful for expensive filtering while typing.

> Done: `useDeferredValue` on the local-state filter pages (`/blog/tags`, `/blog/categories`) — the input stays urgent while the list filter trails a tick behind. Blog/projects search is URL-driven and already debounced, so deferral doesn't apply there. Note: lists are small, so this is pattern application rather than a measured win.

---

# ~~44. Profile First~~

Use:

* React DevTools Profiler
* Chrome Performance panel
* Lighthouse
* Web Vitals

Optimize based on measured bottlenecks, not assumptions.

> Done: measured bundle numbers + Lighthouse/CWV baselines in `opt.md`/`compare.md`; per-rule evidence in this audit.

---

# ~~45. Measure Core Web Vitals~~

Track and improve:

* **LCP (Largest Contentful Paint):** < 2.5 s
* **INP (Interaction to Next Paint):** < 200 ms
* **CLS (Cumulative Layout Shift):** < 0.1
* **FCP (First Contentful Paint):** < 1.8 s
* **TTFB (Time to First Byte):** < 800 ms

> Done: tracked via Lighthouse + Playwright visual snapshot baselines (`tests/snapshots/baseline.json`).

---
