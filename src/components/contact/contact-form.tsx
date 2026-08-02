'use client'

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { contactSchema, type ContactInput } from '@/lib/schemas'
import { submitContact } from '@/server/contact'

/**
 * Contact form: TanStack Form with the shared zod schema (Zod 4 schemas are
 * standard-schema compliant, so no adapter is needed), loading / success /
 * error states, sonner toasts, and inline per-field validation messages.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: undefined,
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

  if (sent) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border bg-card p-10 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
          ✦
        </span>
        <h3 className="text-xl font-semibold">Message sent!</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thanks for reaching out. I usually reply within 1–2 business days.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Jane Doe"
                aria-invalid={!!field.state.meta.errors?.length}
                aria-describedby={
                  field.state.meta.errors?.length ? `${field.name}-error` : undefined
                }
                className="aria-[invalid=true]:border-destructive"
              />
              {field.state.meta.errors?.length ? (
                <p id={`${field.name}-error`} className="text-xs text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>Email</Label>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="jane@example.com"
                aria-invalid={!!field.state.meta.errors?.length}
                aria-describedby={
                  field.state.meta.errors?.length ? `${field.name}-error` : undefined
                }
                className="aria-[invalid=true]:border-destructive"
              />
              {field.state.meta.errors?.length ? (
                <p id={`${field.name}-error`} className="text-xs text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="subject">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>Subject</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Let's build something"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="message">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>Message</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Tell me about your project…"
              rows={6}
              aria-invalid={!!field.state.meta.errors?.length}
              aria-describedby={field.state.meta.errors?.length ? `${field.name}-error` : undefined}
              className="aria-[invalid=true]:border-destructive"
            />
            {field.state.meta.errors?.length ? (
              <p id={`${field.name}-error`} className="text-xs text-destructive">
                {field.state.meta.errors[0]?.message}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-fit gap-2">
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Send className="size-4" aria-hidden />
                )}
                {isSubmitting ? 'Sending…' : 'Send message'}
              </Button>
            )}
          </form.Subscribe>
        )}
      </form.Subscribe>
    </form>
  )
}
