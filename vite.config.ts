import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import contentCollections from '@content-collections/vite'

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
  plugins: [
    tailwindcss(),
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
