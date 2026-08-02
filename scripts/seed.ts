/**
 * Seeds a minimal dataset so analytics/newsletter features have data to show.
 * Requires DATABASE_URL — the script exits gracefully without one.
 *
 *   pnpm db:seed
 */
import { getPrisma } from '../src/server/db'

async function main() {
  const prisma = getPrisma()
  if (!prisma) {
    console.log('db:seed skipped — DATABASE_URL not set.')
    return
  }

  const email = 'hello@devina.dev'
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  })
  console.log(`Seeded newsletter subscriber: ${email}`)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  await prisma.visitorMetric.upsert({
    where: { date: today },
    create: { date: today, count: 1 },
    update: {},
  })
  console.log(`Seeded visitor metric for ${today.toISOString().slice(0, 10)}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
