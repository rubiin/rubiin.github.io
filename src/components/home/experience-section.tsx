'use client'

import { useRef } from 'react'
import { motion, useScroll, useReducedMotion, useSpring } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/animations/reveal'
import { SectionHeading } from '@/components/home/section-heading'
import { experience } from '@/data/experience'

/**
 * Vertical experience timeline: a gradient line grows as the section
 * scrolls into view, with one Accordion per role.
 */
export function ExperienceSection() {
  const lineRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 80%', 'end 60%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Experience"
        title="Places I've built things."
        description="Four roles, one through-line: shipping design-driven software with a performance mindset."
      />

      <div className="relative">
        {/* Timeline line — grows on scroll */}
        {/* left-2.5 (0.625rem) aligns the line with the node centers (0.625rem
            from the container at both breakpoints) */}
        <div ref={lineRef} className="absolute top-0 bottom-0 left-2.5 w-px bg-border">
          {!reduced && (
            <motion.div
              className="absolute inset-0 origin-top bg-gradient-to-b from-primary via-primary to-accent"
              style={{ scaleY }}
            />
          )}
        </div>

        <ol className="space-y-6 pl-10 sm:pl-14">
          {experience.map((item, i) => (
            <Reveal key={item.company} delay={i * 0.05}>
              <li className="relative">
                {/* Node */}
                <span
                  className="absolute -left-10 top-5 flex size-5 items-center justify-center rounded-full border border-primary/40 bg-background sm:-left-14"
                  aria-hidden
                >
                  <span className="size-2 rounded-full bg-primary" />
                </span>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={item.company} className="rounded-xl border bg-card px-5">
                    <AccordionTrigger className="text-left">
                      <span className="flex flex-col gap-1 py-2">
                        <span className="text-base font-semibold tracking-tight">
                          {item.role}
                          {item.current && (
                            <span className="ml-2 align-middle text-xs font-medium text-primary">
                              ● Current
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.company} · {item.start} — {item.end ?? 'Present'}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {item.achievements.map((a) => (
                          <li key={a.slice(0, 24)} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {item.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="font-normal">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
