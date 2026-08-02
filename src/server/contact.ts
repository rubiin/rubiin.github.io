import { createServerFn } from '@tanstack/react-start'
import { contactSchema, type ContactInput } from '../lib/schemas'
import { sendContactEmail } from './email'

/**
 * Validate and email (when Resend is configured) a contact submission.
 * Always returns `{ ok: true }` for valid input — missing email creds
 * degrade gracefully instead of failing the form.
 */
export const submitContact = createServerFn()
  .validator((input: ContactInput) => contactSchema.parse(input))
  .handler(async ({ data: input }) => {
    await sendContactEmail(input)

    return { ok: true as const }
  })
