'use client'

import {
  Brain,
  Cloud,
  Layers,
  Layout,
  Server,
  Smartphone,
  Braces,
  Atom,
  Container,
  Database,
  TerminalSquare,
  Cpu,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Reveal } from '@/components/animations/reveal'
import { ProgressCircle } from '@/components/animations/progress-circle'
import { ChapterHeading } from '@/components/home/chapter-heading'
import { SkillsOrbit } from '@/components/home/skills-orbit'
import { skillCategories } from '@/data/skills'
import { yearsSince } from '@/lib/constants'
import type { Skill } from '@/types'

const CATEGORY_ICONS: Record<string, typeof Layout> = {
  Frontend: Layout,
  Backend: Server,
  'AI / ML': Brain,
  DevOps: Cloud,
  Mobile: Smartphone,
  'Full Stack': Layers,
}

/** Floating tech-logos strip under the rings — decorative (`aria-hidden`). */
const FLOATING_LOGOS = [
  { icon: Braces, label: 'TypeScript' },
  { icon: Atom, label: 'React' },
  { icon: Server, label: 'NestJS' },
  { icon: Container, label: 'Docker' },
  { icon: Database, label: 'PostgreSQL' },
  { icon: Cpu, label: 'Golang' },
  { icon: TerminalSquare, label: 'Linux' },
]

function SkillTile({ skill }: { skill: Skill }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="glass-strong group flex w-full flex-col items-center gap-3 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_48px_-16px_color-mix(in_oklab,var(--primary)_50%,transparent)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <ProgressCircle value={skill.level} label={skill.name} size={92} stroke={7} />
          <span className="text-sm font-medium text-foreground">{skill.name}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{yearsSince(skill.since)} years of experience</p>
          {skill.technologies && (
            <p className="text-muted-foreground">{skill.technologies.join(' · ')}</p>
          )}
          {skill.relatedProjects && skill.relatedProjects.length > 0 && (
            <p className="text-muted-foreground">Used in: {skill.relatedProjects.join(', ')}</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export function SkillsSection() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SkillsOrbit />

      <div className="relative">
        <ChapterHeading
          chapter="02"
          eyebrow="Skills"
          title="A full-stack toolkit, sharpened for years."
          description="Proficiency rings for my core stack. Hover a ring for years of experience and related projects."
        />

        <Reveal>
          <TooltipProvider delayDuration={150}>
            <Tabs defaultValue={skillCategories[0]?.name} className="w-full">
              <TabsList
                variant="line"
                className="mb-10 h-auto flex-wrap gap-1.5 rounded-full border border-border/40 bg-muted/30 p-1.5 backdrop-blur-sm"
              >
                {skillCategories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.name] ?? Layout
                  return (
                    <TabsTrigger
                      key={cat.name}
                      value={cat.name}
                      className="rounded-full px-4 after:hidden data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent-secondary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_6px_24px_-8px_color-mix(in_oklab,var(--primary)_70%,transparent)] dark:data-[state=active]:text-[#05060e]"
                    >
                      <Icon />
                      {cat.name}
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {skillCategories.map((cat) => (
                <TabsContent key={cat.name} value={cat.name} className="mt-0">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {cat.skills.map((skill) => (
                      <SkillTile key={skill.name} skill={skill} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TooltipProvider>
        </Reveal>

        {/* Floating tech logos */}
        <Reveal delay={0.1} className="mt-12">
          <div aria-hidden className="flex flex-wrap items-center justify-center gap-3">
            {FLOATING_LOGOS.map(({ icon: Icon, label }, i) => (
              <span
                key={label}
                className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-muted-foreground motion-reduce:animate-none animate-[float-y_5s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.35}s` }}
              >
                <Icon className="size-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
