import { z } from 'zod'

/** Contact form payload — shared by the client form and server validator. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().email('Enter a valid email address').max(254),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(4000),
})

export type ContactInput = z.infer<typeof contactSchema>

/** Newsletter signup payload — shared by the client form and server validator. */
export const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email address').max(254),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>
