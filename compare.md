# UnoCSS ↔ Tailwind CSS v4 — Visual Parity Comparison

> Audit date: 2026-08-07 · Stack: TanStack Start (React 19) + Vite + UnoCSS `preset-wind4` (66.7.5) + Nitro
> Baseline: Tailwind CSS 4.3.3 build at `HEAD` (`8b4b624`), rebuilt in a git worktree.
> **Verdict: rendered output is pixel-perfect 1:1** — verified three ways: selector-by-selector
> CSS diffing, a live computed-style probe, and an automated Playwright snapshot suite (11/11
> pages pass against goldens captured from the Tailwind build).
> Three genuine root-cause bugs were found and fixed (see below); every remaining difference is
> a semantically-equivalent serialization form.

---

## Methodology

1. Built the current UnoCSS tree (`pnpm build`) and the baseline Tailwind tree
   (`git worktree add /tmp/rubiin-tailwind HEAD && pnpm install && pnpm build`).
2. Parsed both generated `globals-*.css` files with `postcss` and compared at
   **individual-selector granularity** (each comma-separated selector → its declaration set).
3. Normalized known-equivalent forms before diffing:
   `--tw-*`/`--un-*` internal vars, `color-mix(… var(--un-*-opacity) …)` at 100% opacity,
   `calc(var(--spacing) * N)`, theme-var namespace renames
   (`--text-xs--line-height` vs `--text-xs-lineHeight`), `@property` internals.

### Raw stats (final builds, after fixes)

| Metric                          | Tailwind v4            | UnoCSS wind4           |
| ------------------------------- | ---------------------- | ---------------------- |
| Generated CSS size              | 135,399 B              | 109,129 B (−19%)       |
| Individual selectors            | 1,087                  | 1,091                  |
| Rule-level: only in one build   | 203 (all equivalent)   | 115 (all equivalent)   |
| Rule-level: differing values    | 130 (all equivalent)   | —                      |
| Keyframes                       | identical              | identical             |
| Theme tokens (`:root`/`.dark`)  | identical              | identical             |

---

## 🐛 Real differences found & fixed

### 1. `after:` / `before:` pseudo-elements never rendered

`preset-wind4` rewrites the selector for `after:*`/`before:*` but — unlike Tailwind v4, which
injects `content: var(--tw-content)` (default `""`) into every pseudo rule — emits **no
`content` at all**. Without `content` the pseudo-element does not render, so the tabs'
active-underline indicator was invisible:

```tsx
// src/components/ui/tabs.tsx
'after:absolute after:bg-foreground after:opacity-0 … group-data-[orientation=horizontal]/tabs:after:inset-x-0 …'
```

**Fix** (`uno.config.ts`): custom `after:`/`before:` variants that append the pseudo-element
via the `pseudo` slot (so it lands *after* trailing attribute/`:is()` parts from stacked
variants) and inject `content:""` via a `body` rewrite, guarded to never clobber an explicit
`content-[…]` utility:

```ts
{
  name: 'after',
  order: -1, // sorts ahead of the preset's own variant (config variants merge after presets)
  match(matcher) {
    if (!matcher.startsWith('after:')) return matcher
    return {
      matcher: matcher.slice(6),
      handle: (input, next) => next({ ...input, pseudo: `${input.pseudo}::after` }),
      body: (body) => {
        if (!body.some(([prop]) => prop === 'content')) body.push(['content', '""'])
        return body
      },
    }
  },
}
// …plus the mirrored `before:` variant
```

After: `.group-data-[orientation=horizontal]/tabs:after:inset-x-0:is(…):after{inset-inline:…;content:""}` — matches Tailwind.

### 2. `text-primary/[0.06]` produced invalid CSS

UnoCSS emitted `color-mix(in oklab, var(--primary) .06, transparent)`. The CSS Color 5 grammar
is `[ <color> && <percentage [0,100]>? ]` — a bare `<number>` is **invalid**, so browsers drop
the whole declaration and the oversized chapter watermark (`chapter-heading.tsx`) would have
rendered solid instead of a faint 6% tint.

**Fix** (`src/components/home/chapter-heading.tsx`): `text-primary/[0.06]` → `text-primary/[6%]`,
which emits exactly what Tailwind produced: `color-mix(in oklab, var(--primary) 6%, transparent)`.

### 3. `mergeSelectors` specificity inflation → 8 px header drift

UnoCSS's rule merger (on by default) coalesces identical declarations into one `:is()` rule. It
merged the plain `px-4` utility with the higher-specificity variant used by `ui/button.tsx`:

```css
/* UnoCSS, mergeSelectors: true */
:is(.has-\[>svg\]\:px-4:has(>svg), .px-4) { padding-inline: calc(var(--spacing) * 4) }
```

`:is()` adopts the **maximum specificity of its arguments**, so the merged rule scored (0,2,1) —
higher than any responsive utility's (0,1,0). Every element using `px-4`, including the header's
`px-4 sm:px-6`, therefore matched a (0,2,1) rule and the base padding **won over the `sm:px-6`
media query at all viewports**. Result: the header content sat 8 px further left than Tailwind
(logo x=80 vs 88; right controls x=1080 vs 1072) — and the same drift affected any other
responsive utility paired with a base utility that has a `has-[>svg]:…` sibling (every button).

This was invisible to the selector diff (the merged selector still *matched* the same elements)
and only surfaced via a live computed-style probe against the two servers, then a pixel-level
screenshot comparison.

**Fix** (`uno.config.ts`): `mergeSelectors: false` — the only `:is()` groups left are the
`group`/`peer`/`data-*` variant stackers, which preserve semantics. After the fix the probe
reports `pad[24px]` / logo x=88, identical to Tailwind, and all 11 snapshot tests pass.

---

## 🤖 Playwright snapshot suite (visual regression guard)

The comparison is now **enforced automatically** so future UnoCSS changes cannot silently drift:

- `tests/e2e/visual.spec.ts` — 22 tests (home, projects, blog, contact, blog-post, terminal ×
  light/dark × desktop/mobile) screenshot at 1280×800 **and** 390×844 so responsive
  breakpoints (`sm:`/`md:`) and the mobile nav are guarded too, with reduced motion,
  light/dark forced, third-party hosts aborted, and font-ready waits.
- Goldens live in `tests/e2e/__screenshots__/visual.spec.ts/` (platform-independent names, no
  `-linux` suffix) and were captured **from the Tailwind v4 build** via
  `scripts/snapshot-baseline.mjs HEAD` (auto-provisions a worktree, builds, serves on a spare
  port, screenshots, records `tests/snapshots/baseline.json`, cleans up).
- `pnpm test:snapshots` builds the UnoCSS tree and runs the suite (currently **22/22 pass**
  against the Tailwind goldens on both viewports); `npx playwright test --update-snapshots`
  regenerates goldens when the baseline intentionally changes.
- CI (`.github/workflows/ci.yml`) runs the snapshots job after build so regressions fail the
  pipeline. Note `mergeSelectors` (bug #3) would have been caught immediately by this suite.

---

## ✅ Verified-equivalent differences (no visual impact)

### Internal variable namespaces
UnoCSS uses `--un-*` (`--un-text-opacity`, `--un-shadow`, …) where Tailwind uses `--tw-*`, and
defaults them on `*` instead of via `@property` initial-values. Self-consistent within each
build; identical computed values. (UnoCSS also emits its `@property` blocks separately.)

### Selector assembly forms
| Class                            | Tailwind                                  | UnoCSS                                   | Equivalent? |
| -------------------------------- | ----------------------------------------- | ---------------------------------------- | ----------- |
| `dark:bg-input/30`               | `.dark\:bg-input\/30:is(.dark *)`         | `.dark .dark\:bg-input\/30`              | ✅ `.dark .x` ≡ `:is(.dark .x)` |
| `has-[>svg]:px-4` + `px-4`       | two separate rules                        | **no longer merged** (`mergeSelectors:false`) — was the cause of bug #3 | ✅ separate rules |
| `group-hover:scale-105`          | `:is(:where(.group):hover *)`             | `.group:hover `                          | ✅ |
| `…:data-[state=active]:after…`   | `…:is(…)[data-state=active]:after`        | `…[data-state=active]:is(…):after`       | ✅ same predicate |
| `peer-focus:top-3`               | `:is(:where(.peer):focus~*)`              | `.peer:focus~`                           | ✅ |
| preflight `[hidden]` / `:-moz-focusring` | `:where(:not([hidden=until-found]))` | `:where(:not([hidden~=until-found]))`    | ✅ |

### Opacity representation
Theme-keyed colors with opacity render as `color-mix(in oklab, var(--x) var(--un-*-opacity),
transparent)` with the opacity var defaulting to 100% — numerically identical to Tailwind's
literal value. Both builds already render in **oklab** (the `colorMixOklab` PostCSS pass in
`vite.config.ts` rewrites wind4's default `in srgb`).

### Spacing math
UnoCSS always writes `calc(var(--spacing) * N)` — including `* 0` for `inset-0`, `top-0`,
`p-0` — where Tailwind collapses to `0`. `calc(var(--spacing) * 0)` computes to `0`.

### Theme var vs inlined value
Tailwind v4's `@theme inline` bakes theme values into utilities; UnoCSS references the same
CSS variables (both defined in the emitted `:host`/`:root`):
- `font-display` → Tailwind inlines `Space Grotesk, Inter, …`; UnoCSS `var(--font-display)` (same stack)
- `rounded` → `border-radius:.25rem` vs `var(--radius-DEFAULT)` (defined as `.25rem`)
- `rounded-lg` → `var(--radius)` vs `var(--radius-lg)` (defined as `var(--radius)`)
- `text-sm`/`text-2xl`/… → `var(--text-sm)` vs `var(--text-sm-fontSize)`; line-height vars renamed (`--text-sm--line-height` vs `--text-sm-lineHeight`)
- `font-semibold`/`leading-none` → renamed `--font-weight-semibold` / `--leading-none` (same values)

### `transition` property lists
Tailwind 4.1's `transition`/`transition-colors` include `outline-color` and the discrete
`display, content-visibility, overlay, pointer-events` (which cannot animate anyway); UnoCSS's
list omits them. All continuous properties (color, background, opacity, shadow, transform, …)
transition identically.

### `rounded-full` sentinel
Tailwind `border-radius:2147483647px` (int32 max) vs UnoCSS `3.40282e38px` (float32 max) —
both effectively infinite.

### Preflight surface details
- `.sr-only`: `clip-path:inset(50%)` vs the legacy `clip:rect(0,0,0,0)` — both hide visually and keep the element in the a11y tree.
- `html`/`body`/`code`/`pre` font-fallback variables use different names
  (`--default-mono-font-family` vs `--default-monoFont-family`) with identical fallback stacks.
- UnoCSS preflight adds `line-height:1.5; tab-size:4` on `html` (Tailwind has the same defaults).

### Color rounding
Hex-with-opacity utilities get baked to `lab()` by lightningcss; the two builds round the 5th
significant digit differently (e.g. `bg-[#0a192f]/80` → `lab(8.45302% …)` vs `lab(8.45304% …)`).
Sub-0.001% — imperceptible.

---

## ℹ️ Cosmetic artifacts (harmless, no visual impact)

- **`@property` leakage** — the UnoCSS PostCSS plugin inlines `syntax/inherits/initial-value`
  declarations into `@apply`-expanded rules (`html,body`, `.prose a`, …). They are unknown
  properties in a rule body, so browsers ignore them; the real `@property` at-rules exist
  separately and work correctly.
- **Extractor bloat** — a handful of junk selectors from substring scanning (`.m1831`, `.my`,
  `.me`, `.py`, `.b`, `.tab`, `.ease`) generate a few unused rules; no element carries these
  classes, so nothing matches them. Costs only a few bytes.

---

## Files touched this session

| File                                     | Change                                                            |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `uno.config.ts`                          | `after:`/`before:` variants injecting `content:""` (order −1) **and** `mergeSelectors:false` (bug #3) |
| `src/components/home/chapter-heading.tsx`| `text-primary/[0.06]` → `text-primary/[6%]`                       |
| `playwright.config.ts`, `tests/e2e/visual.spec.ts` (22 tests × desktop/mobile), `tests/e2e/helpers.ts`, `scripts/snapshot-baseline.mjs`, `tests/snapshots/baseline.json`, `tests/e2e/__screenshots__/**` | snapshot suite + Tailwind goldens |
| `package.json`, `.github/workflows/ci.yml` | `test:snapshots` / `snapshot:baseline` scripts + CI snapshots job |
| `package.json`, `pnpm-lock.yaml` | removed unused deps (`giscus`, `@tanstack/zod-form-adapter`, `reading-time`, `vite-bundle-visualizer`) |
| `knip.config.ts` + `pnpm knip` (also in CI) | dead-code guard — 0 findings |
| `src/data/awards.ts`, `certifications.ts`, `education.ts` (deleted), `src/components/ui/progress.tsx` (deleted), `src/types/index.ts`, `src/hooks/use-lenis.ts`, `src/hooks/use-theme.ts`, `src/lib/constants.ts`, `src/server/blog.ts`, `src/components/blog/mdx-components.tsx`, `tests/e2e/helpers.ts`, `README.md` | dead-code cleanup + README sync |
| (existing migration) `package.json`, `pnpm-lock.yaml`, `vite.config.ts`, `src/styles/globals.css` | Tailwind → UnoCSS switch (verified, not authored this session) |

## How to re-run the comparison

```bash
git worktree add /tmp/rubiin-tailwind HEAD
cd /tmp/rubiin-tailwind && pnpm install && pnpm build
cd - && pnpm build
# then parse + diff .output/public/assets/globals-*.css from both trees with postcss
```
