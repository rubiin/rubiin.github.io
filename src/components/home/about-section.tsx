import { CheckCircle2, Quote, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/animations/reveal'
import { SectionHeading } from '@/components/home/section-heading'
import { profile } from '@/data/profile'

/**
 * About section: biography + interests, and a philosophy quote card with
 * career highlights. Cards reveal on scroll.
 */
export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="About"
        title="Engineering with a designer's eye."
        description="A quick snapshot of who I am, how I think, and what I've been up to."
      />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left: bio + interests */}
        <Reveal>
          <div className="flex h-full flex-col gap-6">
            <div className="space-y-4 text-muted-foreground">
              {profile.bio.split('\n\n').map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>

            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="size-4 text-primary" aria-hidden />
                Interests
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right: philosophy + highlights */}
        <div className="flex flex-col gap-6">
          <Reveal delay={0.1}>
            <figure className="relative rounded-xl border bg-card p-6">
              <Quote
                className="absolute -top-3 left-6 size-6 rounded-full bg-primary p-1 text-primary-foreground"
                aria-hidden
              />
              <blockquote className="text-lg font-medium leading-relaxed tracking-tight">
                {profile.philosophy}
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                — My working philosophy
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="rounded-xl border bg-card p-6">
              <p className="mb-4 text-sm font-semibold text-foreground">Career highlights</p>
              <ul className="space-y-3">
                {profile.careerHighlights.map((highlight) => (
                  <li key={highlight.slice(0, 24)} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
