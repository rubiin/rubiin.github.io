import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import contentCollections from '@content-collections/vite'
import unocssPostcss from '@unocss/postcss'
import type { Root } from 'postcss'

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

export default defineConfig({
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
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router', '@tanstack/react-query'],
  },
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
    // Pre-compress public assets at build time so the SSR server serves
    // .br/.gz variants (hero-scene chunk: 882 KB raw → ~230 KB gzip wire).
    nitro({ compressPublicAssets: true }),
  ],
})
