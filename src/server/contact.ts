import { createServerFn } from '@tanstack/react-start'
import { contactSchema, type ContactInput } from '../lib/schemas'
import { getPrisma } from './db'
import { sendContactEmail } from './email'

/**
 * Validate, persist (when a DB is configured), and email (when Resend is
 * configured) a contact submission. Always returns `{ ok: true }` for valid
 * input — missing DB/email creds degrade gracefully instead of failing the
 * form.
 */
export const submitContact = createServerFn()
  .validator((input: ContactInput) => contactSchema.parse(input))
  .handler(async ({ data: input }) => {
    const prisma = getPrisma()

    if (prisma) {
      try {
        await prisma.contactSubmission.create({
          data: {
            name: input.name,
            email: input.email,
            subject: input.subject,
            message: input.message,
          },
        })
      } catch {
        // Persistence is best-effort; never fail the user's form.
      }
    }

    await sendContactEmail(input)

    return { ok: true as const }
  })
