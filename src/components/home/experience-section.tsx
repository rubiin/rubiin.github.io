'use client'

import { useRef } from 'react'
import { motion, useScroll, useReducedMotion, useSpring } from 'motion/react'
import { Briefcase, CheckCircle2 } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/animations/reveal'
import { ChapterHeading } from '@/components/home/chapter-heading'
import { ScrollScrubbedParagraph } from '@/components/home/scroll-scrubbed-paragraph'
import { experience } from '@/data/experience'

/** Per-role story phrases that light up in the gradient as you read. */
const ROLE_STORY_HIGHLIGHTS: Record<string, { description: string[]; achievements: string[] }> = {
  'Takeo.ai': {
    description: ['modern, performant, maintainable code', 'client and internal projects'],
    achievements: ['multi-disciplinary teams'],
  },
  'EB Pearls': {
    description: ['Node.js, MongoDB, and Express applications'],
    achievements: ['user authentication and authorization'],
  },
  'Rosebay Consult': {
    description: ['distributed applications'],
    achievements: ['Solidity', 'vulnerabilities'],
  },
  'Cheetah Webtech': {
    description: ['PHP and WordPress'],
    achievements: ['CMS and inventory-management projects'],
  },
  'Hitech Nepal': {
    description: ['restaurant-management mobile app'],
    achievements: ['project-management skills'],
  },
}

const NO_PHRASES: string[] = []

/**
 * Vertical experience timeline: a gradient line grows as the section
 * scrolls into view, with one expanding Accordion milestone per role.
 * Cards lift with a soft glow on hover.
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
      <ChapterHeading
        chapter="03"
        eyebrow="Experience"
        title="Places I've built things."
        description="Four roles, one through-line: shipping design-driven software with a performance mindset."
      />

      <div className="relative">
        {/* Timeline line — grows on scroll */}
        <div ref={lineRef} className="absolute top-0 bottom-0 left-2.5 w-px bg-border">
          <motion.div
            className="absolute inset-0 origin-top bg-gradient-to-b from-primary via-primary to-accent-secondary shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_60%,transparent)] motion-reduce:hidden"
            style={reduced ? undefined : { scaleY }}
          />
        </div>

        <ol className="space-y-6 pl-10 sm:pl-14">
          {experience.map((item, i) => (
            <li key={item.company} className="relative">
              <Reveal delay={i * 0.05}>
                {/* Glowing node */}
                <span
                  className="absolute -left-10 top-5 flex size-5 items-center justify-center rounded-full border border-primary/50 bg-background shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_50%,transparent)] sm:-left-14"
                  aria-hidden
                >
                  <span className="size-2 rounded-full bg-gradient-to-r from-primary to-accent-secondary" />
                </span>

                <Accordion
                  type="single"
                  collapsible
                  // Current role starts open so its story is visible and
                  // lights up as the reader scrolls.
                  defaultValue={experience[0]?.company}
                  className="w-full"
                >
                  <AccordionItem
                    value={item.company}
                    className="glass-strong overflow-hidden rounded-2xl transition-all duration-300 hover:border-primary/35 hover:shadow-[0_20px_56px_-20px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
                  >
                    <AccordionTrigger className="px-5 text-left sm:px-6">
                      <span className="flex flex-col gap-1 py-2">
                        <span className="flex items-center gap-2 font-display text-base font-semibold tracking-tight">
                          <Briefcase className="hidden size-4 text-primary sm:inline" aria-hidden />
                          {item.role}
                          {item.current && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              <span aria-hidden>●</span> Current
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.company} · {item.start} — {item.end ?? 'Present'}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-4 px-5 pb-5 sm:px-6">
                        {/* Story intro — scrubbed as the reader scrolls */}
                        <ScrollScrubbedParagraph
                          text={item.description}
                          highlights={
                            ROLE_STORY_HIGHLIGHTS[item.company]?.description ?? NO_PHRASES
                          }
                          className="text-sm leading-relaxed text-muted-foreground"
                        />
                        {/* The role's achievements — one read-along stream */}
                        <ScrollScrubbedParagraph
                          text={item.achievements.join('\n\n')}
                          highlights={
                            ROLE_STORY_HIGHLIGHTS[item.company]?.achievements ?? NO_PHRASES
                          }
                          icon={<CheckCircle2 className="size-4" />}
                          className="space-y-2.5 text-sm leading-relaxed text-muted-foreground"
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {item.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="font-normal">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
