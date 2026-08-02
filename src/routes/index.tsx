import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { AboutSection } from '@/components/home/about-section'
import { SkillsSection } from '@/components/home/skills-section'
import { ExperienceSection } from '@/components/home/experience-section'
import { ProjectsSection } from '@/components/home/projects-section'
import { ContactCta } from '@/components/home/contact-cta'
import { SectionDivider } from '@/components/animations/section-divider'
import { buildMeta } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: buildMeta({
      title: 'Rubin Bhandari — Software Engineer',
      description:
        'Portfolio and blog of Rubin Bhandari — full-stack developer crafting robust web applications and API systems with JavaScript, TypeScript, NestJS, and Golang.',
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
      <SectionDivider />
      <SkillsSection />
      <SectionDivider flip />
      <ExperienceSection />
      <SectionDivider />
      <ProjectsSection />
      <ContactCta />
    </>
  )
}
