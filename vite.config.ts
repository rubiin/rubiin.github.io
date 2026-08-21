import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import contentCollections from '@content-collections/vite'
import unocssPostcss from '@unocss/postcss'
import type { Root } from 'postcss'
import { cloudflare } from '@cloudflare/vite-plugin'
/**
 * PostCSS plugin: replaces `color-mix(in srgb, …)` with `in oklab` so the
 * rendered colors stay pixel-identical to the previous Tailwind v4 build.
 * wind4 defaults to `in srgb` for theme-key colors; Tailwind used `in oklab`.
 * Runs at OnceExit, after All Once hooks (including @unocss/postcss's own
 * Once which generates the utilities and expands @apply), so the conversion
 * catches every declaration in the output.
 */
const colorMixOklab = () => ({
  postcssPlugin: 'color-mix-oklab',
  OnceExit(root: Root) {
    root.walkDecls((decl) => {
      if (decl.value?.includes('color-mix(in srgb,')) {
        decl.value = decl.value.replaceAll('color-mix(in srgb,', 'color-mix(in oklab,')
      }
    })
  },
})
colorMixOklab.postcss = true

export default defineConfig(({ command }) => ({
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    target: 'es2022',
    minify: true,
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
  },
  // Only force-include deps for the production build. During `vite dev` this
  // block is inert: the TanStack Start plugin injects its own per-environment
  // optimizeDeps (discovery from the client/server entries), which replaces
  // the top-level config — and react/react-dom are CJS, so the browser needs
  // them pre-bundled in dev regardless.
  ...(command === 'build'
    ? {
        optimizeDeps: {
          include: ['react', 'react-dom', '@tanstack/react-router', '@tanstack/react-query'],
        },
      }
    : {}),
  css: {
    postcss: {
      plugins: [
        // Must run before color-mix so the oklab plugin sees the generated CSS.
        unocssPostcss(),
        colorMixOklab(),
      ],
    },
  },
  plugins: [
    contentCollections({
      configPath: './content-collections.config.ts',
    }),
    tanstackStart({
      srcDirectory: 'src',
    }),

    viteReact(),
    cloudflare(),
    // Pre-compress public assets at build time so the SSR server serves
    // .br/.gz variants (hero-scene chunk: 882 KB raw → ~230 KB gzip wire).
    nitro({
      compressPublicAssets: {
        brotli: true,
      },
      // Cache-control strategy (cache-everything):
      //  - /assets/** (hashed JS/CSS/images/fonts): Nitro's built-in default
      //    is `public, max-age=31536000, immutable` + ETag — perfect, so no
      //    override here (most-specific rule wins).
      //  - Prerendered HTML + server responses: always revalidate via ETag
      //    (browser max-age=0 → fast 304s, never stale), while shared caches
      //    (Vercel CDN) may hold pages for an hour with SWR to absorb bursts.
      //  - /sw.js: no-cache so browsers always check for service-worker
      //    updates — a stale SW would delay new content from going live.
      routeRules: {
        '/**': {
          headers: {
            'Cache-Control':
              'public, s-maxage=3600, stale-while-revalidate=86400, max-age=0, must-revalidate',
            // Content-Security-Policy: nonce-free, strict policy that blocks
            // inline scripts except the few the app needs (theme-prepaint,
            // boot-loader, JSON-LD). Giscus injects via DOM, not <script>.
            // Frames restricted to giscus.app; connect-src allows giscus +
            // GitHub avatar CDN. Adjust img-src if external images grow.
            'Content-Security-Policy': [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://giscus.app https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://github.com https://avatars.githubusercontent.com https://www.google-analytics.com",
              "font-src 'self'",
              "connect-src 'self' https://giscus.app https://www.google-analytics.com",
              'frame-src https://giscus.app',
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        },
        '/sw.js': { headers: { 'Cache-Control': 'no-cache' } },
      },
      // All content is static build-time data (content-collections), so
      // prerender every route to static HTML at build: Nitro then serves the
      // files instead of SSR-ing each request (better TTFB, cacheable).
      // crawlLinks discovers /blog/$slug posts by walking the pagination and
      // prev/next chains. Server functions and any path not prerendered still
      // fall back to the SSR server at runtime.
      prerender: {
        routes: ['/', '/blog/tags', '/blog/categories', '/terminal', '/rss.xml', '/sitemap.xml'],
        crawlLinks: true,
        ignore: [
          // /blog and /projects 307 to their canonical search-param URL
          // (TanStack Router search canonicalization), which Nitro can't
          // prerender — routes containing "?" are skipped as files. Ignore
          // the bare paths so the build doesn't EISDIR trying to write them;
          // they stay SSR'd at runtime (fast, in-memory static data). Posts
          // are still discovered via the categories page + prev/next chains.
          (route: string) => route === '/blog' || route === '/projects',
        ],
      },
    }),
  ],
}))
