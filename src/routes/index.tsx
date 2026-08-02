import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { AboutSection } from '@/components/home/about-section'
import { SkillsSection } from '@/components/home/skills-section'
import { ExperienceSection } from '@/components/home/experience-section'
import { ProjectsSection } from '@/components/home/projects-section'
import { ContactCta } from '@/components/home/contact-cta'

export const Route = createFileRoute('/')({
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
