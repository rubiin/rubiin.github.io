import { createFileRoute } from '@tanstack/react-router'
import { Blocks, Palette, Rocket } from 'lucide-react'
import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { SectionHeading } from '@/components/home/section-heading'
import { Reveal } from '@/components/animations/reveal'
import { TiltCard } from '@/components/animations/tilt-card'

export const Route = createFileRoute('/')({
  component: Home,
})

const PILLARS = [
  {
    title: 'Build',
    icon: Blocks,
    body: 'Scalable applications with TanStack, TypeScript, and clean architecture — designed to be maintained for years, not weeks.',
  },
  {
    title: 'Design',
    icon: Palette,
    body: 'Design systems, tokens, and interaction design that make interfaces feel intentional and premium.',
  },
  {
    title: 'Ship',
    icon: Rocket,
    body: 'From idea to production with performance budgets, accessibility, and deployment pipelines that never get in the way.',
  },
]

function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      {/* What I do — teaser; full sections land in Task 8 */}
      <section id="what-i-do" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="What I do"
          title="Design, build, ship — end to end."
          description="I work across the whole stack, but I specialize in the craft that makes products feel special."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ title, icon: Icon, body }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <TiltCard className="h-full rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
