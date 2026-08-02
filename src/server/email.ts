import { Resend } from 'resend'

let resend: Resend | null = null

/** Lazily construct the Resend client; null when RESEND_API_KEY is absent. */
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  if (!resend) resend = new Resend(apiKey)
  return resend
}

/** Render the contact-form email body as a simple HTML string. */
function renderContactHtml(input: { name: string; email: string; subject?: string; message: string }): string {
  const subject = input.subject ? `<p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>` : ''
  return `
    <div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1a1a1a;">
      <p>You received a new message from your portfolio contact form:</p>
      <p><strong>Name:</strong> ${escapeHtml(input.name)}<br/>
      <strong>Email:</strong> ${escapeHtml(input.email)}</p>
      ${subject}
      <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
      <p style="white-space: pre-wrap;">${escapeHtml(input.message)}</p>
    </div>
  `
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Send the contact form as an email to the site owner.
 * Returns true on success; never throws on missing creds (returns false).
 */
export async function sendContactEmail(input: {
  name: string
  email: string
  subject?: string
  message: string
}): Promise<boolean> {
  const client = getResend()
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.RESEND_FROM_EMAIL
  if (!client || !to || !from) return false

  try {
    const { error } = await client.emails.send({
      from,
      to,
      subject: input.subject ? `[Portfolio] ${input.subject}` : `New message from ${input.name}`,
      html: renderContactHtml(input),
      replyTo: input.email,
    })
    return !error
  } catch {
    return false
  }
}
