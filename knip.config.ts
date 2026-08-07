import type { KnipConfig } from 'knip'

/**
 * Knip — dead-code / unused-exports / unused-deps scanner.
 *
 * Knip auto-detects the app entries (vite.config, uno.config, router,
 * routeTree.gen, playwright.config, content-collections.config), which also
 * pulls in the content pipeline's transitive deps. The remaining exceptions:
 *  - `scripts/smoke-test.mjs` + `playwright-core`: manual smoke test, not in
 *    the build graph.
 *  - `public/sw.js`: registered by string from `__root.tsx` — only reachable
 *    at runtime, not statically.
 *  - `src/components/ui/**` exports: shadcn/ui components export the full
 *    primitive + variant surface by convention (even when the app only uses a
 *    subset) so future components can compose them.
 */
const config: KnipConfig = {
  // `content-collections.config.ts` is a tool entry (loaded by the Vite
  // plugin) — declaring it makes knip reach `scripts/remark-mermaid.ts` and
  // the rehype/remark/mdast pipeline deps it pulls in.
  entry: ['content-collections.config.ts'],
  project: ['src/**/*.{ts,tsx}', 'scripts/**/*.{ts,mjs}', 'tests/**/*.ts'],
  ignore: [
    'scripts/smoke-test.mjs',
    'scripts/analyze-bundle.mjs',
    'src/components/ui/**',
  ],
  ignoreDependencies: [
    // Used via `unocss/preset-wind4` in uno.config.ts (knip doesn't resolve
    // the package's subpath exports).
    '@unocss/preset-wind4',
    // Used by scripts/smoke-test.mjs (manual, ignored above).
    'playwright-core',
  ],
}

export default config
