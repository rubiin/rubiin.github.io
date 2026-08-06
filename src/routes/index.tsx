import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { AboutSection } from '@/components/home/about-section'
import { SkillsSection } from '@/components/home/skills-section'
import { ExperienceSection } from '@/components/home/experience-section'
import { ProjectsSection } from '@/components/home/projects-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { ContactSection } from '@/components/home/contact-section'
import { ChapterDivider } from '@/components/home/chapter-divider'
import { ChapterProgress } from '@/components/layout/chapter-progress'
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

/**
 * The home page reads as a story in six chapters — About → Skills →
 * Experience → Projects → Testimonials → Contact — separated by quiet
 * scene-change dividers and tracked by the fixed chapter rail.
 */
function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <ChapterDivider className="mt-2" />
      <AboutSection />
      <ChapterDivider />
      <SkillsSection />
      <ChapterDivider />
      <ExperienceSection />
      <ChapterDivider />
      <ProjectsSection />
      <ChapterDivider />
      <TestimonialsSection />
      <ChapterDivider />
      <ContactSection />
      <ChapterProgress />
    </>
  )
}
