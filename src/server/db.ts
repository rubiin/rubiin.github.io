import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

// The generated client module always exists post-`pnpm db:generate`; only
// *construction* is guarded so the app runs without a database.
const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient }

/**
 * Lazily construct a Prisma client bound to the pg driver adapter.
 * Returns `null` when `DATABASE_URL` is absent so every feature degrades
 * gracefully in dev / without a database. Safe to call repeatedly — the
 * instance is cached on `globalThis` to avoid connection churn in dev.
 */
export function getPrisma(): PrismaClient | null {
  const url = process.env.DATABASE_URL
  if (!url) return null
  if (globalForPrisma.__prisma) return globalForPrisma.__prisma
  const adapter = new PrismaPg({ connectionString: url })
  globalForPrisma.__prisma = new PrismaClient({ adapter })
  return globalForPrisma.__prisma
}
