import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// Use `process.env` directly (not `env()`): `env()` throws when the
// variable is missing, but `prisma generate` must still work without
// DATABASE_URL. Only migrate/introspect commands need the URL, and they
// will fail with a clear Prisma error when it is absent.
const url = process.env.DATABASE_URL ?? ''

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url },
})
