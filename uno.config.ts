import { defineConfig } from 'unocss'
import { presetWind4 } from 'unocss/preset-wind4'
import transformerDirectives from '@unocss/transformer-directives'

/**
 * UnoCSS configuration — a 1:1 replacement for the previous Tailwind CSS v4
 * setup. Theme tokens map to the CSS variables declared in `src/styles/globals.css`
 * so utility classes (`bg-background`, `text-primary/30`, `rounded-lg`, …) resolve
 * to exactly the same values as before. Dark mode is class-based: the site toggles
 * `.dark` on `<html>` (see `src/stores/theme-store.ts`).
 */
export default defineConfig({
  presets: [
    presetWind4(),
  ],
  // Disable `:is()` selector merging. With merging on, a plain utility like
  // `px-4` gets grouped with higher-specificity variants (e.g. the
  // `has-[>svg]:px-4:has(>svg)` used by `ui/button.tsx`), and since `:is()`
  // adopts the max specificity of its arguments, the merged rule (0,2,1)
  // overrides responsive utilities like `sm:px-6` (0,1,0) at every viewport
  // — a real layout drift vs the Tailwind v4 baseline.
  mergeSelectors: false,

  // Content scanning targets for the @unocss/postcss plugin.
  // The filesystem globs tell the postcss plugin which source files
  // to scan for utility classes (bg-primary, animate-marquee, …).
  // Inline content is populated by the plugin from .tsx/.ts files.
  content: {
    filesystem: [
      'src/**/*.{ts,tsx,js,jsx,html}',
    ],
  },
  transformers: [
    transformerDirectives(), // expands `@apply` in globals.css
  ],
  variants: [
    // `.dark` ancestor scoping — equivalent to Tailwind's
    // `@custom-variant dark (&:is(.dark *))`
    (matcher) => {
      if (!matcher.startsWith('dark:')) return matcher
      return {
        matcher: matcher.slice(5),
        selector: (s) => `.dark ${s}`,
      }
    },
    // `after:` / `before:` pseudo-elements. preset-wind4 rewrites the selector
    // but — unlike Tailwind v4 — forgets `content`. Without `content` the
    // pseudo-element never renders (e.g. the tabs' active underline indicator,
    // `after:absolute after:bg-foreground …`). Inject `content:""` exactly like
    // Tailwind does via `content: var(--tw-content)` (default `""`).
    // Object form with `order: -1` sorts these ahead of the preset's own
    // `after:`/`before:` variant (config variants merge *after* presets).
    {
      name: 'after',
      order: -1,
      match(matcher) {
        if (!matcher.startsWith('after:')) return matcher
        return {
          matcher: matcher.slice(6),
          // Append via the `pseudo` slot (not a selector rewrite) so the
          // pseudo-element lands *after* trailing attribute/`:is(...)` parts
          // from stacked variants (e.g. `group-data-[…]/tabs:after:h-0.5`).
          handle: (input, next) =>
            next({
              ...input,
              pseudo: `${input.pseudo}::after`,
            }),
          body: (body) => {
            if (!body.some(([prop]) => prop === 'content')) {
              body.push(['content', '""'])
            }
            return body
          },
        }
      },
    },
    {
      name: 'before',
      order: -1,
      match(matcher) {
        if (!matcher.startsWith('before:')) return matcher
        return {
          matcher: matcher.slice(7),
          handle: (input, next) =>
            next({
              ...input,
              pseudo: `${input.pseudo}::before`,
            }),
          body: (body) => {
            if (!body.some(([prop]) => prop === 'content')) {
              body.push(['content', '""'])
            }
            return body
          },
        }
      },
    },
  ],
  theme: {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      card: 'var(--card)',
      'card-foreground': 'var(--card-foreground)',
      popover: 'var(--popover)',
      'popover-foreground': 'var(--popover-foreground)',
      primary: 'var(--primary)',
      'primary-foreground': 'var(--primary-foreground)',
      secondary: 'var(--secondary)',
      'secondary-foreground': 'var(--secondary-foreground)',
      muted: 'var(--muted)',
      'muted-foreground': 'var(--muted-foreground)',
      accent: 'var(--accent)',
      'accent-foreground': 'var(--accent-foreground)',
      destructive: 'var(--destructive)',
      'destructive-foreground': 'var(--destructive-foreground)',
      border: 'var(--border)',
      input: 'var(--input)',
      ring: 'var(--ring)',
      'chart-1': 'var(--chart-1)',
      'chart-2': 'var(--chart-2)',
      'chart-3': 'var(--chart-3)',
      'chart-4': 'var(--chart-4)',
      'chart-5': 'var(--chart-5)',
      'accent-secondary': 'var(--accent-secondary)',
    },
    font: {
      sans: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      display: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
    },
    radius: {
      xs: '0.125rem',
      sm: 'calc(var(--radius) - 4px)',
      md: 'calc(var(--radius) - 2px)',
      lg: 'var(--radius)',
      xl: 'calc(var(--radius) + 4px)',
    },
    animation: {
      keyframes: {
        marquee: '{from { transform: translateX(0) } to { transform: translateX(-50%) }}',
      },
      durations: {
        marquee: '32s',
      },
      timingFns: {
        marquee: 'linear',
      },
      counts: {
        marquee: 'infinite',
      },
    },
  },
})
