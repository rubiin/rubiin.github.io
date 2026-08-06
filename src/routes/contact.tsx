import { createFileRoute } from '@tanstack/react-router'
import { ContactForm } from '@/components/contact/contact-form'
import { ContactInfo } from '@/components/contact/contact-info'
import { SectionHeading } from '@/components/home/section-heading'
import { buildMeta } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: buildMeta({
      title: 'Contact — Rubin Bhandari',
      description:
        'Get in touch with Rubin Bhandari — freelance projects, full-time opportunities, or just to say hello.',
      path: '/contact',
    }),
  }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        level="h1"
        eyebrow="Contact"
        title="Let's build something together."
        description="Tell me about your project, team, or idea — I'd love to hear from you."
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <ContactForm />
        </div>
        <ContactInfo />
      </div>
    </div>
  )
}
