import { createServerFn } from '@tanstack/react-start'
import { newsletterSchema } from '../lib/schemas'
import { getPrisma } from './db'

/**
 * Upsert a newsletter subscriber. Mock-ok when no DB is configured so the
 * signup flow works end-to-end in dev without Postgres.
 */
export const subscribeNewsletter = createServerFn()
  .validator((email: string) => newsletterSchema.parse({ email }).email)
  .handler(async ({ data: email }) => {
    const prisma = getPrisma()
    if (!prisma) return { ok: true as const }

    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        create: { email },
        update: {},
      })
      return { ok: true as const }
    } catch {
      return { ok: false as const, error: 'Could not save your subscription. Please try again.' }
    }
  })
