import { Link } from '@tanstack/react-router'
import { ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { Reveal } from '@/components/animations/reveal'

/**
 * Closing call-to-action: a gradient-bordered panel inviting contact.
 */
export function ContactCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border bg-card p-10 text-center sm:p-16">
          {/* Soft gradient wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-1/10"
          />

          <div className="relative">
            <div className="mx-auto mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Have an idea? Let&apos;s build it.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              I&apos;m currently available for freelance and select collaborations. Tell me what
              you&apos;re working on — I&apos;d love to hear about it.
            </p>
            <div className="mt-8">
              <MagneticButton>
                <Button asChild size="lg" className="gap-2">
                  {/* `to` as string: route lands in a later task */}
                  <Link to={'/contact' as string}>
                    Get in touch
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
