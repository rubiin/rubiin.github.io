'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Brain, Cloud, Layers, Layout, Server, Smartphone } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Reveal } from '@/components/animations/reveal'
import { SectionHeading } from '@/components/home/section-heading'
import { SkillsOrbit } from '@/components/home/skills-orbit'
import { skillCategories } from '@/data/skills'
import type { Skill } from '@/types'

const CATEGORY_ICONS: Record<string, typeof Layout> = {
  Frontend: Layout,
  Backend: Server,
  'AI / ML': Brain,
  DevOps: Cloud,
  Mobile: Smartphone,
  'Full Stack': Layers,
}

/** Progress bar that animates its width when scrolled into view. */
function AnimatedBar({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setWidth(value)
      return
    }
    // Small rAF ramp so the bar grows smoothly (~700ms).
    const start = performance.now()
    const duration = 700
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setWidth(value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduced])

  return (
    <div ref={ref} className={className}>
      <Progress value={width} />
    </div>
  )
}

function SkillRow({ skill }: { skill: Skill }) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-foreground">{skill.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{skill.level}%</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{skill.years} years of experience</p>
              {skill.technologies && (
                <p className="text-muted-foreground">{skill.technologies.join(' · ')}</p>
              )}
              {skill.relatedProjects && skill.relatedProjects.length > 0 && (
                <p className="text-muted-foreground">
                  Used in: {skill.relatedProjects.join(', ')}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
        <AnimatedBar value={skill.level} className="col-span-2 w-full" />
      </div>
    </TooltipProvider>
  )
}

export function SkillsSection() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SkillsOrbit />

      <div className="relative">
        <SectionHeading
          eyebrow="Skills"
          title="A full-stack toolkit, sharpened for years."
          description="Hover a skill for years of experience and related projects. Bars fill as you scroll."
        />

        <Reveal>
          <Tabs defaultValue={skillCategories[0]?.name} className="w-full">
            <TabsList variant="line" className="mb-8 flex-wrap">
              {skillCategories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.name] ?? Layout
                return (
                  <TabsTrigger key={cat.name} value={cat.name}>
                    <Icon />
                    {cat.name}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {skillCategories.map((cat) => (
              <TabsContent key={cat.name} value={cat.name} className="mt-0">
                <div className="grid gap-5 rounded-xl border bg-card p-6 sm:p-8 md:grid-cols-2">
                  {cat.skills.map((skill) => (
                    <SkillRow key={skill.name} skill={skill} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  )
}
