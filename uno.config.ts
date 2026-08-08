import { defineConfig } from 'unocss'
import { presetWind4 } from 'unocss/preset-wind4'
import transformerDirectives from '@unocss/transformer-directives'

// UnoCSS — 1:1 replacement for the Tailwind v4 setup; theme tokens map to globals.css CSS vars, dark mode is `.dark` on `<html>`.
export default defineConfig({
  presets: [presetWind4()],
  // Block extractor junk (SVG path data, motion var names, comments); most shadow valid utility names (px, py, tab…) — unblock if genuinely needed.
  blocklist: ['m1831', 'ms', 'px', 'py', 'tab', 'ease', 'table', 'container', 'my', 'me'],
  // `:is()` merging would let high-specificity variant rules override responsive utilities (real layout drift vs Tailwind).
  mergeSelectors: false,

  content: {
    filesystem: ['src/**/*.{ts,tsx,js,jsx,html}'],
  },
  transformers: [
    transformerDirectives(), // expands `@apply` in globals.css
  ],
  variants: [
    // `.dark` ancestor scoping — equivalent to Tailwind's `@custom-variant dark (&:is(.dark *))`.
    (matcher) => {
      if (!matcher.startsWith('dark:')) return matcher
      return {
        matcher: matcher.slice(5),
        selector: (s) => `.dark ${s}`,
      }
    },
    // preset-wind4 forgets `content` on after:/before: rules (pseudo-element never renders) — inject `content:""` like Tailwind; `order: -1` beats the preset's variant.
    {
      name: 'after',
      order: -1,
      match(matcher) {
        if (!matcher.startsWith('after:')) return matcher
        return {
          matcher: matcher.slice(6),
          // `pseudo` slot appends after trailing attribute/`:is(...)` parts from stacked variants.
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
      sans: "'Inter Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      display:
        "'Space Grotesk Variable', 'Inter Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
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
