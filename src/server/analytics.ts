import { createServerFn } from '@tanstack/react-start'
import { getPrisma } from './db'

/** Increment the view counter for a project slug. No-op without a DB. */
export const recordProjectView = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const prisma = getPrisma()
    if (!prisma) return

    try {
      await prisma.projectAnalytics.upsert({
        where: { slug },
        create: { slug, views: 1 },
        update: { views: { increment: 1 } },
      })
    } catch {
      // Best-effort analytics.
    }
  })

/**
 * Today's visitor count. Returns a mock when no DB is configured so the
 * counter UI still renders something believable.
 */
export const getVisitorCount = createServerFn().handler(async () => {
  const prisma = getPrisma()
  if (!prisma) return 0

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const row = await prisma.visitorMetric.findUnique({ where: { date: today } })
    return row?.count ?? 0
  } catch {
    return 0
  }
})
