'use client'

import { useState, type ReactNode } from 'react'
import { useForm } from '@tanstack/react-form'
import { ArrowUpRight, Loader2, Mail, MapPin, Send } from 'lucide-react'
import { toast } from 'sonner'
import { NeonButton } from '@/components/animations/neon-button'
import { ChapterHeading } from '@/components/home/chapter-heading'
import { contactSchema, type ContactInput } from '@/lib/schemas'
import { submitContact } from '@/server/contact'
import { siteConfig } from '@/data/site'
import { GitHubIcon, LinkedInIcon, XIcon } from '@/components/ui/brand-icons'
import { cn } from '@/lib/utils'

const SOCIALS = [
  { label: 'GitHub', href: siteConfig.socials.github, icon: GitHubIcon },
  { label: 'LinkedIn', href: siteConfig.socials.linkedin, icon: LinkedInIcon },
  { label: 'X', href: siteConfig.socials.twitter, icon: XIcon },
  { label: 'Email', href: siteConfig.socials.email, icon: Mail },
]

/** Floating-label field — the label floats up on focus or when filled. */
function FloatingField({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: (fieldClass: string, describedBy?: string) => ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        {children(
          cn(
            'peer h-12 w-full rounded-xl border border-input bg-muted/30 px-4 pt-4 text-sm text-foreground shadow-xs transition-all duration-300 outline-none placeholder:text-transparent',
            'focus:border-primary focus:bg-background/60 focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent),0_10px_32px_-12px_color-mix(in_oklab,var(--primary)_55%,transparent)]',
            error && 'border-destructive focus:border-destructive',
          ),
          error ? `${id}-error` : undefined,
        )}
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-muted-foreground transition-all duration-200',
            'peer-focus:top-3 peer-focus:text-[0.7rem] peer-focus:font-medium peer-focus:text-primary',
            'peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[0.7rem] peer-[:not(:placeholder-shown)]:font-medium',
            error && 'peer-focus:text-destructive',
          )}
        >
          {label}
          {error && (
            <span className="ml-1 text-destructive" aria-hidden>
              •
            </span>
          )}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Home contact section: headline + contact details + morphing social icons
 * on the left, a floating-label glass form on the right that posts through
 * the same server fn as the /contact page.
 */
export function ContactSection() {
  const [sent, setSent] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    } as ContactInput,
    validators: {
      onChange: contactSchema,
      onBlur: contactSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await submitContact({ data: value })
        if (result.ok) {
          setSent(true)
          toast.success('Message sent', {
            description: "Thanks for reaching out — I'll get back to you soon.",
          })
        }
      } catch {
        toast.error('Something went wrong', {
          description: 'Your message could not be sent. Please try again.',
        })
      }
    },
  })

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <ChapterHeading
        chapter="06"
        eyebrow="Contact"
        title="Let's build something together."
        description="Tell me about your project, team, or idea — I'd love to hear from you."
      />

      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left: info + socials */}
        <div className="flex flex-col gap-6">
          <div className="glass-strong flex flex-col gap-4 rounded-2xl p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              I'm currently available for freelance projects and select collaborations. Drop a
              message and I'll get back to you within 1–2 business days.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href={siteConfig.socials.email}
                className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="glass flex size-10 items-center justify-center rounded-xl text-primary transition-all duration-300 group-hover:rounded-full group-hover:shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--primary)_70%,transparent)]">
                  <Mail className="size-4" />
                </span>
                {siteConfig.email}
              </a>
              <span className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="glass flex size-10 items-center justify-center rounded-xl text-primary">
                  <MapPin className="size-4" />
                </span>
                {siteConfig.location} · {siteConfig.role}
              </span>
            </div>
          </div>

          {/* Social icons — morph shape and light up on hover */}
          <div className="flex flex-wrap items-center gap-3">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={label}
                title={label}
                className="glass group flex size-12 items-center justify-center rounded-xl text-muted-foreground transition-all duration-500 hover:rounded-full hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-accent-secondary hover:text-primary-foreground hover:shadow-[0_0_28px_-6px_color-mix(in_oklab,var(--primary)_80%,transparent)]"
              >
                <Icon className="size-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[8deg]" />
              </a>
            ))}
          </div>
        </div>

        {/* Right: glass form */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8">
          {sent ? (
            <div
              role="status"
              aria-live="polite"
              className="flex h-full min-h-72 flex-col items-center justify-center gap-4 text-center"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-secondary text-primary-foreground shadow-[0_0_32px_-6px_color-mix(in_oklab,var(--primary)_80%,transparent)]">
                <Mail className="size-6" />
              </span>
              <h3 className="font-display text-xl font-semibold">Message sent!</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Thanks for reaching out. I usually reply within 1–2 business days.
              </p>
              <NeonButton variant="outline" size="sm" onClick={() => setSent(false)}>
                Send another message
              </NeonButton>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void form.handleSubmit()
              }}
              className="flex flex-col gap-5"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <form.Field name="name">
                  {(field) => (
                    <FloatingField
                      id="contact-name"
                      label="Name"
                      error={field.state.meta.errors?.[0]?.message}
                    >
                      {(fieldClass, describedBy) => (
                        <input
                          id="contact-name"
                          name={field.name}
                          autoComplete="name"
                          required
                          placeholder=" "
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={!!field.state.meta.errors?.length}
                          aria-describedby={describedBy}
                          className={fieldClass}
                        />
                      )}
                    </FloatingField>
                  )}
                </form.Field>

                <form.Field name="email">
                  {(field) => (
                    <FloatingField
                      id="contact-email"
                      label="Email"
                      error={field.state.meta.errors?.[0]?.message}
                    >
                      {(fieldClass, describedBy) => (
                        <input
                          id="contact-email"
                          name={field.name}
                          type="email"
                          autoComplete="email"
                          required
                          placeholder=" "
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={!!field.state.meta.errors?.length}
                          aria-describedby={describedBy}
                          className={fieldClass}
                        />
                      )}
                    </FloatingField>
                  )}
                </form.Field>
              </div>

              <form.Field name="message">
                {(field) => (
                  <FloatingField
                    id="contact-message"
                    label="Message"
                    error={field.state.meta.errors?.[0]?.message}
                  >
                    {(fieldClass, describedBy) => (
                      <textarea
                        id="contact-message"
                        name={field.name}
                        required
                        placeholder=" "
                        rows={5}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={!!field.state.meta.errors?.length}
                        aria-describedby={describedBy}
                        className={cn(fieldClass, 'min-h-32 resize-none')}
                      />
                    )}
                  </FloatingField>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => state.canSubmit}>
                {(canSubmit) => (
                  <form.Subscribe selector={(state) => state.isSubmitting}>
                    {(isSubmitting) => (
                      <NeonButton
                        type="submit"
                        size="md"
                        className="w-fit"
                        disabled={!canSubmit || isSubmitting}
                        ariaLabel={isSubmitting ? 'Sending message' : 'Send message'}
                      >
                        {isSubmitting ? (
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                        ) : (
                          <Send className="size-4" aria-hidden />
                        )}
                        {isSubmitting ? 'Sending…' : 'Send message'}
                        <ArrowUpRight className="size-4" />
                      </NeonButton>
                    )}
                  </form.Subscribe>
                )}
              </form.Subscribe>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
