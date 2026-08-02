import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { AboutSection } from '@/components/home/about-section'
import { SkillsSection } from '@/components/home/skills-section'
import { ExperienceSection } from '@/components/home/experience-section'
import { ProjectsSection } from '@/components/home/projects-section'
import { ContactCta } from '@/components/home/contact-cta'
import { buildMeta } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: buildMeta({
      title: 'Devina — Creative Developer & Full-Stack Engineer',
      description:
        'Portfolio and blog of Devina — creative developer crafting premium web experiences with React, TypeScript, Three.js, and the TanStack ecosystem.',
      path: '/',
    }),
  }),
  component: Home,
})

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactCta />
    </>
  )
}
