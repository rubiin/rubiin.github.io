import { CheckCircle2, Quote, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/animations/reveal'
import { AnimatedBorder } from '@/components/animations/animated-border'
import { ChapterHeading } from '@/components/home/chapter-heading'
import { ScrollScrubbedParagraph } from '@/components/home/scroll-scrubbed-paragraph'
import { profile } from '@/data/profile'

/** Key phrases that light up in the gradient as the reader scrolls past. */
const BIO_HIGHLIGHTS = [
  'Rubin Bhandari',
  'elegant solutions',
  'robust web applications and API systems',
  'JavaScript and Golang',
  'TypeScript and NestJS',
  'PostgreSQL and MongoDB',
  'open-source developer tooling',
  'NestJS modules, CLI utilities, and utility libraries',
]

/**
 * About section: biography + interests, and a philosophy quote card with
 * career highlights. Glass cards reveal on scroll.
 */
export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <ChapterHeading
        chapter="01"
        eyebrow="About"
        title="Crafting digital experiences."
        description="Scroll through the story — the text lights up as you read."
      />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left: bio + interests */}
        <Reveal>
          <div className="glass-strong flex h-full flex-col gap-6 rounded-2xl p-6 sm:p-8">
            <ScrollScrubbedParagraph
              text={profile.bio}
              highlights={BIO_HIGHLIGHTS}
              className="text-muted-foreground"
            />

            <div className="mt-auto">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="size-4 text-primary" aria-hidden />
                Interests
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="glass rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground hover:shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
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
            <AnimatedBorder always className="rounded-2xl">
              <figure className="relative p-6 sm:p-7">
                <Quote
                  className="absolute -top-3 left-6 size-6 rounded-full bg-gradient-to-r from-primary to-accent-secondary p-1 text-primary-foreground shadow-[0_0_16px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                  aria-hidden
                />
                <blockquote className="text-lg font-medium leading-relaxed tracking-tight">
                  {profile.philosophy}
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  — My working philosophy
                </figcaption>
              </figure>
            </AnimatedBorder>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="glass-strong rounded-2xl p-6 sm:p-7">
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
