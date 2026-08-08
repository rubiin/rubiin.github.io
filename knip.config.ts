import type { KnipConfig } from 'knip'

/**
 * Knip — dead-code / unused-exports / unused-deps scanner.
 *
 */
const config: KnipConfig = {
  // `content-collections.config.ts` is a tool entry (loaded by the Vite
  // plugin) — declaring it makes knip reach `scripts/remark-mermaid.ts` and
  // the rehype/remark/mdast pipeline deps it pulls in.
  entry: ['content-collections.config.ts'],
  project: ['src/**/*.{ts,tsx}', 'scripts/**/*.{ts,mjs}', 'tests/**/*.ts'],
  ignore: ['scripts/smoke-test.mjs', 'scripts/analyze-bundle.mjs', 'src/components/ui/**'],
  ignoreDependencies: [
    // Used via `unocss/preset-wind4` in uno.config.ts (knip doesn't resolve
    // the package's subpath exports).
    '@unocss/preset-wind4',
    // Used by scripts/smoke-test.mjs (manual, ignored above).
    'playwright-core',
  ],
}

export default config
