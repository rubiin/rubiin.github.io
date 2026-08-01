/**
 * Programmatic build for content-collections (the CLI in v0.2 is an
 * installer, not a builder). Runs the same builder the vite plugin uses,
 * so `pnpm content:build` produces .content-collections/generated without
 * starting a dev server.
 */
import { createBuilder } from '@content-collections/core'

const configurationPath = './content-collections.config.ts'

const builder = await createBuilder(configurationPath)
await builder.build()
console.log('content-collections: build complete')
